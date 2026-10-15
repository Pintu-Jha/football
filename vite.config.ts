import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const rootDir = import.meta.dirname

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (
            id.includes('react-dom') ||
            id.includes('react-router') ||
            /[/\\]react[/\\]/.test(id)
          ) {
            return 'vendor-react'
          }
          if (id.includes('gsap') || id.includes('@gsap')) {
            return 'vendor-gsap'
          }
          if (
            id.includes('@radix-ui') ||
            id.includes('embla-carousel') ||
            id.includes('lucide-react')
          ) {
            return 'vendor-ui'
          }
        },
      },
    },
  },
})
