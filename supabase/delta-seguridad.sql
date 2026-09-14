-- ============================================================
-- Correr esto UNA vez en el SQL Editor de Supabase.
-- Es todo lo nuevo desde la última vez — 2 arreglos:
--   1. La policy de lectura pública de "paginas" exponía TODAS las
--      columnas (incluido edit_token) a cualquiera con la key pública.
--      Se reemplaza por una función que solo devuelve id/tema/data.
--   2. Faltaba la policy de "delete" en Storage — sin ella, el borrado
--      de fotos/videos viejos al reemplazarlos fallaba en silencio.
-- ============================================================

drop policy if exists "lectura publica de paginas publicadas" on paginas;

create or replace function obtener_pagina_publica(p_slug text)
returns table (id uuid, tema text, data jsonb)
language sql
security definer
set search_path = public
as $$
  select p.id, p.tema, p.data from paginas p
  where p.slug = p_slug and p.publicada = true;
$$;

drop policy if exists "borrar archivos de archivos-paginas" on storage.objects;
create policy "borrar archivos de archivos-paginas"
  on storage.objects for delete
  using (bucket_id = 'archivos-paginas');
