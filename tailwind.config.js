module.exports = {
  darkMode: 'class', // Use class-based dark mode
  content: ['./src/**/*.{js,ts,jsx,tsx}'], // Scan your source files
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',   // Vibrant Blue
        secondary: '#10B981', // Vibrant Green
        accent: '#EF4444',    // Vibrant Red
      },
    },
  },
  plugins: [],
};
