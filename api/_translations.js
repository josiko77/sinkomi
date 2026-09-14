// api/_translations.js
//
// Diccionario central de textos para las versiones de idioma indexables
// (sinkomi.es/de/, /en/, /sv/, /ar/, /zh/...). Un solo archivo, un idioma
// nuevo = un bloque nuevo aquí, sin tocar el resto del código.
//
// Esto NO traduce el chat (eso ya lo tiene SINKOMI con DeepL en tiempo real,
// y sigue funcionando exactamente igual). Esto es solo lo que un buscador
// como Google lee la primera vez que visita /de/, /en/, etc. — el título,
// la meta descripción y un resumen corto de la web en ese idioma.
//
// El árabe (ar) lleva dir:'rtl' — la función api/lang/[locale].js ya lee
// ese valor y pone <html dir="rtl"> automáticamente, así que el navegador
// alinea el texto de derecha a izquierda solo con este dato, sin más código.
//
// Nota sobre 'zh': esto solo crea la página /zh/ indexable para Google. El
// selector de idioma del chat en vivo y de la propia web (ES/DE/EN/SV) es
// código aparte que todavía no incluye chino — eso queda pendiente para
// otra sesión si se quiere que la web entera se pueda ver en chino.

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

  sv: {
    dir: 'ltr',
    htmlLang: 'sv',
    pageTitle: 'Lägenheter och hus från privatpersoner på Balearerna utan provision | SINKOMI',
    metaDescription: 'SINKOMI är plattformen för att köpa, sälja eller hyra bostäder direkt av privatpersoner på Balearerna (Mallorca, Menorca, Ibiza och Formentera) — utan provision och utan mäklare. Prata direkt med ägaren.',
    ogDescription: 'Köp, sälj eller hyr på Balearerna utan provision, direkt med ägaren. Kontrakt ingår, klara att skriva under.',
    h1: 'Prata med den som har nycklarna.',
    subtitle: 'SINKOMI är den första provisionsfria fastighetsplattformen på Balearerna. Inga mellanhänder, ingen provision — bara du och ägaren.',
    ctaPrimary: 'Se bostäder',
    ctaSecondary: 'Annonsera gratis',
    featureCommission: '0% provision',
    featureChat: 'Direktchatt med ägaren',
    featureContract: 'Hyreskontrakt och handpenningsavtal ingår',
    islandsIntro: 'Fyra öar, en marknad, inga mellanhänder:',
    islands: ['Mallorca', 'Menorca', 'Ibiza', 'Formentera'],
    switchNote: 'Den här sidan visar en översikt på svenska. Hela webbplatsen (sökning, filter, chatt) körs på sinkomi.es — när du klickar nedan ställs språket automatiskt in på svenska.',
    goToSite: 'Gå till hela webbplatsen på svenska',
  },

  ar: {
    dir: 'rtl',
    htmlLang: 'ar',
    pageTitle: 'شقق ومنازل من أصحابها مباشرة في جزر البليار بدون عمولة | SINKOMI',
    metaDescription: 'SINKOMI هي المنصة لشراء أو بيع أو استئجار العقارات مباشرة من أصحابها في جزر البليار (مايوركا، مينوركا، إيبيزا وفورمنتيرا) — بدون عمولة وبدون وسطاء. تحدث مباشرة مع المالك.',
    ogDescription: 'اشترِ أو بِع أو استأجر في جزر البليار بدون عمولة، بالتواصل المباشر مع المالك. العقود متضمنة وجاهزة للتوقيع.',
    h1: 'تحدث مع من يملك المفاتيح.',
    subtitle: 'SINKOMI هي أول منصة عقارية بدون عمولة في جزر البليار. بدون وسطاء، بدون عمولات — أنت والمالك فقط.',
    ctaPrimary: 'عرض العقارات',
    ctaSecondary: 'أضف إعلانك مجانًا',
    featureCommission: '0% عمولة',
    featureChat: 'محادثة مباشرة مع المالك',
    featureContract: 'عقد الإيجار وعقد العربون متضمنان',
    islandsIntro: 'أربع جزر، سوق واحد، بدون وسطاء:',
    islands: ['مايوركا', 'مينوركا', 'إيبيزا', 'فورمنتيرا'],
    switchNote: 'تعرض هذه الصفحة نظرة عامة باللغة العربية. الموقع الكامل (البحث، الفلاتر، المحادثة) يعمل على sinkomi.es — عند الضغط أدناه سيتم تفعيل اللغة العربية تلقائيًا.',
    goToSite: 'الانتقال إلى الموقع الكامل باللغة العربية',
  },

  zh: {
    dir: 'ltr',
    htmlLang: 'zh',
    pageTitle: '巴利阿里群岛业主直售公寓和房屋，无中介费 | SINKOMI',
    metaDescription: 'SINKOMI 是一个平台，让您在巴利阿里群岛（马略卡、梅诺卡、伊维萨和福门特拉）直接与业主买卖或租赁房产——没有中介费，没有中介机构。直接与业主沟通。',
    ogDescription: '在巴利阿里群岛买卖或租赁房产，无中介费，直接与业主沟通。合同已包含，随时可签署。',
    h1: '直接联系持有钥匙的人。',
    subtitle: 'SINKOMI 是巴利阿里群岛第一个免中介费的房地产平台。没有中间商，没有佣金——只有您和业主。',
    ctaPrimary: '查看房源',
    ctaSecondary: '免费发布房源',
    featureCommission: '0% 中介费',
    featureChat: '与业主直接聊天',
    featureContract: '包含租赁合同和定金合同',
    islandsIntro: '四个岛屿，一个市场，没有中间商：',
    islands: ['马略卡', '梅诺卡', '伊维萨', '福门特拉'],
    switchNote: '本页面显示中文概览。完整网站（搜索、筛选、聊天）运行在 sinkomi.es 上——点击下方链接将自动切换为中文。',
    goToSite: '前往中文完整网站',
  },

};

const SUPPORTED_LOCALES = Object.keys(TRANSLATIONS);

function getTranslation(locale) {
  return TRANSLATIONS[locale] || null;
}

module.exports = { TRANSLATIONS, SUPPORTED_LOCALES, getTranslation };
