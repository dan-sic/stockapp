# Build stage
FROM node:24-alpine AS base


FROM base AS deps

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY apps/news-scrapper/package.json ./apps/news-scrapper/
COPY packages/db/package*.json ./packages/db/

# Install all dependencies for specific workspaces (including devDependencies for building)
RUN npm ci --workspace=@stock-app/scraper --workspace=@stock-app/db --include-workspace-root

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

# Copy package files (needed for workspace commands)

# Copy source code and tsconfig files
COPY package.json package-lock.json ./
COPY tsconfig.json tsconfig.base.json ./
COPY apps/news-scrapper ./apps/news-scrapper
COPY packages/db ./packages/db

# Build the db package first, then the scraper
RUN npm run build -w @stock-app/db
RUN npm run build -w @stock-app/scraper

# Production stage
FROM base AS runner

USER node
WORKDIR /app

ENV NODE_ENV=production

COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node apps/news-scrapper/package.json ./apps/news-scrapper/
COPY --chown=node:node packages/db/package.json ./packages/db/

# Install only production dependencies for specific workspaces
RUN npm ci --workspace=@stock-app/scraper --workspace=@stock-app/db --include-workspace-root --omit=dev

# Copy built files from builder stage
COPY --from=builder --chown=node:node /app/packages/db/dist ./packages/db/dist
COPY --from=builder --chown=node:node /app/apps/news-scrapper/dist ./apps/news-scrapper/dist

# Run compiled JavaScript
CMD ["npm", "run", "start", "-w", "@stock-app/scraper"]
