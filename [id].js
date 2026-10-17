// api/inmueble/[id].js
//
// Qué hace esta función y por qué existe:
// SINKOMI es una sola página que se construye con JavaScript (una SPA). Eso funciona
// genial para las personas, pero WhatsApp, Instagram y (en parte) Google no ejecutan
// ese JavaScript cuando visitan un enlace — solo miran el código HTML de primeras.
// Por eso, hasta ahora, compartir el enlace de un inmueble no mostraba su foto ni su
// precio, y Google tenía difícil saber que esa ficha existía como página propia.
//
// Esta función resuelve las dos cosas a la vez: cuando algo (un robot, o un enlace
// compartido) pide /inmueble/ID, le devolvemos una página sencilla con el título, la
// foto, el precio y la descripción reales de ESE inmueble, ya escritos en el HTML,
// sin depender de JavaScript.
//
// A las personas de verdad (navegando desde un móvil u ordenador) las mandamos
// directas a la web real de SINKOMI con ese inmueble ya abierto — no ven esta página
// intermedia en absoluto, es invisible para ellas.

const SUPABASE_URL = 'https://utrkwpepgviadaygjfyr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_JLpiGWpCo6PGCpQ0Ca-HZQ_CasEBaeh';

// El host bueno es www: sinkomi.es devuelve un 308 hacia aquí.
const SITE_URL = 'https://www.sinkomi.es';

// Lectura pública: siempre contra la vista, nunca contra la tabla. Así esta función
// no puede filtrar por accidente ni la dirección exacta de un inmueble que pidió
// ocultarla, ni ninguno de los campos de verificación del propietario.
const PUBLIC_TABLE = 'properties_public';

// Solo los campos que esta página necesita pintar. Pedir la fila entera traía
// también los datos de la Nota Simple, que aquí no pintan nada.
const CAMPOS = 'id,title,description,price,images,municipality,nucleo,location,type,category';

// Lista de "robots" conocidos a los que SÍ les enseñamos esta página especial.
// A todos los demás (personas normales) los mandamos directos a la web real.
const BOT_PATTERN = /facebookexternalhit|WhatsApp|Twitterbot|Slackbot|LinkedInBot|TelegramBot|Discordbot|Googlebot|bingbot|Pinterest|redditbot|SkypeUriPreview|Applebot|DuckDuckBot|vercel-screenshot/i;

function escapeHtml(text){
  if(!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = async (req, res) => {
  const { id } = req.query;
  const userAgent = req.headers['user-agent'] || '';
  const isBot = BOT_PATTERN.test(userAgent);
  const spaUrl = `${SITE_URL}/?inmueble=${encodeURIComponent(id)}`;
  // URL "bonita" y estable — la que ve cualquier persona en la barra de
  // direcciones. Es la que debe ir en canonical y og:url; spaUrl es solo el
  // destino de redirección para humanos.
  const canonicalUrl = `${SITE_URL}/inmueble/${encodeURIComponent(id)}`;

  // A las personas normales las mandamos directas a la web de verdad, sin pasar por aquí.
  if(!isBot){
    res.writeHead(302, { Location: spaUrl });
    res.end();
    return;
  }

  try{
    const resp = await fetch(
      `${SUPABASE_URL}/rest/v1/${PUBLIC_TABLE}?id=eq.${encodeURIComponent(id)}&select=${CAMPOS}&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const rows = await resp.json();
    const prop = Array.isArray(rows) ? rows[0] : null;

    if(!prop){
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html><html><head><title>Inmueble no encontrado · SINKOMI</title><meta http-equiv="refresh" content="0;url=${SITE_URL}"></head><body>Redirigiendo a SINKOMI…</body></html>`);
      return;
    }

    const title = escapeHtml(prop.title || 'Inmueble en Baleares');
    const location = escapeHtml(prop.nucleo || prop.municipality || prop.location || 'Baleares');
    // "en venta"/"en alquiler" según el tipo, para que el título use la
    // misma palabra clave por la que la gente busca este tipo de anuncio.
    const opWord = prop.type === 'Alquiler' ? 'en alquiler' : (prop.category ? 'en traspaso' : 'en venta');
    const description = escapeHtml((prop.description || '').slice(0, 260))
      || `Inmueble ${opWord} en ${location}, Illes Balears, publicado directamente por su propietario. Sin comisión de agencia, en SINKOMI.`;
    const image = (Array.isArray(prop.images) && prop.images[0]) ? prop.images[0] : `${SITE_URL}/og-default.jpg`;
    const price = prop.price ? Number(prop.price).toLocaleString('es-ES') + ' €' : '';
    const pageTitle = `${title} · ${opWord} en ${location} · ${price} | SINKOMI`;

    const schema = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      "name": prop.title,
      "description": prop.description || title,
      "url": canonicalUrl,
      "image": Array.isArray(prop.images) ? prop.images : [image],
      "offers": {
        "@type": "Offer",
        "price": prop.price,
        "priceCurrency": "EUR",
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": prop.nucleo || prop.municipality,
        "addressRegion": "Illes Balears",
        "addressCountry": "ES",
      },
    };

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>${pageTitle}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonicalUrl}">
<meta property="og:type" content="product">
<meta property="og:title" content="${title} · ${price}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${escapeHtml(image)}">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:site_name" content="SINKOMI">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title} · ${price}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${escapeHtml(image)}">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
  <h1>${title}</h1>
  <p><strong>${price}</strong> · ${opWord} · ${location}</p>
  <img src="${escapeHtml(image)}" alt="${title}" style="max-width:600px;">
  <p>${description}</p>
  <p><a href="${spaUrl}">Ver este inmueble en SINKOMI</a></p>
</body>
</html>`;

    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800', // 30 min de caché
    });
    res.end(html);

  }catch(e){
    console.error('Error generando la página del inmueble:', e);
    res.writeHead(302, { Location: spaUrl });
    res.end();
  }
};
