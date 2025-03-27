#!/bin/bash
# This script will download the hero image from the GitHub issue attachment

# Create a directory for the download if it doesn't exist
mkdir -p downloads

# Download the image from the GitHub attachment URL
curl -s https://github.com/user-attachments/assets/af22f420-2040-4bd1-bcf9-660de8f28e90 -o downloads/temp-hero-image.jpg

# Copy the downloaded image to the public directory
cp downloads/temp-hero-image.jpg public/hero-image.jpg

# Clean up
rm -rf downloads

echo "Hero image has been updated successfully!"