/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#475569',   // slate-600
        secondary: '#1e40af', // blue-800
        neutral: '#f9fafb',   // gray-50
        alert: '#dc2626',     // red-600
      }
    }
  },
  plugins: [],
};
