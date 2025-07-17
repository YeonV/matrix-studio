import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { URL, fileURLToPath } from 'node:url' // Use the node:url specifier for clarity

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This is the correct, modern way to create a path alias in Vite
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})