/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        "hunnys-common": "#A4A4A4",
        "hunnys-uncommon": "#2BC97E",
        "hunnys-rare": "#4B57FF",
        "hunnys-epic": "#4BB7FF",
        "hunnys-legendary": "#FFA54B",
        "hunnys-mythic": "#7B2BFF",
        "hunnys-immortal": "#FF2626",
        "hunnys-relic": "#774A2D",
        "hunnys-light-blue": "#4b57ff",
        "hunnys-light-purple": "#9e63ff",
        "profile-header": "#AA7AFA",
        "hunnys-yellow": "#ffd54b",
        "hunnys-orange": "#a26106",
        "hunnys-blue": "#700cf5",
        "hunnys-violet": "#A976FF",
        "hunnys-gray": "#aaa",
        "hunnys-green": "#0f9310",
        "hunnys-black": "#111",
      },
      fontFamily: {
        'luckiest': ['Luckiest Guy'],
        'dmsans': ['DM Sans']
      },
      screens: {
        'xl': '1300px',
        'big': '1100px',
        'lg': '950px',
        'md': '768px',
        'sm': '640px',
        'xs': '320px'
      }
    },
  },
  plugins: [],
};
