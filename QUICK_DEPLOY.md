# 🚀 Quick Deploy to Your China Server

## Super Fast Deployment (5 Minutes)

### On Your Local Machine:

```bash
# 1. Package the application
cd /home/kings/Documents
tar -czf alumni-election.tar.gz alumni-election-system/

# 2. Upload to your server (replace YOUR_SERVER_IP and USERNAME)
scp alumni-election.tar.gz username@YOUR_SERVER_IP:/home/username/
```

### On Your Server (SSH into it):

```bash
# 1. Extract files
tar -xzf alumni-election.tar.gz
cd alumni-election-system

# 2. Setup server (first time only)
chmod +x server-setup.sh
./server-setup.sh

# 3. Log out and back in (for Docker permissions)
exit
# SSH back in

# 4. Configure and deploy
cd alumni-election-system
cp .env.production backend/.env
nano backend/.env  # Change ADMIN_PASSWORD and SECRET_KEY

# 5. Deploy!
chmod +x deploy.sh
./deploy.sh
```

**That's it!** Your app is live at: `http://YOUR_SERVER_IP`

---

## Even Faster (If Docker Already Installed):

```bash
# On server
cd alumni-election-system
./deploy.sh
```

Done! ✅

---

## Access Your Live Application

**Public URLs** (share with voters):
- Main voting page: `http://YOUR_SERVER_IP`
- Live results: `http://YOUR_SERVER_IP/results`

**Admin URL** (keep private):
- Admin panel: `http://YOUR_SERVER_IP/admin`

---

## Common Server Commands

```bash
# View logs
docker-compose logs -f

# Stop application
docker-compose down

# Restart application
docker-compose restart

# Check status
docker-compose ps

# Backup database
docker cp alumni-election-backend:/app/data/election.db ./backup.db
```

---

## With Custom Domain (Optional)

If you have a domain like `election.example.com`:

1. **Point domain to server IP** (in your DNS provider)
   - Add A record: `election` → `YOUR_SERVER_IP`

2. **Update nginx config:**
   ```bash
   nano frontend/nginx.conf
   # Change "server_name localhost;" to "server_name election.example.com;"
   ```

3. **Rebuild:**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

Your app is now at: `http://election.example.com`

---

## For China Servers Specifically

### Speed Up Docker Downloads

```bash
# Use Chinese Docker mirrors
sudo mkdir -p /etc/docker
sudo nano /etc/docker/daemon.json
```

Add this:
```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://registry.docker-cn.com"
  ]
}
```

Restart Docker:
```bash
sudo systemctl restart docker
```

### Firewall for China Servers

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

---

## Troubleshooting

**Can't access from outside?**
```bash
# Check if running
docker-compose ps

# Check firewall
sudo ufw status

# Check if port is listening
sudo netstat -tlnp | grep :80
```

**Need to reset everything?**
```bash
docker-compose down
rm -rf backend/data/election.db
docker-compose up -d --build
```

---

## Cost Estimate

**Server Requirements:**
- **Small election (< 100 voters):** 1GB RAM, $5-10/month
- **Medium (100-500 voters):** 2GB RAM, $10-20/month
- **Large (500+ voters):** 4GB RAM, $20-40/month

**Popular providers for China:**
- Aliyun (阿里云)
- Tencent Cloud (腾讯云)
- Huawei Cloud (华为云)

---

## Security Checklist ✅

Before sharing the link:
- [ ] Changed admin password in `backend/.env`
- [ ] Changed SECRET_KEY in `backend/.env`
- [ ] Firewall is enabled
- [ ] Only port 80 and 22 are open
- [ ] Database backups scheduled

---

## That's It!

Your election system is now:
- ✅ Live 24/7
- ✅ Accessible from anywhere
- ✅ Mobile-friendly
- ✅ Auto-restarts if server reboots
- ✅ Ready for voting!

Share your server IP with voters and they can start voting immediately.

**Example:**
"Go to http://123.45.67.89 and enter your voting code"
