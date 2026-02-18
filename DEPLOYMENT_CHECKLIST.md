# ✅ Deployment Checklist

## Before Deployment

### 1. Files Created ✓
- [x] backend/Dockerfile
- [x] frontend/Dockerfile  
- [x] docker-compose.yml
- [x] frontend/nginx.conf
- [x] .dockerignore
- [x] .env.production
- [x] deploy.sh
- [x] server-setup.sh
- [x] DEPLOYMENT.md
- [x] QUICK_DEPLOY.md

### 2. Configuration Required

On server, you MUST change:
```bash
cd alumni-election-system
cp .env.production backend/.env
nano backend/.env
```

Change these values:
- [ ] `ADMIN_PASSWORD` → Your secure password
- [ ] `SECRET_KEY` → Random string (use: openssl rand -hex 32)

### 3. Upload to Server

```bash
# Package locally
tar -czf alumni-election.tar.gz alumni-election-system/

# Upload (replace with your details)
scp alumni-election.tar.gz user@SERVER_IP:/home/user/
```

### 4. Server Requirements

Your server needs:
- [ ] Ubuntu 20.04+ or similar Linux
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] Ports 80, 443 open in firewall
- [ ] Minimum 1GB RAM, 10GB disk

### 5. Deploy

```bash
# On server
ssh user@SERVER_IP
tar -xzf alumni-election.tar.gz
cd alumni-election-system

# First time: setup server
./server-setup.sh
# (then log out and back in)

# Deploy application
./deploy.sh
```

## After Deployment

### Verify Installation

- [ ] Visit http://SERVER_IP - Should show login page
- [ ] Visit http://SERVER_IP/admin - Should show admin login
- [ ] Visit http://SERVER_IP/results - Should show results page
- [ ] Check logs: `docker-compose logs -f`
- [ ] Check status: `docker-compose ps`

### Test Functionality

- [ ] Enter a voting code (from backend/voting_codes.txt)
- [ ] Vote for all 7 positions
- [ ] Submit ballot
- [ ] See confirmation page
- [ ] View live results
- [ ] Login to admin panel
- [ ] Generate more voting codes

### Share with Users

Send voters:
- [ ] Main URL: http://YOUR_SERVER_IP
- [ ] Their unique voting code
- [ ] Instructions to vote

Keep private:
- [ ] Admin URL: http://YOUR_SERVER_IP/admin
- [ ] Admin credentials

## Ongoing Maintenance

### Daily Operations

```bash
# View logs
docker-compose logs -f

# Check running status
docker-compose ps

# Restart services
docker-compose restart
```

### Backup Database

```bash
# Create backup
docker cp alumni-election-backend:/app/data/election.db ./backup_$(date +%Y%m%d).db

# Schedule daily backups (crontab)
0 2 * * * cd /path/to/app && docker cp alumni-election-backend:/app/data/election.db ./backups/backup_$(date +\%Y\%m\%d).db
```

### Export Results

```bash
# Via admin panel
# Go to: http://SERVER_IP/admin
# Click: Results & Export tab
# Download: CSV

# Or via API
curl http://SERVER_IP/api/votes/results > results.json
```

### Update Application

```bash
# Stop services
docker-compose down

# Backup database first!
docker cp alumni-election-backend:/app/data/election.db ./backup.db

# Pull updates (if using git)
git pull

# Rebuild and restart
docker-compose up -d --build
```

## Troubleshooting

### Can't access from outside
```bash
# Check firewall
sudo ufw status
sudo ufw allow 80/tcp

# Check if port is listening
sudo netstat -tlnp | grep :80

# Check Docker network
docker network inspect alumni-network
```

### Services not starting
```bash
# View detailed logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild from scratch
docker-compose down -v
docker-compose up -d --build
```

### Database issues
```bash
# Reset database (WARNING: Deletes all data!)
docker-compose down
rm -rf backend/data/election.db
docker-compose up -d
```

## Security Reminders

- ✅ Changed admin password
- ✅ Changed SECRET_KEY  
- ✅ Firewall enabled
- ✅ Only necessary ports open
- ✅ Regular backups scheduled
- ✅ HTTPS enabled (if using domain)

## Support Resources

- Full guide: DEPLOYMENT.md
- Quick reference: QUICK_DEPLOY.md
- Test results: TEST_RESULTS.md
- Features list: FEATURES.md

---

**Status:** Ready for production deployment! 🚀
