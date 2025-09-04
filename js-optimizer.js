#!/usr/bin/env node

// JavaScript Optimizer untuk bundling dan minifikasi JS

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JavaScript files yang akan dioptimasi
const jsFiles = {
  critical: [
    'src/main.js'
  ],
  utilities: [
    'src/cursor-animation.js',
    'src/3d-background.js'
  ],
  features: [
    'js/theme-manager.js',
    'js/modern-dropdown.js',
    'js/email-handler.js'
  ],
  nonCritical: [
    'js/404-handler.js',
    'js/config.js',
    'js/animation.js',
    'js/about-tabs.js',
    'js/tab-switcher.js',
    'js/modern-popup-handler.js',
    'js/section-navigation.js',
    'js/icon-manager.js',
    'js/autoTypingAnimation.js',
    'js/glassmorphism-animation.js'
  ]
};

function minifyJS(js) {
    // Transform ES modules ke regular JavaScript
    let transformedContent = js
      .replace(/import\s+[^\n]+/g, '') // Remove import statements
      .replace(/import\{[^}]+\}\s*from\s*[^\n]+/g, '') // Remove named imports
      .replace(/import\s+[^\s]+\s+from\s+[^\n]+/g, '') // Remove default imports
      .replace(/export\s+[^\n]+/g, '') // Remove export statements
      .replace(/export\s+default\s+/g, '') // Remove export default
      .replace(/export\s+\{[^}]+\}/g, ''); // Remove named exports
   
   return transformedContent
    // Remove single-line comments (but preserve URLs)
    .replace(/\/\/(?![^'"]*['"][^'"]*$).*$/gm, '')
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove whitespace around operators and punctuation
    .replace(/\s*([{}();,=+\-*\/])\s*/g, '$1')
    // Remove trailing semicolons before }
    .replace(/;}/g, '}')
    // Remove leading/trailing whitespace
    .trim();
}

function createOptimizedJS() {
  console.log('⚡ Mengoptimasi JavaScript files...');
  
  const optimizedDir = path.join(__dirname, 'js', 'optimized');
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }
  
  const bundles = {};
  
  // Process each category
  Object.keys(jsFiles).forEach(category => {
    let bundleContent = '';
    
    jsFiles[category].forEach(file => {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        bundleContent += `\n// === ${file} ===\n${content}\n`;
        console.log(`✅ Added to ${category} bundle: ${file}`);
      } else {
        console.log(`⚠️  File not found: ${file}`);
      }
    });
    
    if (bundleContent) {
      const minified = minifyJS(bundleContent);
      bundles[category] = minified;
      
      // Save bundle
      fs.writeFileSync(
        path.join(optimizedDir, `${category}.min.js`),
        minified
      );
      
      console.log(`📦 ${category} bundle size: ${(minified.length / 1024).toFixed(2)} KB`);
    }
  });
  
  return bundles;
}

function createModuleLoader() {
  console.log('📦 Creating module loader...');
  
  const moduleLoaderContent = `
// Optimized Module Loader
(function() {
  'use strict';
  
  const ModuleLoader = {
    loaded: new Set(),
    loading: new Set(),
    
    // Load script dengan caching
    loadScript: function(src, callback) {
      if (this.loaded.has(src)) {
        callback && callback();
        return;
      }
      
      if (this.loading.has(src)) {
        // Wait for existing load
        const checkLoaded = () => {
          if (this.loaded.has(src)) {
            callback && callback();
          } else {
            setTimeout(checkLoaded, 10);
          }
        };
        checkLoaded();
        return;
      }
      
      this.loading.add(src);
      
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      
      script.onload = () => {
        this.loading.delete(src);
        this.loaded.add(src);
        callback && callback();
      };
      
      script.onerror = () => {
        this.loading.delete(src);
        console.error('Failed to load script:', src);
      };
      
      document.head.appendChild(script);
    },
    
    // Load multiple scripts in sequence
    loadScripts: function(scripts, callback) {
      if (!scripts.length) {
        callback && callback();
        return;
      }
      
      const loadNext = (index) => {
        if (index >= scripts.length) {
          callback && callback();
          return;
        }
        
        this.loadScript(scripts[index], () => {
          loadNext(index + 1);
        });
      };
      
      loadNext(0);
    },
    
    // Load scripts in parallel
    loadScriptsParallel: function(scripts, callback) {
      if (!scripts.length) {
        callback && callback();
        return;
      }
      
      let loaded = 0;
      const total = scripts.length;
      
      scripts.forEach(script => {
        this.loadScript(script, () => {
          loaded++;
          if (loaded === total) {
            callback && callback();
          }
        });
      });
    }
  };
  
  // Progressive loading strategy
  const ProgressiveLoader = {
    init: function() {
      // Load critical scripts immediately
      this.loadCritical();
      
      // Load features after DOM ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.loadFeatures();
        });
      } else {
        this.loadFeatures();
      }
      
      // Load non-critical after page load
      window.addEventListener('load', () => {
        this.loadNonCritical();
      });
    },
    
    loadCritical: function() {
      console.log('Loading critical scripts...');
      // Critical scripts are already loaded via module tags
    },
    
    loadFeatures: function() {
      console.log('Loading feature scripts...');
      ModuleLoader.loadScriptsParallel([
        '/js/optimized/features.min.js'
      ], () => {
        console.log('Feature scripts loaded');
      });
    },
    
    loadNonCritical: function() {
      console.log('Loading non-critical scripts...');
      // Use requestIdleCallback for better performance
      const loadNonCritical = () => {
        ModuleLoader.loadScript('/js/optimized/nonCritical.min.js', () => {
          console.log('Non-critical scripts loaded');
        });
      };
      
      if (window.requestIdleCallback) {
        requestIdleCallback(loadNonCritical);
      } else {
        setTimeout(loadNonCritical, 100);
      }
    }
  };
  
  // Initialize progressive loading
  ProgressiveLoader.init();
  
  // Expose to global scope
  window.ModuleLoader = ModuleLoader;
  window.ProgressiveLoader = ProgressiveLoader;
})();
`;
  
  fs.writeFileSync(
    path.join(__dirname, 'js', 'optimized', 'module-loader.min.js'),
    minifyJS(moduleLoaderContent)
  );
  
  console.log('✅ Module loader created');
}

function updateHTMLWithOptimizedJS() {
  console.log('📝 Updating HTML dengan optimized JavaScript loading...');
  
  const indexPath = path.join(__dirname, 'index.html');
  let htmlContent = fs.readFileSync(indexPath, 'utf8');
  
  // Optimized JavaScript loading strategy
  const optimizedJSLoading = `
  <!-- Module Loader untuk progressive loading -->
  <script src="/js/optimized/module-loader.min.js"></script>
  
  <!-- Critical JavaScript -->
  <script type="module" src="/src/main.js"></script>
  
  <!-- Utilities loaded with module loader -->
  <script>
    // Load utilities after critical scripts
    if (window.ModuleLoader) {
      ModuleLoader.loadScript('/js/optimized/utilities.min.js');
    }
  </script>`;
  
  // Replace existing JavaScript loading
  const jsRegex = /(<!-- Optimized JavaScript Loading -->)[\s\S]*?(<\/body>)/;
  
  if (jsRegex.test(htmlContent)) {
    htmlContent = htmlContent.replace(jsRegex, `$1${optimizedJSLoading}\n$2`);
  } else {
    // Replace existing script tags
    const existingScriptsRegex = /(<!-- Service Worker Registration -->[\s\S]*?<\/script>\s*)(<!-- Optimized JavaScript Loading -->\s*<script[\s\S]*?<\/script>\s*<script[\s\S]*?<\/script>\s*<script[\s\S]*?<\/script>\s*<script[\s\S]*?<\/script>)/;
    
    htmlContent = htmlContent.replace(
      /(<!-- Service Worker Registration -->[\s\S]*?<\/script>\s*)(<!-- Optimized JavaScript Loading -->\s*<script[\s\S]*?<\/body>)/,
      `$1${optimizedJSLoading}\n</body>`
    );
  }
  
  fs.writeFileSync(indexPath, htmlContent);
  console.log('✅ HTML updated dengan optimized JavaScript loading');
}

function main() {
  console.log('🚀 Memulai optimasi JavaScript...');
  
  try {
    const bundles = createOptimizedJS();
    createModuleLoader();
    updateHTMLWithOptimizedJS();
    
    console.log('\n🎉 JavaScript optimization selesai!');
    console.log('📊 Hasil:');
    console.log('   ✅ JavaScript files di-bundle dan minifikasi');
    console.log('   ✅ Progressive loading strategy');
    console.log('   ✅ Module loader untuk dynamic imports');
    console.log('   ✅ Reduced HTTP requests');
    console.log('   ✅ Better caching strategy');
    
    // Show bundle sizes
    Object.keys(bundles).forEach(category => {
      const size = (bundles[category].length / 1024).toFixed(2);
      console.log(`   📦 ${category}: ${size} KB`);
    });
    
  } catch (error) {
    console.error('❌ Error during JavaScript optimization:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { createOptimizedJS, createModuleLoader, updateHTMLWithOptimizedJS };