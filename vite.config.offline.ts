import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Offline build target.
// Chrome refuses to load ES modules over file://, so the desktop build is
// emitted as a single classic (IIFE) script with no code splitting. The
// post-build step (scripts/bundle-offline.mjs) then inlines the JS and CSS
// into one self-contained ClypCompiler.html that runs by double-clicking it —
// no server, no Node, no network.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist-offline',
    target: 'es2019',
    cssCodeSplit: false,
    assetsInlineLimit: 100 * 1024 * 1024, // inline every asset as a data URI
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'app.js',
        assetFileNames: 'app.[ext]'
      }
    }
  }
})
