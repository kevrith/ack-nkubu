/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      colors: {
        navy: {
          DEFAULT: '#1a3a5c',
          50:  '#e8eef5',
          100: '#c5d4e6',
          200: '#9eb7d4',
          300: '#7799c2',
          400: '#5a83b5',
          500: '#3d6da8',
          600: '#2f5a8f',
          700: '#1a3a5c',
          800: '#122940',
          900: '#0a1827',
        },
        gold: {
          DEFAULT: '#c9a84c',
          50:  '#fdf8ec',
          100: '#f7ecc8',
          200: '#f0dea0',
          300: '#e8cf78',
          400: '#dfc158',
          500: '#c9a84c',
          600: '#a8873a',
          700: '#82682b',
          800: '#5c491e',
          900: '#362b11',
        },
        cream: '#faf8f4',
        charcoal: '#2d2d2d',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
        lora: ['Lora', 'serif'],
      },
    },
  },
  plugins: [],
}
