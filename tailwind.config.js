/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        space: "#050A15",
        "electric-blue": "#00D4FF",
        "neon-purple": "#7B2FFF",
        "deep-space": "#02040a",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
        display: ["Space Grotesk", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      backdropBlur: {
        glass: "20px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "electric-gradient": "linear-gradient(135deg, #00D4FF 0%, #7B2FFF 100%)",
        "text-gradient": "linear-gradient(135deg, #FFFFFF 0%, #00D4FF 50%, #7B2FFF 100%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "meteor": "meteor 5s linear infinite",
        "typing": "typing 3.5s steps(40, end)",
        "blink": "blink .75s step-end infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        meteor: {
          "0%": { transform: "translateX(0) translateY(0)", opacity: 1 },
          "70%": { opacity: 1 },
          "100%": { transform: "translateX(-500px) translateY(500px)", opacity: 0 },
        },
        typing: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
      },
      boxShadow: {
        "glow-cyan": "0 0 40px rgba(0, 212, 255, 0.4)",
        "glow-purple": "0 0 40px rgba(123, 47, 255, 0.4)",
        "glow-white": "0 0 20px rgba(255, 255, 255, 0.3)",
      },
    },
  },
  plugins: [],
};
