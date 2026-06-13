/**
 * PM2 Ecosystem Configuration
 * FinanzPlus Austria - Production
 */

module.exports = {
  apps: [
    {
      name: 'finanzplus-api',
      script: './backend/src/server.js',
      cwd: './',
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      listen_timeout: 3000,
      kill_timeout: 5000,
      wait_ready: true,
      shutdown_with_message: true
    }
  ],

  deploy: {
    production: {
      user: 'finanzplus',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'git@github.com:your-repo/finanzplus-austria.git',
      path: '/var/www/finanzplus',
      'post-deploy': 'cd backend && npm install --production && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt-get install git'
    }
  }
};

// Made with Bob
