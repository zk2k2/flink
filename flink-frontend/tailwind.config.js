module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgba(0,190,142,0.1)',
          100: 'rgba(0,190,142,0.2)',
          500: 'rgba(0,190,142,255)',
          600: '#00a87e' // Darker shade for hover
        }
      }
    }
  },
  plugins: [],
}