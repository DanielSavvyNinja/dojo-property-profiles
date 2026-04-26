/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a1a2e',
          50: '#e8e8ed',
          100: '#c5c5d4',
          200: '#9f9fb8',
          300: '#79799c',
          400: '#5c5c87',
          500: '#3f3f72',
          600: '#2d2d52',
          700: '#1a1a2e',
          800: '#121222',
          900: '#0a0a15',
        },
        dojo: {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#2680ff',
          500: '#0066ff',
          600: '#0052cc',
          700: '#003d99',
          800: '#002966',
          900: '#001433',
        },
      },
    },
  },
  plugins: [],
};
