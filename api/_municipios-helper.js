// api/_municipios-helper.js
//
// Pieza compartida que usan las dos páginas de zona (Comprar y Alquilar). No es una
// dirección visitable por sí misma (Vercel ignora los archivos que empiezan por "_"),
// solo contiene el código común para no escribirlo dos veces.

const SUPABASE_URL = 'https://utrkwpepgviadaygjfyr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_JLpiGWpCo6PGCpQ0Ca-HZQ_CasEBaeh';
const SITE_URL = 'https://sinkomi.es';

// Lista completa: los 67 municipios oficiales de Baleares + sus pedanías, barrios y
// urbanizaciones más buscadas (la misma lista que usa el buscador de la propia web).
const MUNICIPALITY_LIST = ["Palma","Santa Catalina","Portixol","El Molinar","Génova","Son Vida","Es Coll d'en Rabassa","Sant Jordi","Son Ferriol","Son Rapinya","Calvià","Santa Ponça","Magaluf","Palmanova","Peguera","Portals Nous","Son Ferrer","El Toro","Costa d'en Blanes","Illetes","Cas Català","Portals Vells","Llucmajor","s'Arenal","Badia Gran","Badia Blava","Cala Pi","Vallgornera","Marratxí","Pòrtol","Sa Cabaneta","Es Pont d'Inca","Es Figueral","Inca","Muro","Platja de Muro","Can Picafort","Manacor","Porto Cristo","s'Illot","Cala Murada","Cales de Mallorca","Son Macià","Alcúdia","Port d'Alcúdia","Mal Pas","Bonaire","Pollença","Port de Pollença","Cala Sant Vicenç","Sóller","Port de Sóller","Fornalutx","Andratx","Port d'Andratx","Camp de Mar","Sant Elm","s'Arracó","Artà","Colònia de Sant Pere","Canyamel","Capdepera","Cala Rajada","Font de sa Cala","Son Servera","Cala Millor","Cala Bona","Costa dels Pins","Sant Llorenç des Cardassar","Sa Coma","Cala Millor Nord","Santanyí","Cala d'Or","Cala Figuera","Portopetro","s'Alqueria Blanca","Calonge","es Llombards","Cala Santanyí","Cala Llombards","Campos","Sa Ràpita","Ses Covetes","es Trenc","Felanitx","Portocolom","Cas Concos","s'Horta","Cala Ferrera","Ses Salines","Colònia de Sant Jordi","es Dolç","Montuïri","Algaida","Randa","Pina","Santa Eugènia","Sencelles","Biniali","Binissalem","Lloseta","Alaró","Consell","Santa Maria del Camí","Bunyola","Palmanyola","Valldemossa","Deià","Esporles","Banyalbufar","Estellencs","Puigpunyent","Escorca","Lluc","Sa Calobra","Selva","Caimari","Biniamar","Moscari","Mancor de la Vall","Campanet","Búger","Sa Pobla","Llubí","Santa Margalida","Son Serra de Marina","Petra","Vilafranca de Bonany","Ariany","Maria de la Salut","Costitx","Lloret de Vistalegre","Sineu","Sant Joan","Porreres","Maó","Llucmaçanes","Sant Climent","Es Grau","Cala Mesquida","Ciutadella de Menorca","Cala en Blanes","Cala en Forcat","Cala Morell","Son Xoriguer","Cala en Bosc","Cala Blanca","Cales Piques","Cap d'Artrutx","Alaior","Son Bou","Cala en Porter","Torre Soli Nou","Son Vitamina","Es Mercadal","Fornells","Arenal d'en Castell","Son Parc","Coves Noves","Na Macaret","Port d'Addaia","Es Castell","Cala Sant Esteve","Sol del Este","Son Vilar","Sant Lluís","Binibeca Vell","Binissafúller","Punta Prima","Alcaufar","Cala Torret","Biniancolla","Ferreries","Cala Galdana","Sant Tomàs","Es Migjorn Gran","Binigaus","Eivissa","Dalt Vila","Marina Botafoch","Talamanca","Figueretes","Ses Figueretes","Sant Antoni de Portmany","Sant Rafel de sa Creu","Santa Agnès de Corona","Sant Mateu d'Albarca","Cala de Bou","Port des Torrent","Cala Gració","Cala Conta","Santa Eulària des Riu","Santa Gertrudis de Fruitera","Jesús","Sant Carles de Peralta","Es Puig d'en Valls","Cala Llonga","Siesta","Es Canar","Santa Eulalia","Sant Josep de sa Talaia","Sant Jordi de ses Salines","Es Cubells","Cala Vedella","Cala Tarida","Cala d'Hort","Platges de Comte","Platja d'en Bossa","Can Bossa","Sant Joan de Labritja","Sant Llorenç de Balàfia","Sant Miquel de Balansat","Sant Vicent de sa Cala","Portinatx","Cala de Sant Vicent","Formentera","Sant Francesc Xavier","Sant Ferran de ses Roques","La Savina","Es Pujols","El Pilar de la Mola","Es Caló de Sant Agustí","Cala Saona"];

const BOT_PATTERN = /facebookexternalhit|WhatsApp|Twitterbot|Slackbot|LinkedInBot|TelegramBot|Discordbot|Googlebot|bingbot|Pinterest|redditbot|SkypeUriPreview|Applebot|DuckDuckBot|vercel-screenshot/i;

// "Sant Josep de sa Talaia" -> "sant-josep-de-sa-talaia" (sin tildes, todo minúsculas)
function slugify(text){
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita tildes
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

async function generateMunicipioPage(req, res, operacion){
  const municipioSlug = req.query.municipio;
  const municipio = findMunicipioBySlug(municipioSlug);
  const userAgent = req.headers['user-agent'] || '';
  const isBot = BOT_PATTERN.test(userAgent);
  const opWord = operacion === 'alquiler' ? 'alquiler' : 'comprar';
  const spaUrl = municipio
    ? `${SITE_URL}/?zona=${encodeURIComponent(municipio)}&op=${opWord}`
    : SITE_URL;

  if(!municipio){
    res.writeHead(302, { Location: SITE_URL });
    res.end();
    return;
  }

  // A las personas normales las mandamos directas a la web real, con el filtro ya aplicado.
  if(!isBot){
    res.writeHead(302, { Location: spaUrl });
    res.end();
    return;
  }

  try{
    const dbType = operacion === 'alquiler' ? 'Alquiler' : 'Venta';
    const resp = await fetch(
      `${SUPABASE_URL}/rest/v1/properties?type=eq.${dbType}&active=eq.true&or=(municipality.eq.${encodeURIComponent(municipio)},nucleo.eq.${encodeURIComponent(municipio)})&select=id,title,price,images,municipality,nucleo&order=created_at.desc`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const props = await resp.json();
    const list = Array.isArray(props) ? props : [];

    const accion = operacion === 'alquiler' ? 'en alquiler' : 'en venta';
    const pageTitle = `Inmuebles ${accion} en ${escapeHtml(municipio)} sin comisiones | SINKOMI`;
    const description = `Descubre inmuebles ${accion} en ${escapeHtml(municipio)}, Illes Balears. Habla directamente con el propietario, sin agencias ni comisiones, en SINKOMI.`;

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
<link rel="canonical" href="${spaUrl}">
<meta property="og:title" content="${pageTitle}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${spaUrl}">
<meta property="og:site_name" content="SINKOMI">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
  <h1>Inmuebles ${accion} en ${escapeHtml(municipio)}</h1>
  <p>${description}</p>
  <ul>${itemsHtml || '<li>Ahora mismo no hay inmuebles publicados en esta zona, pero pronto habrá — vuelve a mirar en unos días.</li>'}</ul>
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
