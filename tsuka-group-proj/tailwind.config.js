/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tsuka: {
          50: "#BBC3D7",
          100: "#828AA0",
          200: "#676F84",
          300: "#4D556A",
          400: "#343C4F",
          500: "#1F2333",
          600: "#191C29",
          700: "#13151F",
        },
        accent: "#E88326",
      },
    },
  },
  plugins: [],
};
