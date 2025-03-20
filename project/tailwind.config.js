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
          DEFAULT: '#2a9d8f',
          light: '#8ed3cd',
          dark: '#1e776c',
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
      },
    },
  },
  plugins: [],
};