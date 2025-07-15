/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        'occitan-red': '#d02f2f',
        'occitan-orange': '#f37321',
        'occitan-yellow': '#f5c33c',
        'occitan-cream': '#fef8f2',
        'occitan-light': '#f9f9f9',
      },
    },
  },
  plugins: [],
};
