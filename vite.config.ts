import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps every asset reference relative, so the built app runs:
//  - hosted under any GitHub Pages sub-path, and
//  - fully offline by opening dist/index.html straight from disk.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2019',
    chunkSizeWarningLimit: 2000
  }
})
