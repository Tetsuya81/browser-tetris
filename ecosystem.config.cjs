module.exports = {
  apps: [{
    name: 'browser-tetris',
    script: 'npm',
    args: 'run preview',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 4173
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 5173,
      args: 'run dev'
    }
  }]
};