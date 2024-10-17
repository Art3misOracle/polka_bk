/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px #FFB800, 0 0 8px #FFB800, 0 0 10px #FFB800, 0 0 14px #FFB800, 0 0 20px #FFB800' },
          '50%': { boxShadow: '0 0 10px #FFB800, 0 0 16px #FFB800, 0 0 20px #FFB800, 0 0 28px #FFB800, 0 0 40px #FFB800' },
        }
      },
      animation: {
        glowPulse: 'glowPulse 1.5s infinite alternate',
      }
    },
  },
  plugins: [],
};
