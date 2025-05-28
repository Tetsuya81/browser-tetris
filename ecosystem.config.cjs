// 本番環境用の設定
module.exports = {
  apps: [{
    // 本番環境（プレビューサーバー）
    name: 'browser-tetris',
    script: 'npm',
    args: 'run preview -- --host',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 4173
    }
  }, {
    // 開発環境
    name: 'browser-tetris-dev',
    script: 'npm',
    args: 'run dev',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 5173
    }
  }]
};