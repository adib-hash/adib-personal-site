import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const pkg = JSON.parse(readFileSync("./package.json", "utf8"));

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  plugins: [react()],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor'
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'framer'
          }
          if (id.includes('node_modules/react-router')) {
            return 'router'
          }
        },
      },
    },
  },
})
