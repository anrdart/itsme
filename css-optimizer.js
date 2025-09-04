#!/usr/bin/env node

// CSS Optimizer untuk menggabungkan dan minifikasi CSS

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Daftar CSS files yang akan digabungkan
const cssFiles = [
  'css/style.css',
  'css/about-modern.css',
  'css/responsive.css',
  'css/modern-dropdown.css',
  'css/modern-sidebar.css',
  'css/cursor-animation.css',
  'css/light-mode-optimized.css'
];

// CSS Critical yang akan di-inline
const criticalCSS = [
  'css/style.css', // Main styles
  'css/about-modern.css' // Profile section
];

// CSS Non-critical yang akan di-lazy load
const nonCriticalCSS = [
  'css/responsive.css',
  'css/modern-dropdown.css',
  'css/modern-sidebar.css',
  'css/cursor-animation.css',
  'css/light-mode-optimized.css',
  'css/enhanced-responsive.css',
  'css/modern-images.css',
  'css/skills-grid.css'
];

function minifyCSS(css) {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove whitespace around certain characters
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    // Remove trailing semicolon before }
    .replace(/;}/g, '}')
    // Remove leading/trailing whitespace
    .trim();
}

function createOptimizedCSS() {
  console.log('🎨 Mengoptimasi CSS files...');
  
  let criticalCSSContent = '';
  let nonCriticalCSSContent = '';
  
  // Gabungkan critical CSS
  criticalCSS.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      criticalCSSContent += content + '\n';
      console.log(`✅ Added critical CSS: ${file}`);
    }
  });
  
  // Gabungkan non-critical CSS
  nonCriticalCSS.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      nonCriticalCSSContent += content + '\n';
      console.log(`✅ Added non-critical CSS: ${file}`);
    }
  });
  
  // Minifikasi CSS
  const minifiedCritical = minifyCSS(criticalCSSContent);
  const minifiedNonCritical = minifyCSS(nonCriticalCSSContent);
  
  // Buat direktori optimized
  const optimizedDir = path.join(__dirname, 'css', 'optimized');
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }
  
  // Simpan CSS yang dioptimasi
  fs.writeFileSync(path.join(optimizedDir, 'critical.min.css'), minifiedCritical);
  fs.writeFileSync(path.join(optimizedDir, 'non-critical.min.css'), minifiedNonCritical);
  
  console.log(`📦 Critical CSS size: ${(minifiedCritical.length / 1024).toFixed(2)} KB`);
  console.log(`📦 Non-critical CSS size: ${(minifiedNonCritical.length / 1024).toFixed(2)} KB`);
  
  return { minifiedCritical, minifiedNonCritical };
}

function updateHTMLWithOptimizedCSS() {
  console.log('📝 Updating HTML dengan optimized CSS loading...');
  
  const indexPath = path.join(__dirname, 'index.html');
  let htmlContent = fs.readFileSync(indexPath, 'utf8');
  
  // CSS loading strategy yang dioptimasi
  const optimizedCSSLoading = `
  <!-- Critical CSS inline untuk instant rendering -->
  <style id="critical-css">
    /* Loading screen styles */
    .loading-screen{position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(135deg,#0f0f23,#1a1a2e);display:flex;justify-content:center;align-items:center;z-index:9999;transition:opacity 0.3s ease}
    .loading-spinner{width:50px;height:50px;border:3px solid rgba(34,197,94,0.3);border-top:3px solid #22c55e;border-radius:50%;animation:spin 1s linear infinite}
    @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
    
    /* Critical layout styles */
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Inter',sans-serif;background:#0f0f23;color:#e2e8f0;overflow-x:hidden}
    .liquid-glass-header{position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:1000;width:90%;max-width:800px}
  </style>
  
  <!-- Non-critical CSS dengan lazy loading -->
  <link rel="preload" href="/css/optimized/non-critical.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/css/optimized/non-critical.min.css"></noscript>
  
  <!-- Fallback untuk CSS individual jika optimized tidak tersedia -->
  <link rel="stylesheet" href="/css/about-modern.css" media="print" onload="this.media='all'; this.onload=null;">
  <noscript><link rel="stylesheet" href="/css/about-modern.css"></noscript>`;
  
  // Replace existing CSS loading dengan optimized version
  const cssRegex = /<!-- Critical CSS inline untuk faster rendering -->[\s\S]*?<noscript><link rel="stylesheet" type="text\/css" href="\/css\/about-modern\.css"><\/noscript>/;
  
  if (cssRegex.test(htmlContent)) {
    htmlContent = htmlContent.replace(cssRegex, optimizedCSSLoading);
  } else {
    // Jika pattern tidak ditemukan, tambahkan setelah preload resources
    const preloadRegex = /(<!-- Preload critical resources -->[\s\S]*?<link rel="preload"[^>]*>)/;
    htmlContent = htmlContent.replace(preloadRegex, `$1${optimizedCSSLoading}`);
  }
  
  // Tambahkan script untuk lazy loading CSS
  const lazyLoadScript = `
  <!-- CSS Lazy Loading Script -->
  <script>
    // Function untuk lazy load CSS
    function loadCSS(href, before, media) {
      var doc = window.document;
      var ss = doc.createElement('link');
      var ref;
      if (before) {
        ref = before;
      } else {
        var refs = (doc.body || doc.getElementsByTagName('head')[0]).childNodes;
        ref = refs[refs.length - 1];
      }
      var sheets = doc.styleSheets;
      ss.rel = 'stylesheet';
      ss.href = href;
      ss.media = 'only x';
      function ready(cb) {
        if (doc.body) {
          return cb();
        }
        setTimeout(function() {
          ready(cb);
        });
      }
      ready(function() {
        ref.parentNode.insertBefore(ss, (before ? ref : ref.nextSibling));
      });
      var onloadcssdefined = function(cb) {
        var resolvedHref = ss.href;
        var i = sheets.length;
        while (i--) {
          if (sheets[i].href === resolvedHref) {
            return cb();
          }
        }
        setTimeout(function() {
          onloadcssdefined(cb);
        });
      };
      function loadCB() {
        if (ss.addEventListener) {
          ss.removeEventListener('load', loadCB);
        }
        ss.media = media || 'all';
      }
      if (ss.addEventListener) {
        ss.addEventListener('load', loadCB);
      }
      ss.onloadcssdefined = onloadcssdefined;
      onloadcssdefined(loadCB);
      return ss;
    }
    
    // Load non-critical CSS setelah page load
    window.addEventListener('load', function() {
      loadCSS('/css/optimized/non-critical.min.css');
    });
  </script>`;
  
  // Tambahkan script sebelum service worker registration
  const swRegex = /(<!-- Service Worker Registration -->)/;
  htmlContent = htmlContent.replace(swRegex, `${lazyLoadScript}\n\n  $1`);
  
  // Simpan HTML yang sudah dioptimasi
  fs.writeFileSync(indexPath, htmlContent);
  
  console.log('✅ HTML updated dengan optimized CSS loading');
}

function main() {
  console.log('🚀 Memulai optimasi CSS...');
  
  try {
    const { minifiedCritical, minifiedNonCritical } = createOptimizedCSS();
    updateHTMLWithOptimizedCSS();
    
    console.log('\n🎉 CSS optimization selesai!');
    console.log('📊 Hasil:');
    console.log('   ✅ Critical CSS di-inline untuk faster rendering');
    console.log('   ✅ Non-critical CSS di-lazy load');
    console.log('   ✅ CSS files di-minifikasi');
    console.log('   ✅ Reduced render-blocking resources');
    
  } catch (error) {
    console.error('❌ Error during CSS optimization:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { createOptimizedCSS, updateHTMLWithOptimizedCSS };