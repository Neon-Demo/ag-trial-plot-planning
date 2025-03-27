'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PlaceholderImage } from './placeholder';

// Client component for handling the hero image with error states
export default function HeroImage() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {!imageError ? (
        <Image
          src="/hero-image.jpg"
          alt="Agricultural field trials with researchers collecting data"
          fill
          style={{ objectFit: 'cover' }}
          priority
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-primary-light">
          <PlaceholderImage 
            text="Agricultural Field Trials" 
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