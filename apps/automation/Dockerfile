# Build stage
FROM node:24-alpine AS base


FROM base AS deps

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY apps/automation/package.json ./apps/automation/
COPY packages/db/package*.json ./packages/db/

# Install all dependencies for specific workspaces (including devDependencies for building)
RUN npm ci --workspace=@stock-app/automation --workspace=@stock-app/db --include-workspace-root

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

# Copy package files (needed for workspace commands)

# Copy source code and tsconfig files
COPY package.json package-lock.json ./
COPY tsconfig.json tsconfig.base.json ./
COPY apps/automation ./apps/automation
COPY packages/db ./packages/db

# Build the db package first, then the automation
RUN npm run build -w @stock-app/db
RUN npm run build -w @stock-app/automation

# Production stage
FROM base AS runner

USER node
WORKDIR /app

ENV NODE_ENV=production

COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node apps/automation/package.json ./apps/automation/
COPY --chown=node:node packages/db/package.json ./packages/db/

# Install only production dependencies for specific workspaces
RUN npm ci --workspace=@stock-app/automation --workspace=@stock-app/db --include-workspace-root --omit=dev

# Copy built files from builder stage
COPY --from=builder --chown=node:node /app/packages/db/dist ./packages/db/dist
COPY --from=builder --chown=node:node /app/apps/automation/dist ./apps/automation/dist

# Run compiled JavaScript
CMD ["npm", "run", "start", "-w", "@stock-app/automation"]
