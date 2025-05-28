import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => ({
  base: command === 'serve' ? '/' : '/browser-tetris/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  server: {
    port: 5173,
    open: true,
    host: true
  },
  preview: {
    port: 4173,
    host: true,
    allowedHosts: mode === 'production' 
      ? ['games.chappaoishi.com', '.chappaoishi.com']
      : ['localhost']
  }
}));