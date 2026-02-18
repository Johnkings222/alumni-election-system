# Deployment Guide - Alumni Election System

Complete guide to deploy your election system to a server (works anywhere, including China).

---

## 🚀 Quick Deploy with Docker

### Prerequisites on Server

1. **Docker & Docker Compose installed**
2. **Port 80 open** (or use different port)
3. **SSH access to server**

---

## 📦 Method 1: Docker Compose (Recommended)

### Step 1: Upload Files to Server

```bash
# On your local machine, zip the project
cd /home/kings/Documents
tar -czf alumni-election-system.tar.gz alumni-election-system/

# Upload to your server (replace with your server IP)
scp alumni-election-system.tar.gz user@your-server-ip:/home/user/

# SSH into your server
ssh user@your-server-ip

# Extract files
cd /home/user
tar -xzf alumni-election-system.tar.gz
cd alumni-election-system
```

### Step 2: Configure Environment Variables

```bash
# Copy and edit production environment file
cp .env.production backend/.env

# Edit the file (IMPORTANT: Change admin password!)
nano backend/.env
```

**Important:** Change these values:
- `ADMIN_PASSWORD` - Set a strong password
- `SECRET_KEY` - Generate a random string

### Step 3: Deploy with One Command

```bash
# Build and start all services
docker-compose up -d --build
```

That's it! Your app is now running on:
- **Main App:** http://your-server-ip
- **Admin:** http://your-server-ip/admin
- **API Docs:** http://your-server-ip:8000/docs

### Step 4: Check Status

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart
```

---

## 🌐 Method 2: With Custom Domain

If you have a domain name (e.g., election.yourdomain.com):

### Step 1: Point Domain to Server

Add an A record in your DNS:
```
Type: A
Name: election (or @)
Value: your-server-ip
TTL: 3600
```

### Step 2: Update nginx Configuration

Edit `frontend/nginx.conf`:
```bash
nano frontend/nginx.conf
```

Change:
```nginx
server_name localhost;
```

To:
```nginx
server_name election.yourdomain.com;
```

### Step 3: Add SSL (HTTPS) with Certbot

Create `docker-compose.ssl.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: alumni-election-backend
    restart: unless-stopped
    environment:
      - ENV=production
    volumes:
      - ./backend/data:/app/data
    networks:
      - alumni-network

  frontend:
    build: ./frontend
    container_name: alumni-election-frontend
    restart: unless-stopped
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    networks:
      - alumni-network

  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

networks:
  alumni-network:
    driver: bridge
```

Get SSL certificate:
```bash
# Stop nginx first
docker-compose down

# Get certificate
sudo certbot certonly --standalone -d election.yourdomain.com

# Start with SSL
docker-compose -f docker-compose.ssl.yml up -d --build
```

Your app will now be accessible at: **https://election.yourdomain.com**

---

## 🔒 Security Checklist

Before going live:

- [ ] Change admin password in `backend/.env`
- [ ] Change SECRET_KEY in `backend/.env`
- [ ] Enable HTTPS if using domain
- [ ] Set up firewall rules
- [ ] Enable auto-backups for database
- [ ] Set up monitoring

---

## 📊 Managing Your Application

### View Voting Codes

```bash
docker exec -it alumni-election-backend cat /app/voting_codes.txt
```

### Generate More Voting Codes

```bash
# Access the backend container
docker exec -it alumni-election-backend bash

# Run Python shell
python

# Generate codes
from app.services.voter_service import generate_voter_codes
generate_voter_codes(50)  # Generate 50 more codes
```

### Backup Database

```bash
# Backup
docker cp alumni-election-backend:/app/data/election.db ./backup_$(date +%Y%m%d).db

# Restore
docker cp ./backup_20260112.db alumni-election-backend:/app/data/election.db
docker-compose restart
```

### View Logs

```bash
# All logs
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### Update Application

```bash
# Pull latest changes (if using git)
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

---

## 🇨🇳 Special Notes for China Deployment

### 1. Use Domestic Docker Registry

If Docker Hub is slow, use Aliyun mirror:

```bash
# Create or edit /etc/docker/daemon.json
sudo nano /etc/docker/daemon.json
```

Add:
```json
{
  "registry-mirrors": [
    "https://registry.docker-cn.com",
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
```

Restart Docker:
```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 2. ICP Registration

If using a domain in China, ensure:
- Domain is registered with Chinese registrar
- Website has ICP license
- Server is in China

### 3. Firewall Rules

Open required ports:
```bash
# For HTTP
sudo ufw allow 80/tcp

# For HTTPS (if using SSL)
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

---

## 🛠️ Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs backend

# Common issues:
# 1. Port already in use - change port in docker-compose.yml
# 2. Permission denied - run with sudo
# 3. Database locked - remove data/election.db and restart
```

### Can't access from outside

```bash
# Check if port is open
sudo netstat -tlnp | grep :80

# Check firewall
sudo ufw status

# Check docker networks
docker network ls
docker network inspect alumni-network
```

### Database issues

```bash
# Reset database
docker-compose down
rm -rf backend/data/election.db
docker-compose up -d
```

---

## 📱 Mobile Access

Your election system is already mobile-optimized! Users can:
- Access via phone browsers
- Vote on tablets
- View results on mobile

No app installation needed.

---

## 🔄 Auto-Restart on Server Reboot

```bash
# Ensure Docker starts on boot
sudo systemctl enable docker

# Containers will auto-restart (already configured in docker-compose.yml)
```

---

## 💾 Recommended Server Specs

**Minimum:**
- 1 CPU core
- 1GB RAM
- 10GB disk space
- Ubuntu 20.04+ or similar

**Recommended:**
- 2 CPU cores
- 2GB RAM
- 20GB disk space
- Good for 1000+ voters

---

## 🌍 Access URLs After Deployment

Once deployed, your users can access:

**Without Domain:**
- Main app: http://YOUR_SERVER_IP
- Admin: http://YOUR_SERVER_IP/admin
- Results: http://YOUR_SERVER_IP/results

**With Domain:**
- Main app: https://yourdomain.com
- Admin: https://yourdomain.com/admin
- Results: https://yourdomain.com/results

---

## 📞 Support

If you encounter issues:

1. Check logs: `docker-compose logs -f`
2. Verify all services running: `docker-compose ps`
3. Check firewall: `sudo ufw status`
4. Review TEST_RESULTS.md for working configuration

---

**Your election system is now live and accessible 24/7!** 🎉
