import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/test/**/*.{test,spec}.{js,jsx}'],
    setupFiles: ['./src/test/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/test/**'],
    },
  },
})
