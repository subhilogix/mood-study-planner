/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        mind: {
          bg: "#FAF9F7",
          card: "#F7F4FD",
          cardSoft: "#F5F2EC",
          border: "#E7E3DD",
          borderSoft: "#E8DFF7",
          primary: "#EADCFB",
          primarySoft: "#DCCBFA",
          primaryDeep: "#C7B3F0",
          textMain: "#4B3A6F",
          textSoft: "#7C6F92",
          textMuted: "#6D6D6D",
          accentMint: "#DFF7EB"
        }
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem"
      },
      boxShadow: {
        soft: "0 8px 24px rgba(15,23,42,0.05)"
      },
      fontFamily: {
        sans: ['system-ui', 'SF Pro Text', 'Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};
