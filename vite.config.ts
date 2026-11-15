import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // The admin CV builder ships a large PDF engine in its own lazy chunk.
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // Only long-lived vendor groups are pinned; everything else (PDF tooling,
        // antd, editors) is split automatically along the lazy route boundaries.
        manualChunks: (id: string) => {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) return 'react'
          if (/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(id)) return 'motion'
          return undefined
        },
      },
    },
  },
})
