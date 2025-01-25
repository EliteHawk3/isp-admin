/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}" // Ensures Tailwind scans all React files
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")], // Added forms plugin
};
