/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // On GitHub Pages the site lives at /Rick-Morty/, not at the root
  base: process.env.GITHUB_ACTIONS ? '/Rick-Morty/' : '/',
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
