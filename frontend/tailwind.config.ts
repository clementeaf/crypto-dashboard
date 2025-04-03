import type { Config } from "tailwindcss";
import { colors } from "./app/styles/themes/colors";
import { typography } from "./app/styles/themes/typography";
import { spacing } from "./app/styles/themes/spacing";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class', // o 'media' para activar modo oscuro basado en preferencias del sistema
  theme: {
    extend: {
      colors,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      lineHeight: typography.lineHeight,
      fontWeight: typography.fontWeight,
      spacing: spacing.spacing,
      screens: spacing.screens,
      borderRadius: {
        'card': '0.75rem',
      },
      boxShadow: {
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
