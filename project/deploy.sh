#!/bin/bash

# AWS Deployment Script
# This script prepares the application for deployment in AWS environments
# It ensures that dependencies are properly installed and the app is ready to run

# Ensure script fails on any command error
set -e

echo "🔄 Preparing application for AWS deployment..."

# Remove existing package-lock.json if present
if [ -f package-lock.json ]; then
  echo "⚠️ Removing existing package-lock.json..."
  rm package-lock.json
fi

# Clean install dependencies
echo "📦 Installing dependencies with clean npm install..."
npm install

# Check if we need to install optional dependencies for database mode
if [ "$INSTALL_DB_DEPS" = "true" ]; then
  echo "📦 Installing database-specific dependencies..."
  npm install @auth/prisma-adapter@1.6.0 @prisma/client@5.10.2
  
  # Generate Prisma client
  echo "🔧 Generating Prisma client..."
  npm run prisma:generate
else
  echo "ℹ️ Skipping database dependencies for demo-only mode"
fi

# Build the application
echo "🏗️ Building the application..."

# Use demo build if no database
if [ "$INSTALL_DB_DEPS" != "true" ]; then
  echo "🏗️ Building in demo-only mode..."
  npm run build:demo
else
  echo "🏗️ Building with database support..."
  npm run build
fi

echo "✅ Deployment preparation complete!"
echo "🚀 You can now deploy the application to AWS"
echo ""
echo "Make sure to set these environment variables in AWS:"
echo "- NEXTAUTH_URL: Your application URL"
echo "- NEXTAUTH_SECRET: A secure random string for JWT encryption"
echo "- ALLOW_DEMO_LOGIN: Set to true to enable demo mode without database"
echo ""
echo "Optional environment variables:"
echo "- DATABASE_URL: PostgreSQL connection string (not needed for demo-only mode)"
echo "- DEBUG_AUTH: Set to true for additional auth debugging"