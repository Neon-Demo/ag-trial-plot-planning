'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PlaceholderImage } from './placeholder';

// Client component for handling the hero image with error states
export default function HeroImage() {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Attempt to load the hero image */}
      <Image
        src="/hero-image.jpg"
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
      
      {/* Show placeholder while loading or if error */}
      {(!imageLoaded || imageError) && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary-light">
          <PlaceholderImage 
            text={imageError ? "Image could not be loaded" : "Loading agricultural trial image..."}
            width="100%" 
            height="100%"
            bgColor="#e8f4ea"
            textColor="#2a9d8f"
          />
        </div>
      )}
    </div>
  );
}