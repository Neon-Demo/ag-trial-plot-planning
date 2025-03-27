import React from 'react';

/**
 * PlaceholderImage component - renders a placeholder image with text when an image fails to load
 * Used as a fallback for missing or broken images
 */
export const PlaceholderImage = ({ 
  text = 'Agricultural Field Trial',
  width = '100%',
  height = '100%',
  bgColor = '#f0f4f8', 
  textColor = '#2a9d8f'
}: {
  text?: string;
  width?: string | number;
  height?: string | number;
  bgColor?: string;
  textColor?: string;
}) => {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: bgColor,
        color: textColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        textAlign: 'center',
        fontWeight: 'bold',
      }}
    >
      <svg 
        width="80" 
        height="80" 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg" 
        style={{ marginBottom: '1rem' }}
      >
        <path 
          d="M20 80 L20 30 L80 30 L80 80 Z" 
          stroke={textColor} 
          strokeWidth="4" 
          fill="none" 
        />
        <path 
          d="M30 70 L50 50 L70 70" 
          stroke={textColor} 
          strokeWidth="4" 
          fill="none"
        />
        <circle cx="65" cy="40" r="5" fill={textColor} />
      </svg>
      <div>{text}</div>
    </div>
  );
};

export default PlaceholderImage;