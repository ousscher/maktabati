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
  },
  fontFamily: {
    main: ["CDV", "sans-serif"],
    second: ["Inter", "serif"],
    stats: ["DM Mono", "monospace"],
  }
};
export const plugins = [];
