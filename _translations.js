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

  // Cuando toque inglés, sueco o árabe, se añade un bloque igual que el de
  // arriba con la clave 'en', 'sv' o 'ar'. El árabe además necesita dir:'rtl'.

};

const SUPPORTED_LOCALES = Object.keys(TRANSLATIONS);

function getTranslation(locale) {
  return TRANSLATIONS[locale] || null;
}

module.exports = { TRANSLATIONS, SUPPORTED_LOCALES, getTranslation };
