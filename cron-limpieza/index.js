// Cloudflare Worker con cron diario. Borra páginas que se empezaron pero
// nunca se publicaron (1+ día) y limpia del Storage las fotos/videos que
// esas páginas habían subido — sin esto, quedaban huérfanos para siempre.
//
// Deploy (una sola vez, desde esta carpeta):
//   npx wrangler deploy
//   npx wrangler secret put VITE_SUPABASE_URL
//   npx wrangler secret put VITE_SUPABASE_PUBLISHABLE_KEY
//
// Para probarlo a mano: abrir la URL que te da wrangler.dev en el navegador,
// corre la limpieza al toque y te muestra cuántas páginas/archivos borró.

const BUCKET = "archivos-paginas";
const MARCADOR_URL = "/storage/v1/object/public/";

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(limpiar(env));
  },
  async fetch(request, env) {
    const resultado = await limpiar(env);
    return new Response(JSON.stringify(resultado, null, 2), {
      headers: { "content-type": "application/json" },
    });
  },
};

async function limpiar(env) {
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/limpiar_paginas_abandonadas`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const filas = await res.json();
  if (!Array.isArray(filas)) {
    return { paginasBorradas: 0, archivosBorrados: 0, error: filas };
  }

  const rutas = new Set();
  for (const fila of filas) {
    for (const url of extraerUrls(fila.data)) {
      const i = url.indexOf(`${MARCADOR_URL}${BUCKET}/`);
      if (i !== -1) {
        const ruta = url.slice(i + `${MARCADOR_URL}${BUCKET}/`.length);
        if (ruta) rutas.add(ruta);
      }
    }
  }

  let archivosBorrados = 0;
  if (rutas.size > 0) {
    const delRes = await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}`, {
      method: "DELETE",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prefixes: [...rutas] }),
    });
    if (delRes.ok) archivosBorrados = rutas.size;
  }

  return { paginasBorradas: filas.length, archivosBorrados };
}

function extraerUrls(valor, out = []) {
  if (typeof valor === "string") {
    if (valor.includes(MARCADOR_URL)) out.push(valor);
  } else if (Array.isArray(valor)) {
    for (const v of valor) extraerUrls(v, out);
  } else if (valor && typeof valor === "object") {
    for (const k in valor) extraerUrls(valor[k], out);
  }
  return out;
}
