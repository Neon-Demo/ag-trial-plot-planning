# AG Trial Plot Planning Source Code

This directory contains the source code for the AG Trial Plot Planning application.

## Recent Updates

### Hero Image Implementation

The hero image has been updated to use a robust client-side implementation that:

1. Properly handles loading states with a placeholder
2. Gracefully handles missing or broken images
3. Follows Next.js best practices for mixing server and client components

#### Implementation Details

- `hero-image.client.tsx` - Client component with error handling
- `placeholder.tsx` - Reusable placeholder component with SVG visualization
- Both components use the 'use client' directive for client-side interactivity

#### Usage

The hero image is used on the landing page and will display the agricultural trial image from `/public/hero-image.jpg`. If this image is not available, it will show a placeholder with a visual representation of agricultural field trials.