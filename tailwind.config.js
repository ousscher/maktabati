import { tailwindColors } from './src/utils/generateColorTheme';

/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
];
export const darkMode = ['selector', '[data-mode="dark"]'];
export const theme = {
  extend: {
    colors: {
      ...tailwindColors,
    },
    animation: {
      fadeIn: 'fadeIn 0.3s ease-out',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0', transform: 'translateY(10px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
    },
  },
  fontFamily: {
    main: ["CDV", "sans-serif"],
    second: ["Inter", "serif"],
    stats: ["DM Mono", "monospace"],
  }
};
export const plugins = [];
