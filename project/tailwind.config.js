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
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        secondary: {
          50: '#f5f7fa',
          100: '#eaedf4',
          200: '#dce1e9',
          300: '#cbd3dd',
          400: '#aeb9c8',
          500: '#919fb2',
          600: '#7d8a9f',
          700: '#6d7a8c',
          800: '#5c6674',
          900: '#4d5560',
          950: '#30353d',
        },
      },
    },
  },
  plugins: [],
};