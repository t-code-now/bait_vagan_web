/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        sky:   { 50:'#f0f9ff', 100:'#e0f2fe', 200:'#bae6fd', 300:'#7cc7ef', 400:'#38bdf8', 500:'#0ea5e9', 600:'#0284c7', 900:'#0c3b5e' },
        pinky: { 50:'#fff0f7', 100:'#ffe0ef', 300:'#ff8ac4', 400:'#f7559f', 500:'#e8288a', 600:'#c81873' },
        grass: { 100:'#e8f8d4', 300:'#a6e06b', 400:'#85cf3f', 500:'#62b22a', 600:'#4a8f1d' },
        sun:   { 100:'#fff6d6', 300:'#ffd84d', 400:'#ffc61a' },
        navy:  '#1f2a5c',
      },
      fontFamily: {
        display: ['Rubik', 'sans-serif'],
        body: ['"Varela Round"', 'Rubik', 'sans-serif'],
      },
    },
  },
};
