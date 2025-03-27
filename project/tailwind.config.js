/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4299e1', // Changed to light blue
          light: '#a3cbf6', // Lighter blue
          dark: '#2c5282', // Darker blue
        },
        secondary: {
          DEFAULT: '#e9c46a',
          light: '#f6e5b6',
          dark: '#d4a429',
        },
        accent: {
          DEFAULT: '#e76f51',
          light: '#f2b5a7',
          dark: '#be532a',
        },
        // Background colors
        background: {
          DEFAULT: '#ebf8ff', // Very light blue
          secondary: '#e6f1fc', // Another light blue shade
        },
      },
    },
  },
  plugins: [],
};