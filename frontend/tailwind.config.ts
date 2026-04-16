import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#070a0f",
        steel: "#18212f",
        radar: "#32f5c8",
        amberline: "#f4c95d",
        alert: "#ff4d5a"
      },
      boxShadow: {
        tactical: "0 0 0 1px rgba(50,245,200,.16), 0 18px 60px rgba(0,0,0,.35)"
      }
    }
  },
  plugins: []
};

export default config;
