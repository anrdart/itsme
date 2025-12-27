import { defineConfig } from 'vite'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs'

// Helper function to copy directory recursively
function copyDir(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true })
  }
  const entries = readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = resolve(src, entry.name)
    const destPath = resolve(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}

// Custom plugin to copy img folder to dist
function copyImgPlugin() {
  return {
    name: 'copy-img',
    closeBundle() {
      // Copy img folder to dist
      const srcImg = resolve(__dirname, 'img')
      const destImg = resolve(__dirname, 'dist/img')
      if (existsSync(srcImg)) {
        copyDir(srcImg, destImg)
        console.log('✓ Copied img folder to dist/img')
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [copyImgPlugin()],
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Minifikasi dan optimasi
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Code splitting untuk better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['three'],
          utils: ['./src/cursor-animation.js', './src/3d-background.js']
        },
        // Asset naming untuk better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js'
      }
    },
    // Kompresi dan optimasi
    cssCodeSplit: true,
    sourcemap: false,
    // Threshold untuk warning ukuran file
    chunkSizeWarningLimit: 1000,
    // Optimasi aset
    assetsInlineLimit: 4096
  },
  // Optimasi CSS
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  },
  // Optimasi dependencies
  optimizeDeps: {
    include: ['three'],
    exclude: []
  }
})
