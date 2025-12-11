# Deployment Guide

## 🚀 Production Deployment Options

This guide covers deploying your AI Article Generator to production.

---

## Option 1: Vercel (Frontend) + Heroku (Backend)

### Backend Deployment (Heroku)

1. **Install Heroku CLI**
```powershell
# Download from: https://devcenter.heroku.com/articles/heroku-cli
```

2. **Login to Heroku**
```powershell
heroku login
```

3. **Create Heroku App**
```powershell
cd backend
git init
heroku create your-app-name-backend
```

4. **Set Environment Variables**
```powershell
heroku config:set OPENAI_API_KEY=your_actual_key
```

5. **Deploy**
```powershell
git add .
git commit -m "Initial commit"
git push heroku main
```

6. **Verify**
```powershell
heroku open
```

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
```powershell
npm install -g vercel
```

2. **Deploy Frontend**
```powershell
cd frontend
vercel
```

3. **Update API URL**
Edit `script.js`:
```javascript
const API_BASE_URL = 'https://your-app-name-backend.herokuapp.com';
```

4. **Redeploy**
```powershell
vercel --prod
```

---

## Option 2: DigitalOcean App Platform

### 1. Push to GitHub
```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/article-generator.git
git push -u origin main
```

### 2. Create DigitalOcean App
1. Go to DigitalOcean App Platform
2. Connect your GitHub repository
3. Configure two components:
   - **Backend**: Node.js service from `/backend`
   - **Frontend**: Static site from `/frontend`

### 3. Set Environment Variables
In DigitalOcean dashboard:
```
OPENAI_API_KEY=your_key_here
PORT=8080
```

### 4. Deploy
DigitalOcean will automatically build and deploy.

---

## Option 3: AWS (EC2)

### 1. Launch EC2 Instance
- Choose Ubuntu Server
- t2.micro for testing (t2.small for production)
- Configure security group (ports 80, 443, 3000)

### 2. Connect and Setup
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install nginx
sudo apt-get install nginx
```

### 3. Clone and Setup Project
```bash
git clone https://github.com/yourusername/article-generator.git
cd article-generator/backend
npm install

# Create .env
nano .env
# Add: OPENAI_API_KEY=your_key
```

### 4. Setup PM2 (Process Manager)
```bash
sudo npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

### 5. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /home/ubuntu/article-generator/frontend;
        index index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

---

## Option 4: Docker Deployment

### 1. Create Dockerfiles

**backend/Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

**frontend/Dockerfile**:
```dockerfile
FROM nginx:alpine

COPY . /usr/share/nginx/html

EXPOSE 80
```

### 2. Create docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

### 3. Deploy
```powershell
docker-compose up -d
```

---

## Production Checklist

### Security
- [ ] Use HTTPS (Let's Encrypt)
- [ ] Set secure CORS origins
- [ ] Add rate limiting
- [ ] Validate all inputs
- [ ] Hide error details in production
- [ ] Use environment variables for secrets

### Performance
- [ ] Enable gzip compression
- [ ] Add caching headers
- [ ] Use CDN for static assets
- [ ] Implement request queuing
- [ ] Monitor API usage

### Monitoring
- [ ] Setup error logging (Sentry)
- [ ] Monitor API costs
- [ ] Track user metrics
- [ ] Setup uptime monitoring
- [ ] Configure alerts

### Code Updates

**Update CORS in production**:
```javascript
// backend/server.js
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

**Add rate limiting**:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

**Error handling for production**:
```javascript
if (process.env.NODE_ENV === 'production') {
  res.status(500).json({ error: 'An error occurred' });
} else {
  res.status(500).json({ error: error.message });
}
```

---

## Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=sk-...
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Update
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.com'
  : 'http://localhost:3000';
```

---

## Cost Estimation

### OpenAI API Costs (Per 1000 Users)
- GPT-4o-mini: ~$1.50
- DALL-E 3: ~$40
- **Total**: ~$41.50 per 1000 complete flows

### Hosting Costs (Monthly)
- **Heroku**: $7-25
- **Vercel**: Free-$20
- **DigitalOcean**: $5-10
- **AWS EC2**: $5-30

---

## Backup & Recovery

### Database (if added later)
```bash
# Backup
pg_dump database_name > backup.sql

# Restore
psql database_name < backup.sql
```

### Code Backup
```bash
git push origin main --tags
```

---

## Scaling Considerations

1. **Implement Queue System**: Use Bull/Redis for background jobs
2. **Add Caching**: Redis for API response caching
3. **Load Balancing**: Multiple backend instances
4. **CDN**: Cloudflare for static assets
5. **Database**: Add PostgreSQL for user data

---

## Support & Maintenance

### Monitoring Tools
- **Backend**: PM2, New Relic
- **Logs**: Winston, Logtail
- **Errors**: Sentry
- **Uptime**: UptimeRobot

### Regular Tasks
- [ ] Review API costs weekly
- [ ] Check error logs daily
- [ ] Update dependencies monthly
- [ ] Review security patches
- [ ] Backup configuration files

---

## Troubleshooting Production

### Backend Not Responding
```bash
# Check logs
pm2 logs
heroku logs --tail

# Restart service
pm2 restart all
heroku restart
```

### CORS Errors
- Verify FRONTEND_URL in backend
- Check CORS configuration
- Ensure HTTPS is properly configured

### High API Costs
- Implement caching
- Add rate limiting
- Review OpenAI settings
- Consider cheaper models

---

**Your app is now production-ready! 🚀**
