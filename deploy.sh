#!/bin/bash
set -e

# Configuration
REGISTRY="ghcr.io"
USERNAME="dan-sic"  # Change this to your GitHub username
IMAGE_TAG="${1:-latest}"  # Use first argument as tag, default to 'latest'

echo "Building images..."
docker compose build

echo "Tagging images..."
# docker tag stock-app-web:latest $REGISTRY/$USERNAME/stock-app-web:$IMAGE_TAG
docker tag stock-app-automation:latest $REGISTRY/$USERNAME/stock-app-automation:$IMAGE_TAG

echo "Pushing images to $REGISTRY..."
# docker push $REGISTRY/$USERNAME/stock-app-web:$IMAGE_TAG
docker push $REGISTRY/$USERNAME/stock-app-automation:$IMAGE_TAG

echo "✅ Images pushed successfully!"
echo ""
echo "To deploy on VPS, run:"
echo "  docker compose -f docker-compose.prod.yml pull"
echo "  docker compose -f docker-compose.prod.yml up -d"
