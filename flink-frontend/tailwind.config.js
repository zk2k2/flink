module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#11BC92",
        secondary: "#2E4755",
      },
      borderColor: {
        debug: "red",
      },
      borderWidth: {
        debug: "1px",
      },
    },
  },
  plugins: [],
  corePlugins: {
    borderColor: true,
    borderWidth: true,
  },
};
