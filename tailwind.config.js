/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        chatBg: "#0B0E11",
        chatSidebar: "#15191C",
        chatPrimary: "#00A884"
      }
    },
  },
  plugins: [],
}