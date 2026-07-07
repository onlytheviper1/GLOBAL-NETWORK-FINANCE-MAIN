# Deployment Guide

This guide covers deploying Global Network Finance to production.

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Build the frontend**
```bash
cd frontend
npm run build
```

2. **Install Vercel CLI**
```bash
npm install -g vercel
```

3. **Deploy**
```bash
vercel
```

4. **Set environment variables** in Vercel dashboard:
```
VITE_API_URL=https://your-backend-url.com/api
```

### Option 2: Netlify

1. **Build the frontend**
```bash
cd frontend
npm run build
```

2. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

3. **Deploy**
```bash
netlify deploy --prod --dir=frontend/dist
```

4. **Configure build settings**
```
Build command: npm run build:frontend
Publish directory: frontend/dist
```

### Option 3: GitHub Pages

1. **Update vite.config.js**
```javascript
export default defineConfig({
  base: '/GLOBAL-NETWORK-FINANCE-MAIN/',
  // ... rest of config
})
```

2. **Build and deploy**
```bash
npm run build:frontend
git add .
git commit -m "Deploy frontend"
git push origin main
```

## Backend Deployment

### Option 1: Heroku

1. **Create Heroku account** at https://www.heroku.com

2. **Install Heroku CLI**
```bash
# macOS with Homebrew
brew tap heroku/brew && brew install heroku

# or download from https://devcenter.heroku.com/articles/heroku-cli
```

3. **Create Procfile**
```bash
# In root directory
echo "web: cd backend && npm start" > Procfile
```

4. **Deploy**
```bash
heroku login
heroku create your-app-name
heroku addons:create mongolab:sandbox
git push heroku main
```

5. **Set environment variables**
```bash
heroku config:set JWT_SECRET=your-secure-secret
heroku config:set NODE_ENV=production
```

### Option 2: Railway

1. **Create Railway account** at https://railway.app

2. **Connect GitHub repository**
   - Sign in to Railway
   - Select "Deploy from GitHub"
   - Authorize Railway
   - Select this repository

3. **Configure services**
   - Add MongoDB plugin
   - Set root directory to `/backend`

4. **Set environment variables**
   ```
   JWT_SECRET=your-secure-secret
   NODE_ENV=production
   MONGODB_URI=provided by Railway MongoDB plugin
   PORT=8000
   ```

5. **Deploy** - Railway automatically deploys on git push

### Option 3: DigitalOcean App Platform

1. **Create DigitalOcean account** and enable App Platform

2. **Connect GitHub repository**

3. **Create app.yaml**
```yaml
name: global-network-finance
services:
- name: api
  github:
    repo: onlytheviper1/GLOBAL-NETWORK-FINANCE-MAIN
    branch: main
  build_command: cd backend && npm install
  run_command: cd backend && npm start
  source_dir: backend
  envs:
  - key: NODE_ENV
    value: production
  - key: JWT_SECRET
    scope: RUN_AND_BUILD_TIME
    value: ${JWT_SECRET}
  http_port: 5000

databases:
- name: mongodb
  engine: MONGODB
  production: true
```

4. **Deploy via DigitalOcean dashboard**

### Option 4: Docker + Cloud Run/ECS

1. **Create Dockerfile** in backend:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

2. **Build and push to Docker Hub**
```bash
docker build -t your-username/gnf-backend .
docker push your-username/gnf-backend
```

3. **Deploy to Cloud Run (GCP)**
```bash
gcloud run deploy gnf-backend \
  --image your-username/gnf-backend \
  --set-env-vars JWT_SECRET=your-secret,MONGODB_URI=your-uri
```

## Database Deployment

### MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas account** at https://www.mongodb.com/cloud/atlas

2. **Create cluster**
   - Choose free tier (M0)
   - Select region close to your servers
   - Wait for cluster to initialize

3. **Create database user**
   - Go to Database Access
   - Create user with strong password

4. **Get connection string**
   - Go to Connect
   - Copy "Connect your application"
   - Use in MONGODB_URI

5. **Configure network access**
   - Go to Network Access
   - Add IP addresses that will connect (or 0.0.0.0/0 for development)

### PostgreSQL Alternative

If using PostgreSQL instead of MongoDB:

```bash
# Install package
npm install pg sequelize

# Create database
createdb global_network_finance

# Update connection in .env
DATABASE_URL=postgresql://user:password@localhost/global_network_finance
```

## SSL/HTTPS Setup

### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates to your app
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./
```

### Update backend to use HTTPS

```javascript
import https from 'https'
import fs from 'fs'

const options = {
  key: fs.readFileSync('privkey.pem'),
  cert: fs.readFileSync('fullchain.pem')
}

https.createServer(options, app).listen(443)
```

## Production Environment Variables

Create `.env` for production with these variables:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/gnf
JWT_SECRET=<very-secure-random-string>
CORS_ORIGIN=https://your-frontend-domain.com
LOG_LEVEL=warn
```

## Performance Optimization

### Frontend

1. **Enable compression**
```bash
npm install compression
```

2. **Setup CDN** - Use Cloudflare or similar

3. **Enable caching headers**
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
}
```

### Backend

1. **Enable response caching**
```javascript
app.use(compression())
```

2. **Setup database indexing**
```javascript
CMSContent.collection.createIndex({ slug: 1 })
CMSContent.collection.createIndex({ status: 1 })
CMSContent.collection.createIndex({ createdAt: -1 })
```

3. **Enable response pagination** (already implemented)

## Monitoring & Logging

### Setup Logging

```bash
npm install winston
```

### Monitor with services:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Datadog** - Full stack monitoring
- **New Relic** - Application performance

## Backup Strategy

### Automated MongoDB Backups

```bash
# Weekly backup script
0 2 * * 0 mongodump --uri="$MONGODB_URI" --out=/backups/mongodb-$(date +\%Y\%m\%d)
```

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Deploy Frontend
        run: npm run build:frontend
      
      - name: Deploy Backend
        run: npm run build:backend
      
      - name: Push to Production
        run: git push heroku main
```

## Troubleshooting Deployment

### Application won't start
- Check logs: `heroku logs --tail` or platform-specific logs
- Verify all dependencies are in package.json
- Check environment variables are set

### Database connection fails
- Verify MONGODB_URI is correct
- Check network access whitelisting
- Ensure credentials are correct

### Frontend not loading
- Verify VITE_API_URL points to backend
- Check CORS is configured correctly
- Verify frontend is built correctly

## Post-Deployment Checklist

- [ ] SSL certificate is valid
- [ ] Both frontend and backend are accessible
- [ ] Authentication works correctly
- [ ] Create content and verify it displays
- [ ] Database backups are configured
- [ ] Monitoring is set up
- [ ] Error tracking is enabled
- [ ] CDN is configured
- [ ] CORS settings are correct
- [ ] Rate limiting is enabled
- [ ] Logging is working

## Support

For deployment issues, consult your hosting platform's documentation or contact their support team.
