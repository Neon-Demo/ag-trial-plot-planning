#!/bin/bash

# Script to set up AWS Amplify environment variables
# Run this script to generate necessary environment variables for AWS Amplify deployment

# Set color variables
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== AWS Amplify Environment Setup ===${NC}"
echo ""
echo -e "${YELLOW}This script will help you set up environment variables for AWS Amplify.${NC}"
echo ""

# Function to generate a secure random string
generate_secret() {
  if command -v openssl &> /dev/null; then
    openssl rand -base64 32
  else
    # Fallback to less secure but more available method
    LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 32
  fi
}

# Prompt for Amplify URL
echo -e "${BLUE}What is your AWS Amplify app URL?${NC}"
echo -e "${YELLOW}Example: https://main.d123abc456def.amplifyapp.com${NC}"
read -p "URL: " amplify_url

# Validate URL format
if [[ ! $amplify_url =~ ^https?:// ]]; then
  echo -e "${RED}URL should start with http:// or https://${NC}"
  amplify_url="https://$amplify_url"
  echo -e "${YELLOW}Updated URL to: $amplify_url${NC}"
fi

# Generate NEXTAUTH_SECRET
echo ""
echo -e "${BLUE}Generating NEXTAUTH_SECRET...${NC}"
nextauth_secret=$(generate_secret)
echo -e "${GREEN}Generated NEXTAUTH_SECRET${NC}"

# Output environment variables
echo ""
echo -e "${BLUE}=== AWS Amplify Environment Variables ===${NC}"
echo ""
echo -e "${GREEN}Add these environment variables to your AWS Amplify app:${NC}"
echo ""
echo -e "${YELLOW}NEXTAUTH_URL=${NC}${amplify_url}"
echo -e "${YELLOW}NEXTAUTH_SECRET=${NC}${nextauth_secret}"
echo -e "${YELLOW}ALLOW_DEMO_LOGIN=${NC}true"
echo -e "${YELLOW}NODE_OPTIONS=${NC}--max_old_space_size=4096"
echo ""

# Create a local .env.amplify file
echo "# AWS Amplify Environment Variables" > .env.amplify
echo "NEXTAUTH_URL=${amplify_url}" >> .env.amplify
echo "NEXTAUTH_SECRET=${nextauth_secret}" >> .env.amplify
echo "ALLOW_DEMO_LOGIN=true" >> .env.amplify
echo "NODE_OPTIONS=--max_old_space_size=4096" >> .env.amplify

echo -e "${GREEN}Environment variables saved to .env.amplify${NC}"
echo ""
echo -e "${BLUE}=== Next Steps ===${NC}"
echo ""
echo "1. Add these environment variables in the AWS Amplify Console"
echo "   Navigate to: App settings > Environment variables"
echo ""
echo "2. Configure rewrites and redirects in AWS Amplify Console"
echo "   Navigate to: App settings > Rewrites and redirects"
echo ""
echo "3. Add this rewrite rule to handle client-side routing:"
echo "   Source: </^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>"
echo "   Target: /index.html"
echo "   Type: 200 (Rewrite)"
echo ""
echo -e "${GREEN}Setup complete!${NC}"