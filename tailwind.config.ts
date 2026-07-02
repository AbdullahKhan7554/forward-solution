import type { Config } from "tailwindcss";

/**
 * Tailwind is configured as a thin surface over the Design System v1.0 tokens.
 * Colours, spacing, radius, shadows and type are the *single source of truth*
 * from the Design System document — nothing is invented here.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    // Systematic breakpoints — 375 / 768 / 1024 / 1440 (Design System §4)
    screens: {
      xs: "375px",
      md: "768px",
      lg: "1024px",
      xl: "1440px",
    },
    extend: {
      colors: {
        // Corporate identity v2 — Green #008A4B · Blue #0064C1 · Navy #16163F.
        // `primary-600` is the green CTA; `primary-700` is the blue (CTA hover
        // + links). Both remain within one scale so every existing
        // `bg-primary-600 hover:bg-primary-700` button transitions green → blue.
        primary: {
          50: "#E6F4EC",
          100: "#C4E7D5",
          200: "#8DD2AF",
          300: "#51BA86",
          400: "#1E9E62",
          500: "#008A4B",
          600: "#008A4B",
          700: "#0064C1",
          800: "#004E96",
          900: "#16163F",
          DEFAULT: "#008A4B",
        },
        // Blue brand — links, blue micro-details and alternation.
        secondary: {
          300: "#6FA8E0",
          500: "#0064C1",
          700: "#004E96",
          900: "#16163F",
          DEFAULT: "#0064C1",
        },
        // Green brand — icons, hairlines, accent details.
        accent: {
          100: "#DBF1E6",
          300: "#5FC091",
          500: "#008A4B",
          600: "#00743E",
          700: "#005B31",
          DEFAULT: "#008A4B",
        },
        neutral: {
          0: "#FFFFFF",
          50: "#FAFBFC",
          100: "#F2F5F7",
          200: "#E4E9ED",
          300: "#CBD3DA",
          400: "#A4B0B9",
          500: "#788790",
          600: "#586771",
          700: "#3C4A53",
          800: "#242449",
          900: "#16163F",
        },
        ink: "#16163F",
        base: "#FAFBFC",
        pure: "#FFFFFF",
        dark: "#0B1116",
        "dark-rich": "#16163F",
        success: "#008A4B",
        warning: "#C0862B",
        error: "#C0473E",
      },
      // 4px base spacing scale (Design System §3)
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
        "12": "48px",
        "16": "64px",
        "24": "96px",
        "32": "128px",
      },
      borderRadius: {
        xs: "6px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        full: "999px",
      },
      boxShadow: {
        // Soft dark-navy shadows (Navy #16163F = rgb(22,22,63)) at very low opacity.
        soft: "0 1px 3px 0 rgba(22,22,63,0.06), 0 1px 2px 0 rgba(22,22,63,0.04)",
        medium: "0 8px 24px -4px rgba(22,22,63,0.08), 0 2px 6px 0 rgba(22,22,63,0.05)",
        floating: "0 24px 60px -12px rgba(22,22,63,0.14), 0 8px 20px -6px rgba(22,22,63,0.08)",
        glass: "0 12px 40px -8px rgba(22,22,63,0.12), inset 0 1px 0 rgba(255,255,255,0.5)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      // Type scale (Design System §2) — [size, { lineHeight, letterSpacing }]
      fontSize: {
        "display-xxl": ["96px", { lineHeight: "100px", letterSpacing: "-0.02em", fontWeight: "300" }],
        "display-xl": ["72px", { lineHeight: "78px", letterSpacing: "-0.015em", fontWeight: "300" }],
        h1: ["56px", { lineHeight: "64px", letterSpacing: "-0.01em", fontWeight: "400" }],
        h2: ["40px", { lineHeight: "48px", letterSpacing: "-0.005em", fontWeight: "400" }],
        h3: ["30px", { lineHeight: "40px", letterSpacing: "-0.0025em", fontWeight: "500" }],
        h4: ["22px", { lineHeight: "30px", letterSpacing: "0", fontWeight: "500" }],
        "body-lg": ["19px", { lineHeight: "30px" }],
        body: ["16px", { lineHeight: "26px" }],
        small: ["14px", { lineHeight: "22px", letterSpacing: "0.005em" }],
        caption: ["12px", { lineHeight: "18px", letterSpacing: "0.02em" }],
      },
      maxWidth: {
        container: "1280px",
      },
      transitionTimingFunction: {
        // Brand easing signatures (Motion Bible / Design System §13)
        "brand-out": "cubic-bezier(0.22, 1, 0.36, 1)",
        "brand-luxury": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      zIndex: {
        base: "0",
        raised: "10",
        sticky: "20",
        dropdown: "40",
        overlay: "100",
        modal: "200",
        toast: "300",
      },
      keyframes: {
        "scroll-cue": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "18%": { opacity: "1" },
          "82%": { opacity: "1" },
          "100%": { transform: "translateY(340%)", opacity: "0" },
        },
      },
      animation: {
        // slow, calm travel - never a snappy loop
        "scroll-cue": "scroll-cue 3.2s cubic-bezier(0.16, 1, 0.3, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
