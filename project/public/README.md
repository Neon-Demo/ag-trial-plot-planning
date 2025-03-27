# Public Assets Directory

This directory contains static assets for the AG Trial Plot Planning application.

## Hero Image Issue

There is an issue with the hero image loading. We need to manually place the correct image file in this directory. 

### Direct Solution

Since automated scripts aren't working correctly, please take these manual steps:

1. Save this image (from issue #2) as `hero-image.jpg` in this directory:
   ![Agricultural Trial Image](https://github.com/user-attachments/assets/af22f420-2040-4bd1-bcf9-660de8f28e90)

2. The file should be saved exactly as:
   ```
   /project/public/hero-image.jpg
   ```

3. Verify that the image appears on the homepage after saving it to this location.

### Image Requirements

- The image should show agricultural field trials with researchers
- It must be named exactly `hero-image.jpg`
- It must be placed directly in this directory (not in a subdirectory)

### Technical Implementation

The image loading is handled by a client-side component with error handling that will:
- Display the image when available
- Show a placeholder when the image is missing or fails to load
- Properly handle loading states