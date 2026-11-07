import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        kisser: {
          canvas: "#F3F1EA",
          surface: "#E7E4DA",
          border: "#CEC9BC",
          ink: "#181A18",
          gunmetal: "#434642",
          muted: "#5F635D",
          stage: "#1A1C1A",
          green: "#146B38",
          red: "#9E1B22",
          graphite: "#373B40",
          yellow: "#DF9F14",
        },
      },
    },
  },
  plugins: [],
};
export default config;
