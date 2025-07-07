module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'occitan-red': '#D02F2F',
        'occitan-orange': '#F37321',
        'occitan-yellow': '#F5C33C',
        'occitan-cream': '#FEF8F2',
        'occitan-light': '#F9F9F9',
      },
      fontFamily: {
        title: ['Merriweather', 'Playfair Display', 'serif'],
        body: ['Inter', 'Montserrat', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'pulse-cta': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.4,0,0.2,1) both',
        'pulse-cta': 'pulse-cta 1.5s cubic-bezier(0.4,0,0.2,1) infinite',
      },
      backgroundImage: {
        'occitan-cross': "url('/src/assets/croix_occitane.svg')",
        'occitan-motif': "url('/src/assets/motif_occitan.svg')",
        'occitan-landscape': "url('/src/assets/occitanie_landscape.jpg')",
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}; 