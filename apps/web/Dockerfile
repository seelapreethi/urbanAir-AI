FROM node:20-alpine AS builder
WORKDIR /workspace

# Copy root configs and package maps
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/shared/package.json ./packages/shared/package.json
COPY packages/ui/package.json ./packages/ui/package.json

# Install workspace dependencies
RUN npm ci

# Copy application and packages sources
COPY apps/web ./apps/web
COPY packages/shared ./packages/shared
COPY packages/ui ./packages/ui

# Compile Next.js build
RUN npm run build:web

# Expose Next.js runtime port
EXPOSE 3000

# Start Next.js server workspace context
CMD ["npm", "run", "start", "-w", "apps/web"]
