#!/bin/bash

# Check if package-lock.json is incomplete or missing required dependencies
if [ ! -f package-lock.json ] || grep -q "Missing:" <(npm ci 2>&1); then
  echo "⚠️ Package lock file is missing or incomplete. Regenerating..."
  rm -f package-lock.json
  npm install
else
  echo "✅ Package lock file looks good."
fi

# Generate Prisma client if needed
if [ ! -d "node_modules/.prisma" ]; then
  echo "🔧 Generating Prisma client..."
  npm run prisma:generate
fi

# Start the Next.js development server
echo "Starting AG Trial Plot Planning application..."
echo "Access the application at http://localhost:3000"
echo ""
echo "Demo login credentials:"
echo "- Admin: admin@example.com (role: admin)"
echo "- Researcher: researcher@example.com (role: researcher)"
echo "- Field Technician: field-tech@example.com (role: field-technician)"
echo ""

# Set demo mode for local development
export ALLOW_DEMO_LOGIN=true

npm run dev