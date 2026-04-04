import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        medhelp: {
          900: '#0B1F3A',
          800: '#1E3A8A',
          700: '#2563EB',
          danger: '#E11D48',
        },
      },
      boxShadow: {
        glow: '0 20px 50px rgba(20, 46, 92, 0.45)',
      },
      backdropBlur: {
        xxl: '20px',
      },
    },
  },
  plugins: [],
};

export default config;
