# Deployment Guide

## Setup (One-time)

### 1. Configure GitHub Container Registry (GHCR)

```bash
# Create a GitHub Personal Access Token with 'write:packages' permission
# Go to: GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
# Create new token with 'write:packages' and 'read:packages' scopes

# Login to GHCR on your local machine
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

### 2. Update Configuration Files

Edit the following files and replace `YOUR_GITHUB_USERNAME` with your actual GitHub username:

- `docker-compose.prod.yml` (lines 4-5)
- `deploy.sh` (line 5)

### 3. Configure VPS

SSH into your VPS and install Docker:

```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Log out and back in for group changes to take effect

# Login to GHCR on VPS
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Create deployment directory
mkdir -p ~/stock-app
cd ~/stock-app
```

Copy these files to your VPS:

- `docker-compose.prod.yml`
- `.env` (with production values)

## Deployment Workflow

### From Your Local Machine:

```bash
# 1. Build and push images to registry
./deploy.sh

# Optional: Tag with version
./deploy.sh v1.0.0
```

### On Your VPS:

```bash
cd ~/stock-app

# 1. Pull latest images
docker compose -f docker-compose.prod.yml pull

# 2. Start services
docker compose -f docker-compose.prod.yml up -d

# 3. View logs
docker compose -f docker-compose.prod.yml logs -f

# 4. Check status
docker compose -f docker-compose.prod.yml ps
```

## Common Commands

### Local (Build & Push)

```bash
# Build and push
./deploy.sh

# Build with specific tag
./deploy.sh v1.2.3
```

### VPS (Pull & Run)

```bash
# Update to latest
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# Restart specific service
docker compose -f docker-compose.prod.yml restart web

# View logs
docker compose -f docker-compose.prod.yml logs -f web
docker compose -f docker-compose.prod.yml logs -f automation

# Stop all services
docker compose -f docker-compose.prod.yml down

# Stop and remove volumes
docker compose -f docker-compose.prod.yml down -v
```

## Environment Variables

Create a `.env` file on your VPS with:

```env
DATABASE_URL=postgres://username:password@host:port/database
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
```

## Nginx Configuration

Example nginx config for your VPS:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### Images not building

```bash
# Check Docker is running
docker ps

# Rebuild without cache
docker compose build --no-cache
```

### Can't push to registry

```bash
# Re-login to GHCR
echo YOUR_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin
```

### Service not starting on VPS

```bash
# Check logs
docker compose -f docker-compose.prod.yml logs

# Check if port is already in use
sudo netstat -tulpn | grep :3000
```

## Alternative: Build on VPS (Simpler but slower)

If you prefer not to use a registry:

1. Push code to GitHub
2. On VPS:

```bash
cd ~/stock-app
git pull
docker compose up -d --build
```

This builds directly on the VPS (no registry needed).
