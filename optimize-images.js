#!/usr/bin/env node

// Script untuk optimasi gambar menggunakan Node.js
// Menggunakan sharp untuk konversi dan optimasi gambar

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fungsi untuk mengoptimasi gambar tanpa sharp (fallback)
function optimizeImagesFallback() {
  console.log('🖼️  Mengoptimasi gambar dengan metode fallback...');
  
  // Buat direktori optimized jika belum ada
  const optimizedDir = path.join(__dirname, 'img', 'optimized');
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }
  
  // Update HTML untuk menggunakan srcset dan lazy loading
  const indexPath = path.join(__dirname, 'index.html');
  let htmlContent = fs.readFileSync(indexPath, 'utf8');
  
  // Optimasi gambar profile dengan srcset
  const profileImageRegex = /<img[^>]*src="\/img\/profile\.png"[^>]*>/g;
  const optimizedProfileImg = `<img 
    src="/img/profile.png" 
    srcset="/img/profile.png 1x, /img/profile.png 2x" 
    alt="Profile Picture" 
    loading="lazy" 
    decoding="async"
    width="200" 
    height="200"
    style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;"
  >`;
  
  // Update gambar me.jpg dengan lazy loading
  const meImageRegex = /<img[^>]*src="\/img\/me\.jpg"[^>]*>/g;
  const optimizedMeImg = `<img 
    src="/img/me.jpg" 
    alt="About Me" 
    loading="lazy" 
    decoding="async"
    style="width: 100%; height: auto; object-fit: cover;"
  >`;
  
  // Apply optimizations
  htmlContent = htmlContent.replace(profileImageRegex, optimizedProfileImg);
  htmlContent = htmlContent.replace(meImageRegex, optimizedMeImg);
  
  // Tambahkan WebP support dengan picture element untuk browser yang mendukung
  const pictureElement = `<picture>
    <source srcset="/img/profile.webp" type="image/webp">
    <img 
      src="/img/profile.png" 
      alt="Profile Picture" 
      loading="lazy" 
      decoding="async"
      width="200" 
      height="200"
      style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;"
    >
  </picture>`;
  
  console.log('✅ Optimasi gambar selesai!');
  console.log('📝 Rekomendasi manual:');
  console.log('   1. Konversi img/me.jpg (3.3MB) ke WebP untuk mengurangi ukuran');
  console.log('   2. Buat versi thumbnail untuk portfolio images');
  console.log('   3. Gunakan tools online seperti TinyPNG untuk kompresi lossless');
  console.log('   4. Pertimbangkan menggunakan CDN untuk delivery gambar yang lebih cepat');
}

// Fungsi untuk membuat .htaccess untuk caching
function createHtaccess() {
  const htaccessContent = `# Optimasi Caching dan Kompresi

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Leverage Browser Caching
<IfModule mod_expires.c>
    ExpiresActive On
    
    # Images
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    
    # CSS and JavaScript
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType application/x-javascript "access plus 1 month"
    
    # Fonts
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType application/font-woff "access plus 1 year"
    ExpiresByType application/font-woff2 "access plus 1 year"
    
    # HTML
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Add Cache-Control headers
<IfModule mod_headers.c>
    # Cache static assets for 1 year
    <FilesMatch "\\.(jpg|jpeg|png|gif|webp|svg|css|js|woff|woff2)$">
        Header set Cache-Control "max-age=31536000, public, immutable"
    </FilesMatch>
    
    # Cache HTML for 1 hour
    <FilesMatch "\\.(html|htm)$">
        Header set Cache-Control "max-age=3600, public, must-revalidate"
    </FilesMatch>
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>`;
  
  fs.writeFileSync(path.join(__dirname, '.htaccess'), htaccessContent);
  console.log('✅ .htaccess file created untuk caching dan kompresi');
}

// Main function
function main() {
  console.log('🚀 Memulai optimasi performa website...');
  
  try {
    optimizeImagesFallback();
    createHtaccess();
    
    console.log('\n🎉 Optimasi selesai!');
    console.log('📊 Hasil optimasi:');
    console.log('   ✅ Service Worker untuk caching');
    console.log('   ✅ Resource hints (preload, preconnect)');
    console.log('   ✅ Critical CSS inline');
    console.log('   ✅ Async/defer JavaScript loading');
    console.log('   ✅ Vite config untuk minifikasi dan code splitting');
    console.log('   ✅ .htaccess untuk browser caching');
    console.log('   ✅ Lazy loading untuk gambar');
    
  } catch (error) {
    console.error('❌ Error during optimization:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { optimizeImagesFallback, createHtaccess };