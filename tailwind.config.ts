import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  plugins: [],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#f97316",
          primaryHover: "#ea580c",
          secondary: "#fff7ed",
          neutral: "#f8fafc",
          success: "#16a34a",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
};

export default config;
