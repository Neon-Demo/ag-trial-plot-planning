'use client';

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
        {/* Agricultural field */}
        <path 
          d="M10 80 L10 40 L90 40 L90 80 Z" 
          stroke={textColor} 
          strokeWidth="2" 
          fill="none" 
        />
        {/* Rows of crops */}
        <path 
          d="M20 80 L20 40" 
          stroke={textColor} 
          strokeWidth="1" 
          fill="none"
        />
        <path 
          d="M30 80 L30 40" 
          stroke={textColor} 
          strokeWidth="1" 
          fill="none"
        />
        <path 
          d="M40 80 L40 40" 
          stroke={textColor} 
          strokeWidth="1" 
          fill="none"
        />
        <path 
          d="M50 80 L50 40" 
          stroke={textColor} 
          strokeWidth="1" 
          fill="none"
        />
        <path 
          d="M60 80 L60 40" 
          stroke={textColor} 
          strokeWidth="1" 
          fill="none"
        />
        <path 
          d="M70 80 L70 40" 
          stroke={textColor} 
          strokeWidth="1" 
          fill="none"
        />
        <path 
          d="M80 80 L80 40" 
          stroke={textColor} 
          strokeWidth="1" 
          fill="none"
        />
        {/* Person 1 in the field */}
        <circle cx="25" cy="50" r="4" fill={textColor} />
        <line x1="25" y1="54" x2="25" y2="65" stroke={textColor} strokeWidth="2" />
        <line x1="18" y1="58" x2="32" y2="58" stroke={textColor} strokeWidth="1.5" />
        <line x1="25" y1="65" x2="20" y2="75" stroke={textColor} strokeWidth="1.5" />
        <line x1="25" y1="65" x2="30" y2="75" stroke={textColor} strokeWidth="1.5" />
        
        {/* Person 2 in the field */}
        <circle cx="65" cy="55" r="4" fill={textColor} />
        <line x1="65" y1="59" x2="65" y2="70" stroke={textColor} strokeWidth="2" />
        <line x1="58" y1="63" x2="72" y2="63" stroke={textColor} strokeWidth="1.5" />
        <line x1="65" y1="70" x2="60" y2="80" stroke={textColor} strokeWidth="1.5" />
        <line x1="65" y1="70" x2="70" y2="80" stroke={textColor} strokeWidth="1.5" />
      </svg>
      <div>{text}</div>
    </div>
  );
};

export default PlaceholderImage;