// api/_translations.js
//
// Diccionario central de textos para las versiones de idioma indexables
// (sinkomi.es/de/, /en/, /sv/, /ar/...). Un solo archivo, un idioma nuevo
// = un bloque nuevo aquí, sin tocar el resto del código.
//
// Esto NO traduce el chat (eso ya lo tiene SINKOMI con DeepL en tiempo real,
// y sigue funcionando exactamente igual). Esto es solo lo que un buscador
// como Google lee la primera vez que visita /de/, /en/, etc. — el título,
// la meta descripción y un resumen corto de la web en ese idioma.

const TRANSLATIONS = {

  de: {
    dir: 'ltr',
    htmlLang: 'de',
    pageTitle: 'Wohnungen und Häuser von Privatpersonen auf den Balearen ohne Provision | SINKOMI',
    metaDescription: 'SINKOMI ist die Plattform, um auf den Balearen (Mallorca, Menorca, Ibiza und Formentera) direkt von Privatpersonen zu kaufen, verkaufen oder mieten — ohne Provision und ohne Makler. Sprechen Sie direkt mit dem Eigentümer.',
    ogDescription: 'Kaufen, verkaufen oder mieten Sie auf den Balearen ohne Provision, direkt mit dem Eigentümer. Verträge inklusive, unterschriftsfertig.',
    h1: 'Sprechen Sie mit dem, der die Schlüssel hat.',
    subtitle: 'SINKOMI ist die erste provisionsfreie Immobilienplattform der Balearen. Keine Vermittler, keine Provisionen — nur Sie und der Eigentümer.',
    ctaPrimary: 'Immobilien ansehen',
    ctaSecondary: 'Kostenlos inserieren',
    featureCommission: '0% Provision',
    featureChat: 'Direkter Chat mit dem Eigentümer',
    featureContract: 'Mietvertrag und Anzahlungsvertrag inklusive',
    islandsIntro: 'Vier Inseln, ein Markt, keine Vermittler:',
    islands: ['Mallorca', 'Menorca', 'Ibiza', 'Formentera'],
    switchNote: 'Diese Seite zeigt eine Übersicht auf Deutsch. Die vollständige Website (Suche, Filter, Chat) läuft auf sinkomi.es — beim Klick unten wird die Sprache automatisch auf Deutsch eingestellt.',
    goToSite: 'Zur vollständigen Website auf Deutsch',
  },

  en: {
    dir: 'ltr',
    htmlLang: 'en',
    pageTitle: 'Apartments and Houses for Sale by Owner in the Balearic Islands, No Commission | SINKOMI',
    metaDescription: 'SINKOMI is the platform to buy, sell or rent property directly from private owners in the Balearic Islands (Mallorca, Menorca, Ibiza and Formentera) — no commission, no agencies. Talk directly to the owner.',
    ogDescription: 'Buy, sell or rent in the Balearic Islands with no commission, talking directly to the owner. Contracts included, ready to sign.',
    h1: 'Talk to the person who holds the keys.',
    subtitle: 'SINKOMI is the first commission-free real estate platform in the Balearic Islands. No middlemen, no commissions — just you and the owner.',
    ctaPrimary: 'View properties',
    ctaSecondary: 'List for free',
    featureCommission: '0% commission',
    featureChat: 'Direct chat with the owner',
    featureContract: 'Rental and deposit contracts included',
    islandsIntro: 'Four islands, one market, no middlemen:',
    islands: ['Mallorca', 'Menorca', 'Ibiza', 'Formentera'],
    switchNote: 'This page shows an overview in English. The full website (search, filters, chat) runs on sinkomi.es — clicking below will switch the language to English automatically.',
    goToSite: 'Go to the full website in English',
  },

  // Cuando toque sueco o árabe, se añade un bloque igual que el de arriba
  // con la clave 'sv' o 'ar'. El árabe además necesita dir:'rtl'.

};

const SUPPORTED_LOCALES = Object.keys(TRANSLATIONS);

function getTranslation(locale) {
  return TRANSLATIONS[locale] || null;
}

module.exports = { TRANSLATIONS, SUPPORTED_LOCALES, getTranslation };
