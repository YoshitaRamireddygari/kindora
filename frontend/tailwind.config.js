/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#343193', // Deep blue/purple from sidebar
        secondary: '#8A2BE2',
        accent: '#F9FAFB', // Background gray
        sidebar: '#2D298E', 
        sidebarHover: '#3D39B5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
