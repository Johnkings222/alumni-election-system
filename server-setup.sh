#!/bin/bash

# Server Setup Script for Alumni Election System
# Run this on your fresh server to install all dependencies

set -e

echo "=================================================="
echo "Alumni Election System - Server Setup"
echo "=================================================="
echo ""
echo "This will install:"
echo "  - Docker"
echo "  - Docker Compose"
echo "  - Configure firewall"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo "🔄 Updating system packages..."
sudo apt-get update

echo ""
echo "📦 Installing dependencies..."
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

echo ""
echo "🐳 Installing Docker..."
# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up stable repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add current user to docker group
sudo usermod -aG docker $USER

echo ""
echo "📦 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo ""
echo "🔥 Configuring firewall..."
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw --force enable

echo ""
echo "🔄 Enabling Docker to start on boot..."
sudo systemctl enable docker

echo ""
echo "=================================================="
echo "✅ Server Setup Complete!"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Log out and log back in for Docker permissions"
echo "2. Upload your application files"
echo "3. Run: ./deploy.sh"
echo ""
echo "To test Docker installation:"
echo "  docker --version"
echo "  docker-compose --version"
echo ""
echo "=================================================="
