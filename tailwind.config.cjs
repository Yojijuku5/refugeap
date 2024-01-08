/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
        "fade-out": { from: { opacity: 1 }, to: { opacity: 0 } },
        "drop-in": { from: { translate: "0 -100%" }, to: { translate: 0 } },
        "drop-out": { from: { translate: 0 }, to: { translate: "0 100%" } },
        "scale-up-small": { from: { scale: "0.9" }, to: { scale: 1 } },
        "home-page-hero": { from: { opacity: 0 }, to: { opacity: 1 } },
        slide: { from: { translate: "-100%" }, to: { translate: "100%" } },
      },

      animation: {
        "fade-in": "fade-in 300ms ease-out",
        "fade-out": "fade-out 300ms ease-out forwards",
        "drop-in": "drop-in 300ms ease-out",
        "drop-out": "drop-out 300ms ease-out forwards",
        "home-page-hero":
          "home-page-hero 500ms ease-out, scale-up-small 500ms ease-out",
        "scale-up-small": "scale-up-small 300ms ease-out",
        slide: "slide 2000ms ease-out infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/container-queries"),
  ],
};
