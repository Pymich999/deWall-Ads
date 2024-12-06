module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include your source files
  ],
  theme: {
    extend: {
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        slideInRight: 'slideInRight 0.5s ease-in-out',
        slideInLeft: 'slideInLeft 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
};


