// api/lang/[locale].js
//
// Qué hace esta función y por qué existe:
// El selector de idioma que ya tiene SINKOMI (ES/DE/EN/SV en la cabecera) traduce
// el texto en el propio navegador de la persona, con JavaScript. Eso está genial
// para alguien que ya está en la web y cambia de idioma con un clic — pero para
// Google es invisible: por debajo, la URL sigue siendo sinkomi.es en español,
// así que nunca aparecemos en resultados de búsqueda en alemán, inglés, etc.
//
// Esta función crea una versión real y propia para cada idioma: sinkomi.es/de/,
// /en/, /sv/... Cuando un buscador visita esa URL, le devolvemos un resumen de
// la web ya escrito en ese idioma (título, meta descripción, texto), sin depender
// de JavaScript. Cuando visita una persona real, la mandamos directa a la web de
// siempre, pero ya con el idioma correcto activado automáticamente.

const { getTranslation, SUPPORTED_LOCALES } = require('../_translations');

const SITE_URL = 'https://www.sinkomi.es';

const BOT_PATTERN = /facebookexternalhit|WhatsApp|Twitterbot|Slackbot|LinkedInBot|TelegramBot|Discordbot|Googlebot|bingbot|Pinterest|redditbot|SkypeUriPreview|Applebot|DuckDuckBot|vercel-screenshot/i;

function escapeHtml(text){
  if(!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Etiquetas hreflang: le dicen a Google qué versión de idioma corresponde a cuál,
// para que no las trate como contenido duplicado y enseñe la correcta a cada
// buscador según su idioma/país.
function buildHreflangTags(){
  const tags = [`<link rel="alternate" hreflang="es" href="${SITE_URL}/">`];
  SUPPORTED_LOCALES.forEach(loc => {
    tags.push(`<link rel="alternate" hreflang="${loc}" href="${SITE_URL}/${loc}/">`);
  });
  tags.push(`<link rel="alternate" hreflang="x-default" href="${SITE_URL}/">`);
  return tags.join('\n');
}

module.exports = async (req, res) => {
  const { locale } = req.query;
  const t = getTranslation(locale);
  const userAgent = req.headers['user-agent'] || '';
  const isBot = BOT_PATTERN.test(userAgent);

  // Idioma que no tenemos todavía (ej. /fr/ antes de traducirlo): a la home normal.
  if(!t){
    res.writeHead(302, { Location: SITE_URL });
    res.end();
    return;
  }

  // setlang=xx lo lee un pequeño script en index.html y activa el idioma
  // automáticamente con la misma función selectLang() que ya usa el menú.
  const spaUrl = `${SITE_URL}/?setlang=${locale}`;

  if(!isBot){
    res.writeHead(302, { Location: spaUrl });
    res.end();
    return;
  }

  try{
    const islandsList = t.islands.map(i => escapeHtml(i)).join(', ');

    const html = `<!DOCTYPE html>
<html lang="${t.htmlLang}" dir="${t.dir}">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(t.pageTitle)}</title>
<meta name="description" content="${escapeHtml(t.metaDescription)}">
<link rel="canonical" href="${SITE_URL}/${locale}/">
${buildHreflangTags()}
<meta property="og:title" content="${escapeHtml(t.pageTitle)}">
<meta property="og:description" content="${escapeHtml(t.ogDescription)}">
<meta property="og:url" content="${SITE_URL}/${locale}/">
<meta property="og:site_name" content="SINKOMI">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <h1>${escapeHtml(t.h1)}</h1>
  <p>${escapeHtml(t.subtitle)}</p>
  <ul>
    <li>${escapeHtml(t.featureCommission)}</li>
    <li>${escapeHtml(t.featureChat)}</li>
    <li>${escapeHtml(t.featureContract)}</li>
  </ul>
  <p>${escapeHtml(t.islandsIntro)} ${islandsList}</p>
  <p>${escapeHtml(t.switchNote)}</p>
  <p><a href="${spaUrl}">${escapeHtml(t.goToSite)}</a></p>
</body>
</html>`;

    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    });
    res.end(html);

  }catch(e){
    console.error('Error generando la página de idioma:', e);
    res.writeHead(302, { Location: spaUrl });
    res.end();
  }
};
