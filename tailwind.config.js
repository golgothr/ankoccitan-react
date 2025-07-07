/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./.storybook/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'occitan-red': '#D72638',
        'occitan-orange': '#FF9800',
        'occitan-yellow': '#FFD700',
        'occitan-cream': '#FEF8F2',
        'occitan-light': '#FFF1E6',
      },
    },
  },
  plugins: [],
}

