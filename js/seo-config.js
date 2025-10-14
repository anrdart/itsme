/**
 * SEO Configuration for ekalliptus.id (Primary Domain)
 * Centralized SEO settings - DO NOT use cross-domain canonicals
 */

const SEO_CONFIG = {
  // Primary domain - MUST match this site only
  SITE_URL: 'https://ekalliptus.id',
  
  // Site Information
  SITE_NAME: 'ekalliptus',
  SITE_TITLE: 'ekalliptus - Solusi Digital Terdepan',
  SITE_DESCRIPTION: 'Ekalliptus - Solusi digital terdepan untuk website development, WordPress, mobile app, dan editing foto/video profesional di Indonesia',
  
  // Business Information
  BUSINESS: {
    name: 'ekalliptus',
    alternateName: 'Ekalliptus Digital Agency',
    email: 'ekalliptus@gmail.com',
    phone: '+62-819-9990-0306',
    whatsapp: '6281999900306',
    foundingYear: '2024',
    country: 'Indonesia',
    region: 'Jakarta',
    latitude: -6.2088,
    longitude: 106.8456,
  },
  
  // Social Media
  SOCIAL: {
    twitter: '@ekalliptus',
    facebook: 'https://facebook.com/ekalliptus',
    instagram: 'https://instagram.com/ekalliptus',
    linkedin: 'https://linkedin.com/company/ekalliptus',
  },
  
  // Images
  IMAGES: {
    logo: '/logo.png',
    ogImage: '/assets/og-image.png',
    heroImage: '/assets/hero-bg.jpg',
  },
  
  // Language & Locale
  LANGUAGE: 'id',
  LOCALE: 'id_ID',
  
  // Theme
  THEME_COLOR: '#0ea5e9',
  BACKGROUND_COLOR: '#0f172a',
};

/**
 * Generate canonical URL for this domain only
 */
function getCanonicalUrl(path = '') {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SEO_CONFIG.SITE_URL}${cleanPath}`;
}

/**
 * Generate Open Graph URL
 */
function getOgUrl(path = '') {
  return getCanonicalUrl(path);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SEO_CONFIG, getCanonicalUrl, getOgUrl };
}
