// Cloudflare Pages Function — se activa automáticamente para /p/:slug.
// WhatsApp/Facebook/etc no ejecutan JS al armar la vista previa de un link,
// así que el título/imagen que ve la SPA en el navegador (seteados por JS)
// no sirven para eso. Acá interceptamos el pedido, buscamos la página en
// Supabase, y devolvemos el mismo index.html pero con las etiquetas
// og:title/og:description/og:image ya completas con los datos reales de
// esa página — antes de que llegue al bot que arma la miniatura.
export async function onRequest(context) {
  const { params, env, request } = context;
  const slug = params.slug;

  const assetResponse = await env.ASSETS.fetch(request);
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return assetResponse;
  }

  try {
    const html = await assetResponse.text();
    // Vía la función obtener_pagina_publica (no un select directo a la
    // tabla): esa devuelve solo id/tema/data, nunca edit_token/pago_id.
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/obtener_pagina_publica`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_slug: slug }),
    });
    const filas = await res.json();
    const pagina = Array.isArray(filas) ? filas[0] : null;

    if (!pagina) {
      return new Response(html, {
        status: assetResponse.status,
        headers: assetResponse.headers,
      });
    }

    const meta = construirMeta(pagina.tema, pagina.data || {});
    const salida = aplicarMeta(html, meta);

    return new Response(salida, {
      status: assetResponse.status,
      headers: assetResponse.headers,
    });
  } catch {
    return assetResponse;
  }
}

function limpiarDestacado(texto) {
  return String(texto || "").replace(/==/g, "");
}

function construirMeta(tema, data) {
  if (tema === "invitacion") {
    const nombre = data?.anfitrion?.nombre || "";
    const eyebrow = data?.anfitrion?.eyebrow || "";
    return {
      title: [nombre, eyebrow].filter(Boolean).join(" — ") || "Invitación",
      description: data?.bienvenida?.subtitulo || data?.frase || "",
      image: data?.fotoPrincipal || "",
    };
  }
  if (tema === "landing-fleepix") {
    return {
      title: data?.identidad?.nombreEmpresa || "Landing",
      description: limpiarDestacado(data?.hero?.descripcion),
      image: data?.hero?.fotoPrincipal || data?.identidad?.logoUrl || "",
    };
  }
  if (tema === "landing-vortex") {
    return {
      title: data?.identidad?.nombreEmpresa || "Landing",
      description: limpiarDestacado(data?.hero?.descripcion),
      image: data?.hero?.fondoUrl || data?.identidad?.logoUrl || "",
    };
  }
  return { title: "Generador", description: "", image: "" };
}

function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function aplicarMeta(html, meta) {
  const titulo = escaparHtml(meta.title || "Generador");
  const descripcion = escaparHtml(meta.description || "");

  let salida = html
    .replace(/<title>[^<]*<\/title>/, `<title>${titulo}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${descripcion}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${titulo}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${descripcion}" />`);

  if (meta.image) {
    const imagenTag = `<meta property="og:image" content="${escaparHtml(meta.image)}" />\n    `;
    salida = salida.replace('<meta name="twitter:card"', `${imagenTag}<meta name="twitter:card"`);
  }

  return salida;
}
