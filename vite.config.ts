import { defineConfig } from 'vite'

export default defineConfig({
  base: '/javascript-pomodoro-timer/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser'
  }
})
