/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './base/**/*.{vue,js,ts,jsx,tsx}',
    './domain/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#409EFF',
        success: '#67C23A',
        warning: '#E6A23C',
        danger: '#F56C6C',
        info: '#909399',
        border: {
          DEFAULT: '#DCDFE6',
          light: '#DCDFE6',
          dark: '#4C4D4F',
        },
        background: {
          DEFAULT: '#FFFFFF',
          light: '#FFFFFF',
          dark: '#2C2D2F',
        },
      },
    },
  },
  plugins: ['@tailwindcss/line-clamp'],
};
