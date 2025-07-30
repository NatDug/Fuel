# 🐧 WeFuel Platform - Linux Deployment Guide

This guide provides comprehensive instructions for deploying the WeFuel platform on a Linux server.

## 📋 Prerequisites

### System Requirements
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: Minimum 10GB free space
- **CPU**: 2 cores minimum
- **Network**: Stable internet connection

### Required Software
- Node.js 18.x or higher
- MongoDB 6.0 or higher
- Nginx
- PM2 (for process management)
- Git

## 🚀 Deployment Options

### Option 1: Automated Script Deployment (Recommended)

1. **Upload your project to the Linux server**
   ```bash
   # On your local machine
   scp -r wefuel-platform/ user@your-server-ip:/home/user/
   scp -r wefuel-backend/ user@your-server-ip:/home/user/
   scp deploy-linux.sh user@your-server-ip:/home/user/
   ```

2. **SSH into your server**
   ```bash
   ssh user@your-server-ip
   ```

3. **Make the deployment script executable and run it**
   ```bash
   chmod +x deploy-linux.sh
   ./deploy-linux.sh
   ```

4. **Access your platform**
   - Open your browser and go to: `http://your-server-ip`

### Option 2: Docker Deployment

1. **Install Docker and Docker Compose**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER

   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Deploy with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access your platform**
   - Open your browser and go to: `http://your-server-ip`

### Option 3: Manual Deployment

#### Step 1: System Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

#### Step 2: Deploy Frontend

```bash
# Create deployment directory
sudo mkdir -p /opt/wefuel
sudo chown $USER:$USER /opt/wefuel

# Copy frontend files
cp -r wefuel-platform /opt/wefuel/

# Install dependencies and build
cd /opt/wefuel/wefuel-platform
npm install
npm run build
```

#### Step 3: Deploy Backend

```bash
# Copy backend files
cp -r wefuel-backend /opt/wefuel/

# Install dependencies
cd /opt/wefuel/wefuel-backend
npm install

# Create environment file
cat > config.env << EOF
MONGODB_URI=mongodb://localhost:27017/wefuel
PORT=4000
NODE_ENV=production
EOF

# Start with PM2
pm2 start index.js --name "wefuel-backend"
pm2 save
pm2 startup
```

#### Step 4: Configure Nginx

```bash
# Create nginx configuration
sudo tee /etc/nginx/sites-available/wefuel << EOF
server {
    listen 80;
    server_name _;

    # Frontend
    location / {
        root /opt/wefuel/wefuel-platform/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/wefuel /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 5: Configure Firewall

```bash
# Allow necessary ports
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

## 🔧 Post-Deployment Configuration

### 1. **SSL Certificate (Optional but Recommended)**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. **Database Backup Setup**

```bash
# Create backup script
cat > /opt/wefuel/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/wefuel/backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR
mongodump --db wefuel --out $BACKUP_DIR
echo "Database backup completed: $BACKUP_DIR"
EOF

chmod +x /opt/wefuel/backup-db.sh

# Add to crontab for daily backups
crontab -e
# Add: 0 2 * * * /opt/wefuel/backup-db.sh
```

### 3. **Monitoring Setup**

```bash
# Install monitoring tools
sudo npm install -g pm2-logrotate

# Configure PM2 log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## 🛠️ Management Commands

### Service Management

```bash
# Check service status
/opt/wefuel/status.sh

# Restart backend
pm2 restart wefuel-backend

# Restart nginx
sudo systemctl restart nginx

# View logs
pm2 logs wefuel-backend
sudo tail -f /var/log/nginx/error.log
```

### Update Platform

```bash
# Run update script
/opt/wefuel/deploy-update.sh

# Or manually
cd /opt/wefuel/wefuel-platform
git pull
npm install
npm run build

cd /opt/wefuel/wefuel-backend
git pull
npm install

pm2 restart wefuel-backend
sudo systemctl reload nginx
```

### Database Management

```bash
# Access MongoDB shell
mongosh wefuel

# Backup database
mongodump --db wefuel --out /opt/wefuel/backups/$(date +%Y%m%d)

# Restore database
mongorestore --db wefuel /opt/wefuel/backups/backup-folder/wefuel/
```

## 🔒 Security Considerations

### 1. **Firewall Configuration**
```bash
# Only allow necessary ports
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2. **User Permissions**
```bash
# Create dedicated user for the application
sudo adduser wefuel
sudo usermod -aG sudo wefuel

# Set proper file permissions
sudo chown -R wefuel:wefuel /opt/wefuel
sudo chmod -R 755 /opt/wefuel
```

### 3. **Environment Variables**
```bash
# Use strong passwords in production
# Update config.env with secure values
MONGODB_URI=mongodb://localhost:27017/wefuel
PORT=4000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
```

## 📊 Monitoring and Logs

### 1. **Application Logs**
```bash
# PM2 logs
pm2 logs wefuel-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### 2. **System Monitoring**
```bash
# Check system resources
htop
df -h
free -h

# Check service status
sudo systemctl status nginx
sudo systemctl status mongod
pm2 status
```

## 🚨 Troubleshooting

### Common Issues

1. **Port 80 already in use**
   ```bash
   sudo netstat -tulpn | grep :80
   sudo systemctl stop apache2  # if Apache is running
   ```

2. **MongoDB connection issues**
   ```bash
   sudo systemctl status mongod
   sudo systemctl restart mongod
   ```

3. **PM2 process not starting**
   ```bash
   pm2 delete wefuel-backend
   pm2 start /opt/wefuel/wefuel-backend/index.js --name wefuel-backend
   pm2 save
   ```

4. **Nginx configuration errors**
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Performance Optimization

1. **Enable Nginx caching**
2. **Configure MongoDB indexes**
3. **Use PM2 cluster mode for multiple CPU cores**
4. **Implement CDN for static assets**

## 📞 Support

For deployment issues:
1. Check the logs: `pm2 logs wefuel-backend`
2. Verify service status: `/opt/wefuel/status.sh`
3. Check firewall: `sudo ufw status`
4. Test connectivity: `curl http://localhost:4000/api/health`

---

**🎉 Your WeFuel platform is now ready for production use!** 