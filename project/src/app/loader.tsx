import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlaceholderImage } from './placeholder';

/**
 * ImageWithFallback component - enhanced Image component with robust fallback handling
 * Will show a proper placeholder if the image fails to load
 */
export const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc,
  ...props
}: {
  src: string;
  alt: string;
  fallbackSrc?: string;
  [key: string]: any;
}) => {
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Reset error state if src changes
  useEffect(() => {
    setError(false);
    setLoading(true);
  }, [src]);

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  // If there's an error and no fallback, show placeholder
  if (error && !fallbackSrc) {
    return <PlaceholderImage text={alt} width={props.width} height={props.height} />;
  }

  return (
    <>
      {/* Primary image */}
      <Image
        {...props}
        src={error && fallbackSrc ? fallbackSrc : src}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
      />
      
      {/* Show loading state or placeholder as needed */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse text-primary">Loading...</div>
        </div>
      )}
    </>
  );
};

export default ImageWithFallback;