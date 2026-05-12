/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Ocean depth colors
        ocean: {
          surface: "hsl(var(--ocean-surface))",
          shallow: "hsl(var(--ocean-shallow))",
          mid: "hsl(var(--ocean-mid))",
          deep: "hsl(var(--ocean-deep))",
          abyss: "hsl(var(--ocean-abyss))",
        },
        // Bioluminescent colors
        bio: {
          glow: "hsl(var(--bio-glow))",
          cyan: "hsl(var(--bio-cyan))",
          teal: "hsl(var(--bio-teal))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        glow: "0 0 30px hsl(var(--primary) / 0.3), 0 0 60px hsl(var(--primary) / 0.2)",
        "glow-lg": "0 0 40px hsl(var(--bio-glow) / 0.4), 0 0 80px hsl(var(--bio-glow) / 0.3), 0 0 120px hsl(var(--bio-glow) / 0.2)",
        depth: "0 10px 40px -10px hsl(var(--ocean-abyss) / 0.5), 0 0 0 1px hsl(var(--ocean-surface) / 0.05)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-30px) rotate(2deg)" },
        },
        "drift": {
          "0%": { transform: "translateX(-100%) translateY(0)" },
          "100%": { transform: "translateX(100vw) translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5", boxShadow: "0 0 20px hsl(var(--bio-glow) / 0.3)" },
          "50%": { opacity: "1", boxShadow: "0 0 40px hsl(var(--bio-glow) / 0.6)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "bubble-rise": {
          "0%": { transform: "translateY(100%) scale(0.5)", opacity: "0" },
          "10%": { opacity: "0.8" },
          "90%": { opacity: "0.4" },
          "100%": { transform: "translateY(-100vh) scale(1.2)", opacity: "0" },
        },
        "swim": {
          "0%, 100%": { transform: "translateX(0) translateY(0) rotate(0deg)" },
          "25%": { transform: "translateX(10px) translateY(-5px) rotate(1deg)" },
          "50%": { transform: "translateX(0) translateY(-10px) rotate(0deg)" },
          "75%": { transform: "translateX(-10px) translateY(-5px) rotate(-1deg)" },
        },
        "glow-pulse": {
          "0%, 100%": { 
            filter: "brightness(1) drop-shadow(0 0 10px hsl(var(--bio-glow) / 0.5))"
          },
          "50%": { 
            filter: "brightness(1.2) drop-shadow(0 0 30px hsl(var(--bio-glow) / 0.8))"
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "drift": "drift 20s linear infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
        "bubble-rise": "bubble-rise 8s ease-in-out infinite",
        "swim": "swim 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
      },
      backgroundImage: {
        "ocean-gradient": "linear-gradient(180deg, hsl(var(--ocean-surface)) 0%, hsl(var(--ocean-shallow)) 25%, hsl(var(--ocean-mid)) 50%, hsl(var(--ocean-deep)) 75%, hsl(var(--ocean-abyss)) 100%)",
        "depth-gradient": "linear-gradient(180deg, hsl(var(--ocean-mid)) 0%, hsl(var(--ocean-deep)) 50%, hsl(var(--ocean-abyss)) 100%)",
        "glow-gradient": "linear-gradient(135deg, hsl(var(--bio-glow)) 0%, hsl(var(--bio-cyan)) 50%, hsl(var(--bio-teal)) 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
