// api/sitemap.js
//
// Qué hace esta función y por qué existe:
// Hasta ahora, sitemap.xml era un archivo escrito a mano. Eso significaba que
// solo tenía 1 inmueble de todos los que hay activos, le faltaban las páginas
// de traspaso y las de idioma, y usaba sinkomi.es sin "www" (provocando una
// redirección extra en cada URL). Como los enlaces del menú ya no apuntan
// directamente a las páginas de municipio, este sitemap es prácticamente el
// único camino que tiene Google para descubrirlas — si no se actualiza solo,
// los inmuebles nuevos nunca llegan a indexarse.
//
// Esta función genera el sitemap.xml en el momento, cada vez que Google (o
// cualquiera) lo visita: lee los inmuebles activos reales de Supabase y arma
// la lista completa de comprar/alquiler/traspasar por municipio, más las
// páginas de idioma — siempre actualizado, sin que nadie tenga que tocarlo.

const { MUNICIPALITY_LIST, slugify } = require('./_municipios-helper');
const { SUPPORTED_LOCALES } = require('./_translations');

const SUPABASE_URL = 'https://utrkwpepgviadaygjfyr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_JLpiGWpCo6PGCpQ0Ca-HZQ_CasEBaeh';
const SITE_URL = 'https://www.sinkomi.es';
const PUBLIC_TABLE = 'properties_public';

function urlEntry(loc, opts = {}){
  const lastmod = opts.lastmod ? `\n    <lastmod>${opts.lastmod}</lastmod>` : '';
  const changefreq = opts.changefreq || 'weekly';
  const priority = opts.priority != null ? opts.priority : 0.6;
  return `  <url>\n    <loc>${loc}</loc>${lastmod}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

module.exports = async (req, res) => {
  try{
    const entries = [];

    // Home
    entries.push(urlEntry(`${SITE_URL}/`, { changefreq: 'daily', priority: 1.0 }));

    // Versiones de idioma (de, en, sv, ar...)
    SUPPORTED_LOCALES.forEach(loc => {
      entries.push(urlEntry(`${SITE_URL}/${loc}/`, { changefreq: 'monthly', priority: 0.5 }));
    });

    // Páginas de municipio: comprar, alquiler y traspasar para cada uno de
    // los municipios/zonas de la lista compartida (la misma que usa el resto
    // de la web, para que nunca se desincronicen).
    MUNICIPALITY_LIST.forEach(municipio => {
      const slug = slugify(municipio);
      entries.push(urlEntry(`${SITE_URL}/comprar/${slug}`));
      entries.push(urlEntry(`${SITE_URL}/alquiler/${slug}`));
      entries.push(urlEntry(`${SITE_URL}/traspasar/${slug}`, { priority: 0.5 }));
    });

    // Inmuebles activos reales, leídos de Supabase en el momento — así un
    // inmueble publicado hace 5 minutos ya sale aquí, sin que nadie edite nada.
    const resp = await fetch(
      `${SUPABASE_URL}/rest/v1/${PUBLIC_TABLE}?active=eq.true&select=id,created_at&order=created_at.desc&limit=5000`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const properties = await resp.json();
    if(Array.isArray(properties)){
      properties.forEach(p => {
        const lastmod = p.created_at ? String(p.created_at).slice(0, 10) : undefined;
        entries.push(urlEntry(`${SITE_URL}/inmueble/${p.id}`, { lastmod, priority: 0.8 }));
      });
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>`;

    res.writeHead(200, {
      'Content-Type': 'application/xml; charset=utf-8',
      // 1 hora de caché: suficiente para no golpear Supabase en cada visita
      // de Google, y lo bastante corto para que un inmueble nuevo aparezca pronto.
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    });
    res.end(xml);

  }catch(e){
    console.error('Error generando el sitemap:', e);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error generando el sitemap');
  }
};
