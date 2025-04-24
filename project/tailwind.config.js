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
          DEFAULT: '#14b8a6',
          light: '#5eead4',
          dark: '#0f766e',
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
        greenyellow: '#ADFF2F',
        orange: '#FF7F00',
      },
    },
  },
  plugins: [],
};