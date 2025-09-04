import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [],
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
