# Stage 0: Base image definition
FROM node:24-alpine AS base

# Stage 1: Dependencies Installation
FROM base AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies (including devDependencies needed for the build)
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/db/package.json ./packages/db/

RUN npm ci --workspace=@stock-app/web --workspace=@stock-app/db --include-workspace-root

# Stage 2: Application Build
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

# Copy only what's needed for the build (be explicit to avoid copying unnecessary files)
COPY package.json package-lock.json ./
COPY tsconfig.json tsconfig.base.json ./
COPY apps/web ./apps/web
COPY packages/db ./packages/db

# Build db package first (needed if Next.js imports from it)
RUN npm run build -w @stock-app/db

# Build Next.js app
RUN npm run build -w @stock-app/web

# Stage 3: Production Runner
FROM base AS runner

# Install wget for healthcheck
RUN apk add --no-cache wget

ENV NODE_ENV=production

USER node

WORKDIR /app

# Copy standalone output (includes traced dependencies)
COPY --from=builder --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=builder --chown=node:node /app/apps/web/.next/static ./apps/web/.next/static

# Copy public folder if it exists
COPY --from=builder --chown=node:node /app/apps/web/public ./apps/web/public

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
