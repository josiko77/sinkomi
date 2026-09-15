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

// Lista completa: los 67 municipios oficiales de Baleares + sus pedanías, barrios y
// urbanizaciones más buscadas (la misma lista que usa el buscador de la propia web).
const MUNICIPALITY_LIST = ["Palma","Santa Catalina","Portixol","El Molinar","Génova","Son Vida","Es Coll d'en Rabassa","Sant Jordi","Son Ferriol","Son Rapinya","Calvià","Santa Ponça","Magaluf","Palmanova","Peguera","Portals Nous","Son Ferrer","El Toro","Costa d'en Blanes","Illetes","Cas Català","Portals Vells","Llucmajor","s'Arenal","Badia Gran","Badia Blava","Cala Pi","Vallgornera","Marratxí","Pòrtol","Sa Cabaneta","Es Pont d'Inca","Es Figueral","Inca","Muro","Platja de Muro","Can Picafort","Manacor","Porto Cristo","s'Illot","Cala Murada","Cales de Mallorca","Son Macià","Alcúdia","Port d'Alcúdia","Mal Pas","Bonaire","Pollença","Port de Pollença","Cala Sant Vicenç","Sóller","Port de Sóller","Fornalutx","Andratx","Port d'Andratx","Camp de Mar","Sant Elm","s'Arracó","Artà","Colònia de Sant Pere","Canyamel","Capdepera","Cala Rajada","Font de sa Cala","Son Servera","Cala Millor","Cala Bona","Costa dels Pins","Sant Llorenç des Cardassar","Sa Coma","Cala Millor Nord","Santanyí","Cala d'Or","Cala Figuera","Portopetro","s'Alqueria Blanca","Calonge","es Llombards","Cala Santanyí","Cala Llombards","Campos","Sa Ràpita","Ses Covetes","es Trenc","Felanitx","Portocolom","Cas Concos","s'Horta","Cala Ferrera","Ses Salines","Colònia de Sant Jordi","es Dolç","Montuïri","Algaida","Randa","Pina","Santa Eugènia","Sencelles","Biniali","Binissalem","Lloseta","Alaró","Consell","Santa Maria del Camí","Bunyola","Palmanyola","Valldemossa","Deià","Esporles","Banyalbufar","Estellencs","Puigpunyent","Escorca","Lluc","Sa Calobra","Selva","Caimari","Biniamar","Moscari","Mancor de la Vall","Campanet","Búger","Sa Pobla","Llubí","Santa Margalida","Son Serra de Marina","Petra","Vilafranca de Bonany","Ariany","Maria de la Salut","Costitx","Lloret de Vistalegre","Sineu","Sant Joan","Porreres","Maó","Llucmaçanes","Sant Climent","Es Grau","Cala Mesquida","Ciutadella de Menorca","Cala en Blanes","Cala en Forcat","Cala Morell","Son Xoriguer","Cala en Bosc","Cala Blanca","Cales Piques","Cap d'Artrutx","Alaior","Son Bou","Cala en Porter","Torre Soli Nou","Son Vitamina","Es Mercadal","Fornells","Arenal d'en Castell","Son Parc","Coves Noves","Na Macaret","Port d'Addaia","Es Castell","Cala Sant Esteve","Sol del Este","Son Vilar","Sant Lluís","Binibeca Vell","Binissafúller","Punta Prima","Alcaufar","Cala Torret","Biniancolla","Ferreries","Cala Galdana","Sant Tomàs","Es Migjorn Gran","Binigaus","Eivissa","Dalt Vila","Marina Botafoch","Talamanca","Figueretes","Ses Figueretes","Sant Antoni de Portmany","Sant Rafel de sa Creu","Santa Agnès de Corona","Sant Mateu d'Albarca","Cala de Bou","Port des Torrent","Cala Gració","Cala Conta","Santa Eulària des Riu","Santa Gertrudis de Fruitera","Jesús","Sant Carles de Peralta","Es Puig d'en Valls","Cala Llonga","Siesta","Es Canar","Santa Eulalia","Sant Josep de sa Talaia","Sant Jordi de ses Salines","Es Cubells","Cala Vedella","Cala Tarida","Cala d'Hort","Platges de Comte","Platja d'en Bossa","Can Bossa","Sant Joan de Labritja","Sant Llorenç de Balàfia","Sant Miquel de Balansat","Sant Vicent de sa Cala","Portinatx","Cala de Sant Vicent","Formentera","Sant Francesc Xavier","Sant Ferran de ses Roques","La Savina","Es Pujols","El Pilar de la Mola","Es Caló de Sant Agustí","Cala Saona"];

// Los traspasos no se distinguen por "type" (Venta/Alquiler) como el resto, sino por
// su "category" — igual que hace el propio filtro de la web en renderTraspasosCards().
const TRASPASO_CATEGORIES = ["Traspaso","Bar / Cafetería","Restaurante","Tienda / Comercio","Peluquería / Estética","Oficina","Nave industrial","Local comercial"];

const BOT_PATTERN = /facebookexternalhit|WhatsApp|Twitterbot|Slackbot|LinkedInBot|TelegramBot|Discordbot|Googlebot|bingbot|Pinterest|redditbot|SkypeUriPreview|Applebot|DuckDuckBot|vercel-screenshot/i;

// Nombre alternativo (el que se busca en español/inglés) para los municipios
// donde el nombre oficial en catalán es notablemente distinto — sobre todo
// los pueblos turísticos de Ibiza y Menorca. Se añade entre paréntesis en el
// título y el H1, para no perder a quien busca "San Antonio" en vez de
// "Sant Antoni de Portmany".
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
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function findMunicipioBySlug(slug){
  return MUNICIPALITY_LIST.find(m => slugify(m) === slug) || null;
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
// redacciones genéricas tipo "Negocios y pisos en venta en X".
function buildCopy(operacion, municipio){
  const m = escapeHtml(displayName(municipio));
  if(operacion === 'alquiler'){
    return {
      pageTitle: `Alquiler de pisos en ${m} de particulares, sin agencia | SINKOMI`,
      h1: `Alquiler en ${m} sin agencias`,
      description: `Encuentra pisos y casas en alquiler en ${m}, Illes Balears, publicados directamente por sus propietarios. Sin agencias ni comisiones: habla con el propietario en SINKOMI.`,
    };
  }
  if(operacion === 'traspasar'){
    return {
      pageTitle: `Traspaso de negocios en ${m} sin comisión, trato directo | SINKOMI`,
      h1: `Traspasos de negocio en ${m}`,
      description: `Bares, locales y negocios en traspaso en ${m}, Illes Balears, publicados por sus propios dueños. Sin intermediarios ni comisión de agencia, en SINKOMI.`,
    };
  }
  // comprar / venta
  return {
    pageTitle: `Pisos y casas en venta en ${m} de particulares, sin comisión | SINKOMI`,
    h1: `Pisos y casas en venta en ${m}`,
    description: `Compra directamente al propietario en ${m}, Illes Balears, sin pagar comisión de agencia. Anuncios reales de particulares, verificados, en SINKOMI.`,
  };
}

async function generateMunicipioPage(req, res, operacion){
  const municipioSlug = req.query.municipio;
  const municipio = findMunicipioBySlug(municipioSlug);
  const userAgent = req.headers['user-agent'] || '';
  const isBot = BOT_PATTERN.test(userAgent);
  const spaUrl = municipio
    ? `${SITE_URL}/?zona=${encodeURIComponent(municipio)}&op=${operacion}`
    : SITE_URL;
  // URL "bonita" y estable — la misma que ve cualquier persona en la barra de
  // direcciones (/comprar/soller, /alquiler/soller...). Es la que debe ir en
  // canonical y og:url; spaUrl es solo el destino de redirección para humanos.
  const canonicalUrl = municipio ? `${SITE_URL}/${operacion}/${municipioSlug}` : SITE_URL;

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

    const resp = await fetch(
      `${SUPABASE_URL}/rest/v1/${PUBLIC_TABLE}?${filterParam}&active=eq.true&or=(municipality.eq.${encodeURIComponent(municipio)},nucleo.eq.${encodeURIComponent(municipio)})&select=id,title,price,images,municipality,nucleo&order=created_at.desc`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const props = await resp.json();
    const list = Array.isArray(props) ? props : [];

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
    res.writeHead(302, { Location: spaUrl });
    res.end();
  }
}

module.exports = { generateMunicipioPage, MUNICIPALITY_LIST, slugify };
