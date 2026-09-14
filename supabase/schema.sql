-- ============================================================
-- Generador Landing — schema Supabase
-- Pegar entero en el SQL Editor de Supabase (Database > SQL Editor)
-- Sin login: el acceso de edición es por edit_token (uuid en la URL,
-- como un link "privado para editar"), no por usuario/contraseña.
-- ============================================================

create extension if not exists pgcrypto; -- para gen_random_uuid()

-- ============================================================
-- Tablas
-- ============================================================

create table if not exists paginas (
  id uuid primary key default gen_random_uuid(),
  edit_token uuid not null default gen_random_uuid(),
  tema text not null check (tema in ('invitacion', 'landing-fleepix', 'landing-vortex')),
  slug text unique,
  data jsonb not null default '{}'::jsonb,
  publicada boolean not null default false,
  pago_id text,
  monto_pagado numeric,
  moneda text not null default 'ARS',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Por si esta tabla ya existía de una corrida anterior de este mismo
-- archivo (todo acá es seguro de re-pegar y re-correr entero, siempre).
alter table paginas add column if not exists monto_pagado numeric;
alter table paginas add column if not exists moneda text not null default 'ARS';

create index if not exists paginas_slug_idx on paginas (slug) where slug is not null;

create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  pagina_id uuid not null references paginas(id) on delete cascade,
  nombre text not null,
  asiste boolean not null,
  acompanantes int not null default 0,
  mensaje text,
  created_at timestamptz not null default now()
);

create index if not exists rsvps_pagina_id_idx on rsvps (pagina_id);

-- Leads del formulario de contacto de la landing B2B (tema landing-fleepix).
-- Mismo patrón que rsvps: cualquiera puede dejar sus datos en una página
-- publicada, solo el dueño (con su edit_token) puede leerlos después.
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  pagina_id uuid not null references paginas(id) on delete cascade,
  nombre text not null,
  telefono text,
  email text not null,
  mensaje text,
  created_at timestamptz not null default now()
);

create index if not exists leads_pagina_id_idx on leads (pagina_id);

-- ============================================================
-- RLS — por default TODO bloqueado. Solo se abre lo justo:
--   - lectura pública de páginas YA publicadas (para verlas por subdominio)
--   - insertar un RSVP o un lead en una página publicada
-- Todo lo demás (crear, editar, publicar, ver RSVPs/leads) pasa por las
-- funciones de abajo, que validan el edit_token adentro (SECURITY DEFINER).
-- Así el edit_token nunca se "matchea" contra sí mismo en una policy
-- (eso no protege nada), lo valida la función del lado del server.
-- ============================================================

alter table paginas enable row level security;
alter table rsvps enable row level security;
alter table leads enable row level security;

-- OJO: acá NO hay policy de "select" pública sobre paginas. RLS filtra
-- FILAS, no columnas — una policy `using (publicada = true)` expondría
-- TODAS las columnas de cada fila publicada (incluido edit_token) a
-- cualquiera con la key pública, dejando secuestrar cualquier página
-- publicada. Por eso la lectura pública de una página va SIEMPRE por
-- obtener_pagina_publica() de más abajo, que devuelve solo lo necesario.

drop policy if exists "insertar rsvp en pagina publicada" on rsvps;
create policy "insertar rsvp en pagina publicada"
  on rsvps for insert
  with check (
    exists (select 1 from paginas p where p.id = pagina_id and p.publicada = true)
  );

drop policy if exists "insertar lead en pagina publicada" on leads;
create policy "insertar lead en pagina publicada"
  on leads for insert
  with check (
    exists (select 1 from paginas p where p.id = pagina_id and p.publicada = true)
  );

-- ============================================================
-- Funciones (acceso por edit_token)
-- ============================================================

-- Crear una página nueva. Devuelve id + edit_token — el frontend guarda
-- el token en la URL de edición (ej: /crear/invitacion/<token>), no se
-- vuelve a mostrar en ningún otro lado.
create or replace function crear_pagina(p_tema text, p_data jsonb)
returns table (id uuid, edit_token uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_token uuid;
begin
  insert into paginas (tema, data) values (p_tema, p_data)
  returning paginas.id, paginas.edit_token into v_id, v_token;
  return query select v_id, v_token;
end;
$$;

-- Ver una página YA PUBLICADA por su slug (la usan PaginaPublicada.tsx y la
-- Cloudflare Function de /p/:slug para las etiquetas og:*). Solo devuelve
-- id/tema/data — nunca edit_token, pago_id ni monto_pagado.
create or replace function obtener_pagina_publica(p_slug text)
returns table (id uuid, tema text, data jsonb)
language sql
security definer
set search_path = public
as $$
  select p.id, p.tema, p.data from paginas p
  where p.slug = p_slug and p.publicada = true;
$$;

-- Volver a abrir el formulario con el token guardado
create or replace function obtener_pagina_por_token(p_edit_token uuid)
returns setof paginas
language sql
security definer
set search_path = public
as $$
  select * from paginas where edit_token = p_edit_token;
$$;

-- Autoguardado del formulario mientras la persona completa sus datos
create or replace function actualizar_pagina(p_edit_token uuid, p_data jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update paginas set data = p_data, updated_at = now()
  where edit_token = p_edit_token;

  if not found then
    raise exception 'Token inválido';
  end if;
end;
$$;

-- Publicar: hoy la llama el propio formulario (promo "gratis"), el día que
-- se conecte MercadoPago la va a llamar el backend (Cloudflare Function)
-- después de que el webhook confirme el pago — no el cliente directo.
-- monto_pagado/moneda quedan grabados en el momento de publicar para que,
-- si el precio cambia más adelante, cada página conserve lo que pagó
-- realmente (no lo que cuesta hoy).
create or replace function publicar_pagina(
  p_edit_token uuid,
  p_slug text,
  p_pago_id text,
  p_monto_pagado numeric default null,
  p_moneda text default 'ARS'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from paginas where slug = p_slug and edit_token <> p_edit_token) then
    raise exception 'Ese subdominio ya está en uso';
  end if;

  update paginas
  set slug = p_slug,
      publicada = true,
      pago_id = p_pago_id,
      monto_pagado = p_monto_pagado,
      moneda = p_moneda,
      updated_at = now()
  where edit_token = p_edit_token;

  if not found then
    raise exception 'Token inválido';
  end if;
end;
$$;

-- Ver las confirmaciones de RSVP — solo el dueño de la página, con su token
create or replace function obtener_rsvps(p_edit_token uuid)
returns setof rsvps
language sql
security definer
set search_path = public
as $$
  select r.* from rsvps r
  join paginas p on p.id = r.pagina_id
  where p.edit_token = p_edit_token;
$$;

-- Ver los leads del formulario de contacto — solo el dueño, con su token
create or replace function obtener_leads(p_edit_token uuid)
returns setof leads
language sql
security definer
set search_path = public
as $$
  select l.* from leads l
  join paginas p on p.id = l.pagina_id
  where p.edit_token = p_edit_token;
$$;

-- Chequear disponibilidad de subdominio antes de que el usuario pague
create or replace function slug_disponible(p_slug text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select not exists (select 1 from paginas where slug = p_slug and publicada = true);
$$;

-- Borra páginas que se empezaron pero nunca se publicaron, pasados N días
-- (1 por default). La llama una vez al día el cron de cron-limpieza/
-- (Cloudflare Worker) — este solo borra las filas y devuelve su `data`;
-- el worker usa eso para además borrar del Storage las fotos/videos que
-- esa página había subido (eso no se puede hacer desde SQL, hay que
-- pasar por la API de Storage).
create or replace function limpiar_paginas_abandonadas(p_dias_antiguedad int default 1)
returns table (id uuid, data jsonb)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  delete from paginas p
  where p.publicada = false
    and p.created_at < now() - (p_dias_antiguedad || ' days')::interval
  returning p.id, p.data;
end;
$$;

-- ============================================================
-- Storage: fotos/logos/videos subidos desde los formularios.
-- El bucket "archivos-paginas" se crea A MANO desde el Dashboard
-- (Storage > New bucket > nombre "archivos-paginas" > público, límite
-- ~25MB) porque crear buckets requiere la service_role key, no la
-- anon/publishable que usa el frontend. Estas policies van sobre
-- storage.objects, scopeadas a ese bucket una vez creado.
-- Sin login: cualquiera puede subir (mismo modelo de confianza que el
-- resto de la app — el archivo solo queda "vivo" si su página se llega
-- a guardar/publicar).
-- ============================================================

drop policy if exists "lectura publica de archivos-paginas" on storage.objects;
create policy "lectura publica de archivos-paginas"
  on storage.objects for select
  using (bucket_id = 'archivos-paginas');

drop policy if exists "subir archivos a archivos-paginas" on storage.objects;
create policy "subir archivos a archivos-paginas"
  on storage.objects for insert
  with check (bucket_id = 'archivos-paginas');

drop policy if exists "borrar archivos de archivos-paginas" on storage.objects;
create policy "borrar archivos de archivos-paginas"
  on storage.objects for delete
  using (bucket_id = 'archivos-paginas');
