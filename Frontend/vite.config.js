import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { // Core Vite configuration enabled by default
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
      },
    },
  }
})
  