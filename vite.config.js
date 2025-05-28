import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => {
  // 環境変数で本番環境を判定
  const isProd = process.env.NODE_ENV === 'production';
  
  return {
    // 本番環境では相対パスを使用
    base: isProd ? './' : '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      // モジュールの分割を無効化して単一ファイルに
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
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
  };
});