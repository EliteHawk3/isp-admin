/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ensures Tailwind scans all React files
  ],
  theme: {
    extend: {
      colors: {
        "cyber-green": "#00ff9d",
        "hologram-teal": "#00c9a7",
        "metallic-purple": "#a277ff",
        "deep-indigo": "#6d3bff",
        "neon-coral": "#ff3b6d",
        "glowing-crimson": "#ff144d",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")], // Added forms plugin
};
