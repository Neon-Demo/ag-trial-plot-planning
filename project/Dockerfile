FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies based on package.json
FROM base AS builder
COPY package.json ./
RUN npm install --no-package-lock

# Conditionally install database packages
ARG DATABASE_URL
RUN if [ -n "$DATABASE_URL" ]; then \
    echo "Installing database packages..." && \
    npm install @auth/prisma-adapter@latest --no-package-lock && \
    echo "Database packages installed." ; \
    else \
    echo "Skipping database packages for demo mode." ; \
    fi

# Copy all files
COPY . .

# Generate Prisma client only if DATABASE_URL is provided
RUN if [ -n "$DATABASE_URL" ]; then \
    echo "Generating Prisma client..." && \
    npm run prisma:generate && \
    echo "Prisma client generated." ; \
    else \
    echo "Skipping Prisma client generation for demo mode." ; \
    fi

# Build application based on environment
ARG ALLOW_DEMO_LOGIN=true
RUN if [ -n "$DATABASE_URL" ]; then \
    echo "Building with database support..." && \
    npm run build ; \
    else \
    echo "Building in demo-only mode..." && \
    ALLOW_DEMO_LOGIN=true npm run build:demo ; \
    fi

# Production image
FROM base AS runner
WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy built files from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Start the application
CMD ["node", "server.js"]

# Usage Instructions:
# For demo mode:
# docker build -t ag-trial-app --build-arg ALLOW_DEMO_LOGIN=true .
# 
# For database mode:
# docker build -t ag-trial-app --build-arg DATABASE_URL=postgresql://user:password@host/db --build-arg ALLOW_DEMO_LOGIN=true .
#
# Run container:
# docker run -p 3000:3000 -e NEXTAUTH_SECRET=your-secret -e NEXTAUTH_URL=https://your-domain.com ag-trial-app