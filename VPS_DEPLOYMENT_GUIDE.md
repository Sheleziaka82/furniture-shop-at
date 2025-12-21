# VPS Deployment Guide - Möbelhaus AT

This guide provides step-by-step instructions for deploying the Möbelhaus AT furniture e-commerce platform on a VPS.

## Prerequisites

- VPS with Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+ installed
- pnpm package manager
- MySQL 8.0+ or TiDB database
- Nginx or Apache for reverse proxy
- SSL certificate (Let's Encrypt recommended)

## Step 1: Download and Upload Project

### Option A: Download from Manus Management UI
1. Go to Management UI → Code panel
2. Click "Download all files"
3. Upload the ZIP file to your VPS:
```bash
scp furniture-shop-at.zip user@your-vps-ip:/home/user/
```

### Option B: Clone from Git
```bash
cd /home/user
git clone <your-repository-url>
cd furniture-shop-at
```

## Step 2: Install Dependencies

```bash
cd /home/user/furniture-shop-at
pnpm install
```

## Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Database
DATABASE_URL="mysql://user:password@localhost:3306/furniture_shop"

# JWT & Auth
JWT_SECRET="your-secret-key-here-min-32-characters"
VITE_APP_ID="your-manus-oauth-app-id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://portal.manus.im"

# Owner Info
OWNER_NAME="Your Name"
OWNER_OPEN_ID="your-open-id"

# Manus APIs
BUILT_IN_FORGE_API_URL="https://api.manus.im"
BUILT_IN_FORGE_API_KEY="your-api-key"
VITE_FRONTEND_FORGE_API_URL="https://api.manus.im"
VITE_FRONTEND_FORGE_API_KEY="your-frontend-api-key"

# Analytics
VITE_ANALYTICS_ENDPOINT="https://analytics.manus.im"
VITE_ANALYTICS_WEBSITE_ID="your-website-id"

# App Configuration
VITE_APP_TITLE="Möbelhaus AT"
VITE_APP_LOGO="/logo.svg"

# Server Port
PORT=3000
NODE_ENV=production
```

## Step 4: Setup Database

### Create Database
```bash
mysql -u root -p
CREATE DATABASE furniture_shop;
CREATE USER 'furniture_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON furniture_shop.* TO 'furniture_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Run Migrations
```bash
cd /home/user/furniture-shop-at
pnpm db:push
```

## Step 5: Build Project

```bash
pnpm build
```

This creates a `dist` folder with the production build.

## Step 6: Setup PM2 Process Manager

### Install PM2 globally
```bash
npm install -g pm2
```

### Create PM2 ecosystem file (ecosystem.config.js)
```javascript
module.exports = {
  apps: [
    {
      name: 'furniture-shop',
      script: './dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
```

### Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 7: Configure Nginx Reverse Proxy

Create `/etc/nginx/sites-available/furniture-shop`:

```nginx
upstream furniture_app {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Certificate (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy settings
    location / {
        proxy_pass http://furniture_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/furniture-shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 8: Setup SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com
```

## Step 9: Monitor and Maintain

### View logs
```bash
pm2 logs furniture-shop
```

### Monitor processes
```bash
pm2 monit
```

### Update and restart
```bash
cd /home/user/furniture-shop-at
git pull  # or download new version
pnpm install
pnpm build
pm2 restart furniture-shop
```

### Auto-renew SSL certificate
```bash
sudo certbot renew --dry-run  # Test renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Troubleshooting

### Port already in use
```bash
lsof -i :3000
kill -9 <PID>
```

### Database connection error
- Verify DATABASE_URL is correct
- Check MySQL is running: `sudo systemctl status mysql`
- Test connection: `mysql -u user -p -h localhost furniture_shop`

### High memory usage
- Increase PM2 max_memory_restart
- Check for memory leaks: `pm2 logs`
- Monitor with: `pm2 monit`

### SSL certificate issues
- Check certificate: `sudo certbot certificates`
- Renew manually: `sudo certbot renew --force-renewal`

## Performance Optimization

1. **Enable caching:**
   - Browser caching (configured in Nginx)
   - Redis for session storage (optional)

2. **Database optimization:**
   - Add indexes on frequently queried columns
   - Regular backups: `mysqldump -u user -p database > backup.sql`

3. **CDN for static assets:**
   - Use CloudFlare or similar for static file delivery
   - Update asset URLs in production

4. **Monitoring:**
   - Setup uptime monitoring (UptimeRobot, Pingdom)
   - Setup error tracking (Sentry)
   - Monitor server resources (New Relic, DataDog)

## Backup Strategy

```bash
# Daily database backup
0 2 * * * mysqldump -u furniture_user -p'password' furniture_shop | gzip > /backups/furniture_shop_$(date +\%Y\%m\%d).sql.gz

# Weekly project backup
0 3 * * 0 tar -czf /backups/furniture_shop_$(date +\%Y\%m\%d).tar.gz /home/user/furniture-shop-at
```

## Support

For issues or questions:
- Check logs: `pm2 logs`
- Review Nginx error log: `/var/log/nginx/error.log`
- Check system resources: `top`, `df -h`

---

**Last Updated:** December 2024
**Version:** 1.0
