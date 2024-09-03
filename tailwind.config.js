/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideBottom: {
          from: {
            transform: "translateY(-40%)",
            opacity: 0,
          },
          to: {
            transform: `translateY(0px)`,
            opacity: 1,
          },
        },
        slideRight: {
          from: {
            transform: "translateX(-10%)",
            opacity: 0,
          },
          to: {
            transform: `translateX(0px)`,
            opacity: 1,
          },
        },
        slideLeft: {
          from: {
            transform: "translateX(10%)",
            opacity: 0,
          },
          to: {
            transform: `translateX(0px)`,
            opacity: 1,
          },
        },
        slideUp: {
          from: {
            transform: "translateY(40%)",
            opacity: 0,
          },
          to: {
            transform: `translateY(0px)`,
            opacity: 1,
          },
        },
        zoomOut: {
          from: {
            transform: `scale(0.7)`,
          },
          to: {
            transform: `scale(1)`,
          },
        },
      },

      animation: {
        slideBottom: `slideBottom 1s ease forwards`,
        slideRight: `slideRight 1.5s ease forwards`,
        slideLeft: `slideLeft 1.5s ease forwards`,
        slideUp: `slideUp 1.5s ease forwards`,
        zoomOut: `zoomOut 2s ease-out`,
      },
    },
  },
  plugins: [],
};
