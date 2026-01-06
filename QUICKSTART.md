# Docker Deployment Quick Start

## Recommended: Registry Approach (GHCR)

### Setup (One-time)

1. **Create GitHub Personal Access Token**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Create token with `write:packages` and `read:packages` scopes
   - Save the token securely

2. **Login to GHCR locally**
   ```bash
   echo YOUR_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin
   ```

3. **Update files**
   - Edit `deploy.sh` line 5: change `YOUR_GITHUB_USERNAME`
   - Edit `docker-compose.prod.yml` lines 4-5: change `YOUR_GITHUB_USERNAME`

### Deploy

**From your local machine:**
```bash
./deploy.sh
```

**On your VPS:**
```bash
# First time setup
cd ~/stock-app
# Copy docker-compose.prod.yml and .env here

# Pull and run
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

---

## Alternative: Build on VPS (Simpler)

No registry needed, just build directly on VPS.

### Setup (One-time)

1. **Install Docker on VPS**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

2. **Clone repo on VPS**
   ```bash
   git clone YOUR_REPO_URL ~/stock-app
   cd ~/stock-app
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

### Deploy

**On your VPS:**
```bash
cd ~/stock-app
git pull
docker compose up -d --build
```

---

## Which approach to choose?

| Factor | Registry (GHCR) | Build on VPS |
|--------|-----------------|--------------|
| Setup complexity | Medium | Simple |
| Deployment speed | Fast (pull) | Slow (build) |
| VPS resources | Low | Medium-High |
| CI/CD ready | ✅ Yes | ❌ No |
| Rollback | ✅ Easy | ⚠️ Harder |

**Recommendation**: Start with "Build on VPS" for simplicity, migrate to registry approach later if needed.
