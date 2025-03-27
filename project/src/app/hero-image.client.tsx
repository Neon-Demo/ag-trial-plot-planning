'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PlaceholderImage } from './placeholder';

// Client component for handling the hero image with error states
export default function HeroImage() {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Try primary image first (from public directory)
  const primaryImageSrc = "/hero-image.jpg";
  
  // Backup image options if primary fails - static import or base64 data
  // Note: In a production app, we would handle this differently
  // This is a fallback approach for this specific issue
  const fallbackImage = "/images/fallback-agricultural-trial.jpg";

  return (
    <div className="relative w-full h-full">
      {/* Primary image attempt */}
      <Image
        src={primaryImageSrc}
        alt="Agricultural field trials with researchers collecting data"
        fill
        style={{ 
          objectFit: 'cover',
          opacity: imageLoaded && !imageError ? 1 : 0, 
          transition: 'opacity 0.3s ease-in-out'
        }}
        priority
        onError={() => setImageError(true)}
        onLoad={() => setImageLoaded(true)}
      />
      
      {/* Try fallback image if primary fails */}
      {imageError && (
        <div className="absolute inset-0">
          {/* Instructions to manually add the image */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary-light p-4 text-center">
            <h3 className="text-primary font-bold mb-2">Image Not Found</h3>
            <p className="text-sm text-gray-700 mb-4">
              Please add the agricultural trial image to:
              <br />
              <code className="bg-gray-100 px-2 py-1 rounded">/project/public/hero-image.jpg</code>
            </p>
            <PlaceholderImage 
              text="Agricultural Field Trial" 
              width="80%" 
              height="60%"
              bgColor="#e8f4ea"
              textColor="#2a9d8f"
            />
            <p className="text-xs text-gray-600 mt-4">
              See instructions in <code>/project/public/hero-image-instructions.md</code>
            </p>
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary-light">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-primary font-medium">Loading image...</p>
          </div>
        </div>
      )}
    </div>
  );
}