/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // World Autistic Brand Colors
        'wa-yellow': '#FFE500',
        'wa-yellow-dark': '#F1B812',
        'wa-brown': '#6F5300',
        'wa-red': '#EB4335',
        'wa-orange': '#F67C41',
        'wa-green': '#34A853',
        'wa-blue-dark': '#113E79',
        'wa-blue-light': '#0288D1',
        'wa-blue-modal': '#81D4FA',
        'wa-cream': '#FFFBEE',
        'wa-gray': '#E8E8E8',

        // Activity Card Colors
        'wa-numbers': '#AAD3E9',
        'wa-letters': '#F98EB0',
        'wa-animals': '#8ECF99',
        'wa-food': '#E07A5F',
        'wa-objects': '#6A4C93',
        'wa-colors': '#D9F99D',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      fontSize: {
        'title-lg': ['2.5rem', '3rem'],
        'title-md': ['2rem', '2.5rem'],
        'title-sm': ['1.5rem', '2rem'],
        'body-lg': ['1.125rem', '1.75rem'],
        'body-md': ['1rem', '1.5rem'],
        'body-sm': ['0.875rem', '1.25rem'],
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      boxShadow: {
        'wa-3d': '4px 4px 0px rgba(0,0,0,0.2)',
        'wa-3d-right': '4px 0px 0px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
};
