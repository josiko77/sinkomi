// api/_municipios-helper.js
//
// Pieza compartida que usan las tres páginas de zona (Comprar, Alquilar y Traspasar).
// No es una dirección visitable por sí misma (Vercel ignora los archivos que empiezan
// por "_"), solo contiene el código común para no escribirlo tres veces.

const SUPABASE_URL = 'https://utrkwpepgviadaygjfyr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_JLpiGWpCo6PGCpQ0Ca-HZQ_CasEBaeh';

// El host bueno es www: sinkomi.es devuelve un 308 hacia aquí. Si generamos
// enlaces sin www, cada uno provoca un salto extra y Google los trata como
// redirecciones en vez de como páginas.
const SITE_URL = 'https://www.sinkomi.es';

// Lectura pública: siempre contra la vista, nunca contra la tabla. La vista solo
// expone inmuebles activos y devuelve la dirección y las coordenadas ya
// enmascaradas según lo que haya pedido cada propietario.
const PUBLIC_TABLE = 'properties_public';

// SINKOMI ya no es solo Baleares: cubre toda España. Por eso esta lista de
// municipios YA NO ES FIJA — antes tenía los 67 municipios de Baleares escritos
// a mano, lo que (a) no incluía nada fuera de las islas y (b) generaba una
// página de zona (y una entrada en el sitemap) para sitios sin ni un solo
// anuncio, algo que a Google no le gusta nada (contenido pobre/vacío a escala).
//
// Ahora las zonas se calculan en el momento, leyendo de Supabase qué
// municipios/núcleos tienen al menos un inmueble activo — así la lista crece
// sola según entra gente nueva a publicar, en cualquier punto de España, y
// nunca existe una página de zona vacía.
//
// Devuelve, para los inmuebles activos, tres listas de nombres de
// municipio/núcleo (una por operación: venta, alquiler, traspaso), calculadas
// de forma independiente —igual que hace generateMunicipioPage más abajo—
// porque un mismo inmueble puede contar para "alquiler" y, si es un traspaso,
// también para "traspasar" a la vez.
async function getActiveLocationsByOperation(){
  const resp = await fetch(
    `${SUPABASE_URL}/rest/v1/${PUBLIC_TABLE}?active=eq.true&select=type,category,municipality,nucleo&limit=5000`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  const rows = await resp.json();
  const comprar = new Set();
  const alquiler = new Set();
  const traspasar = new Set();
  if(Array.isArray(rows)){
    rows.forEach(r => {
      const locs = [r.municipality, r.nucleo].filter(Boolean);
      if(r.type === 'Venta') locs.forEach(l => comprar.add(l));
      if(r.type === 'Alquiler') locs.forEach(l => alquiler.add(l));
      if(TRASPASO_CATEGORIES.includes(r.category)) locs.forEach(l => traspasar.add(l));
    });
  }
  return {
    comprar: Array.from(comprar),
    alquiler: Array.from(alquiler),
    traspasar: Array.from(traspasar),
  };
}

// El traspaso es una categoría propia (distinta de Bar/Oficina/Nave industrial...
// que ahora son solo TIPOS de local en venta/alquiler normales, sin alquiler
// obligatorio). Solo un "Traspaso" real implica ceder un contrato de
// arrendamiento en curso — por eso esta página de zona solo lo filtra a él.
const TRASPASO_CATEGORIES = ["Traspaso"];

const BOT_PATTERN = /facebookexternalhit|WhatsApp|Twitterbot|Slackbot|LinkedInBot|TelegramBot|Discordbot|Googlebot|bingbot|Pinterest|redditbot|SkypeUriPreview|Applebot|DuckDuckBot|vercel-screenshot/i;

// Nombre alternativo (el que se busca en español/inglés) para los municipios
// donde el nombre oficial en catalán es notablemente distinto — sobre todo
// los pueblos turísticos de Ibiza y Menorca. Se añade entre paréntesis en el
// título y el H1, para no perder a quien busca "San Antonio" en vez de
// "Sant Antoni de Portmany". Para municipios fuera de Baleares simplemente no
// hay entrada aquí, así que displayName() los deja tal cual.
const ALT_NAMES = {
  "Palma": "Palma de Mallorca",
  "Eivissa": "Ibiza",
  "Maó": "Mahón",
  "Ciutadella de Menorca": "Ciudadela",
  "Sant Antoni de Portmany": "San Antonio",
  "Sant Josep de sa Talaia": "San José",
  "Sant Joan de Labritja": "San Juan",
  "Sant Miquel de Balansat": "San Miguel",
  "Sant Francesc Xavier": "San Francisco Javier",
  "Sant Ferran de ses Roques": "San Fernando",
  "Sant Rafel de sa Creu": "San Rafael",
  "Sant Carles de Peralta": "San Carlos",
  "Sant Lluís": "San Luis",
  // Variante ortográfica muy usada (con "s" en vez de "ç") — igual que hace
  // Idealista en el texto de sus propios anuncios, aunque su campo oficial
  // de municipio use "Santa Ponça".
  "Santa Ponça": "Santa Ponsa",
  "Sant Climent": "San Clemente",
};

// Aclaración de ubicación para nombres que se repiten en distintos puntos de
// Baleares y podrían confundirse entre sí (a diferencia de ALT_NAMES, esto no
// es "cómo lo busca la gente", es "a qué lugar exacto nos referimos"):
// - "Sant Jordi" es un barrio de Palma.
// - "Colònia de Sant Jordi" es la pedanía costera del municipio de Ses Salines.
// - "Sant Jordi de ses Salines" es un pueblo de Ibiza, dentro de Sant Josep de
//   sa Talaia — nada que ver con los dos anteriores, pese al nombre parecido.
const LOCATION_HINTS = {
  "Sant Jordi": "Palma",
  "Colònia de Sant Jordi": "Ses Salines",
  "Sant Jordi de ses Salines": "Ibiza",
};

function slugify(text){
  return text.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function escapeHtml(text){
  if(!text) return '';
  return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Añade "(Nombre alternativo)" cuando existe, para que el título use la
// palabra exacta que la gente busca, sin crear una página duplicada.
function displayName(municipio){
  const alt = ALT_NAMES[municipio] || LOCATION_HINTS[municipio];
  return alt ? `${municipio} (${alt})` : municipio;
}

// Título y meta descripción por operación, ya con las palabras clave reales
// que la gente busca ("particular", "sin agencia", "propietario"), en vez de
// redacciones genéricas tipo "Negocios y pisos en venta en X". Sin mencionar
// Baleares a secas: SINKOMI ya cubre toda España, así que el texto no debe
// dar por hecho una región concreta.
function buildCopy(operacion, municipio){
  const m = escapeHtml(displayName(municipio));
  if(operacion === 'alquiler'){
    return {
      pageTitle: `Alquiler de pisos en ${m} de particulares, sin agencia | SINKOMI`,
      h1: `Alquiler en ${m} sin agencias`,
      description: `Encuentra pisos y casas en alquiler en ${m}, publicados directamente por sus propietarios. Sin agencias ni comisiones: habla con el propietario en SINKOMI.`,
    };
  }
  if(operacion === 'traspasar'){
    return {
      pageTitle: `Traspaso de negocios en ${m} sin comisión, trato directo | SINKOMI`,
      h1: `Traspasos de negocio en ${m}`,
      description: `Bares, locales y negocios en traspaso en ${m}, publicados por sus propios dueños. Sin intermediarios ni comisión de agencia, en SINKOMI.`,
    };
  }
  // comprar / venta
  return {
    pageTitle: `Pisos y casas en venta en ${m} de particulares, sin comisión | SINKOMI`,
    h1: `Pisos y casas en venta en ${m}`,
    description: `Compra directamente al propietario en ${m}, sin pagar comisión de agencia. Anuncios reales de particulares, verificados, en SINKOMI.`,
  };
}

async function generateMunicipioPage(req, res, operacion){
  const municipioSlug = req.query.municipio;
  const userAgent = req.headers['user-agent'] || '';
  const isBot = BOT_PATTERN.test(userAgent);

  if(!municipioSlug){
    res.writeHead(302, { Location: SITE_URL });
    res.end();
    return;
  }

  try{
    let filterParam, accion;
    if(operacion === 'alquiler'){
      filterParam = 'type=eq.Alquiler';
      accion = 'en alquiler';
    } else if(operacion === 'traspasar'){
      const catList = TRASPASO_CATEGORIES.map(c => '"' + encodeURIComponent(c) + '"').join(',');
      filterParam = `category=in.(${catList})`;
      accion = 'en traspaso';
    } else {
      filterParam = 'type=eq.Venta';
      accion = 'en venta';
    }

    // Traemos todos los inmuebles activos de ESTA operación (sin filtrar aún
    // por municipio): de ahí resolvemos qué nombre real de municipio/núcleo
    // corresponde al slug pedido —ya no contra una lista fija— y de paso ya
    // tenemos el listado entero, sin necesitar una segunda consulta.
    const resp = await fetch(
      `${SUPABASE_URL}/rest/v1/${PUBLIC_TABLE}?${filterParam}&active=eq.true&select=id,title,price,images,municipality,nucleo&order=created_at.desc`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const allProps = await resp.json();
    const rows = Array.isArray(allProps) ? allProps : [];

    let municipio = null;
    for(const p of rows){
      if(p.municipality && slugify(p.municipality) === municipioSlug){ municipio = p.municipality; break; }
      if(p.nucleo && slugify(p.nucleo) === municipioSlug){ municipio = p.nucleo; break; }
    }

    const spaUrl = municipio
      ? `${SITE_URL}/?zona=${encodeURIComponent(municipio)}&op=${operacion}`
      : SITE_URL;
    // URL "bonita" y estable — la misma que ve cualquier persona en la barra de
    // direcciones (/comprar/soller, /alquiler/soller...). Es la que debe ir en
    // canonical y og:url; spaUrl es solo el destino de redirección para humanos.
    const canonicalUrl = municipio ? `${SITE_URL}/${operacion}/${municipioSlug}` : SITE_URL;

    // Sin ningún inmueble activo de esta operación en ese municipio: la página
    // no existe (en vez de servir, e indexar, una página vacía).
    if(!municipio){
      res.writeHead(302, { Location: SITE_URL });
      res.end();
      return;
    }

    if(!isBot){
      res.writeHead(302, { Location: spaUrl });
      res.end();
      return;
    }

    const list = rows.filter(p => p.municipality === municipio || p.nucleo === municipio);

    const { pageTitle, h1, description } = buildCopy(operacion, municipio);

    const itemsHtml = list.map(p => {
      const price = p.price ? Number(p.price).toLocaleString('es-ES') + ' €' : '';
      const img = (Array.isArray(p.images) && p.images[0]) ? p.images[0] : '';
      return `<li><a href="${SITE_URL}/inmueble/${p.id}"><img src="${escapeHtml(img)}" alt="${escapeHtml(p.title)}" style="max-width:200px;"><h3>${escapeHtml(p.title)}</h3><p>${price}</p></a></li>`;
    }).join('');

    const schema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": pageTitle,
      "itemListElement": list.map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `${SITE_URL}/inmueble/${p.id}`,
      })),
    };

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>${pageTitle}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${canonicalUrl}">
<meta property="og:title" content="${pageTitle}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:site_name" content="SINKOMI">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
  <h1>${h1}</h1>
  <p>${description}</p>
  <ul>${itemsHtml || '<li>Ahora mismo no hay nada publicado en esta zona, pero pronto habrá — vuelve a mirar en unos días.</li>'}</ul>
  <p><a href="${spaUrl}">Ver todos en SINKOMI</a></p>
</body>
</html>`;

    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800',
    });
    res.end(html);

  }catch(e){
    console.error('Error generando la página de municipio:', e);
    res.writeHead(302, { Location: SITE_URL });
    res.end();
  }
}

module.exports = { generateMunicipioPage, getActiveLocationsByOperation, slugify };
