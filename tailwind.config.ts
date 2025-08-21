import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{mdx}',
  ],
  // Force light mode only
  darkMode: 'media', // This will be disabled by our CSS color-scheme override
  theme: {
    extend: {
      colors: {
        // Logo-inspired color palette
        coral: {
          50: 'rgb(from var(--coral-50) r g b / <alpha-value>)',
          100: 'rgb(from var(--coral-100) r g b / <alpha-value>)',
          200: 'rgb(from var(--coral-200) r g b / <alpha-value>)',
          300: 'rgb(from var(--coral-300) r g b / <alpha-value>)',
          400: 'rgb(from var(--coral-400) r g b / <alpha-value>)',
          500: 'rgb(from var(--coral-500) r g b / <alpha-value>)',
          600: 'rgb(from var(--coral-600) r g b / <alpha-value>)',
          700: 'rgb(from var(--coral-700) r g b / <alpha-value>)',
          800: 'rgb(from var(--coral-800) r g b / <alpha-value>)',
          900: 'rgb(from var(--coral-900) r g b / <alpha-value>)',
        },
        lavender: {
          50: 'rgb(from var(--lavender-50) r g b / <alpha-value>)',
          100: 'rgb(from var(--lavender-100) r g b / <alpha-value>)',
          200: 'rgb(from var(--lavender-200) r g b / <alpha-value>)',
          300: 'rgb(from var(--lavender-300) r g b / <alpha-value>)',
          400: 'rgb(from var(--lavender-400) r g b / <alpha-value>)',
          500: 'rgb(from var(--lavender-500) r g b / <alpha-value>)',
          600: 'rgb(from var(--lavender-600) r g b / <alpha-value>)',
          700: 'rgb(from var(--lavender-700) r g b / <alpha-value>)',
          800: 'rgb(from var(--lavender-800) r g b / <alpha-value>)',
          900: 'rgb(from var(--lavender-900) r g b / <alpha-value>)',
        },
        sage: {
          50: 'rgb(from var(--sage-50) r g b / <alpha-value>)',
          100: 'rgb(from var(--sage-100) r g b / <alpha-value>)',
          200: 'rgb(from var(--sage-200) r g b / <alpha-value>)',
          300: 'rgb(from var(--sage-300) r g b / <alpha-value>)',
          400: 'rgb(from var(--sage-400) r g b / <alpha-value>)',
          500: 'rgb(from var(--sage-500) r g b / <alpha-value>)',
          600: 'rgb(from var(--sage-600) r g b / <alpha-value>)',
          700: 'rgb(from var(--sage-700) r g b / <alpha-value>)',
          800: 'rgb(from var(--sage-800) r g b / <alpha-value>)',
          900: 'rgb(from var(--sage-900) r g b / <alpha-value>)',
        },
        cream: {
          50: 'rgb(from var(--cream-50) r g b / <alpha-value>)',
          100: 'rgb(from var(--cream-100) r g b / <alpha-value>)',
          200: 'rgb(from var(--cream-200) r g b / <alpha-value>)',
          300: 'rgb(from var(--cream-300) r g b / <alpha-value>)',
          400: 'rgb(from var(--cream-400) r g b / <alpha-value>)',
          500: 'rgb(from var(--cream-500) r g b / <alpha-value>)',
          600: 'rgb(from var(--cream-600) r g b / <alpha-value>)',
          700: 'rgb(from var(--cream-700) r g b / <alpha-value>)',
          800: 'rgb(from var(--cream-800) r g b / <alpha-value>)',
          900: 'rgb(from var(--cream-900) r g b / <alpha-value>)',
        },
        // Brand shortcuts
        brand: 'rgb(from var(--primary) r g b / <alpha-value>)', // coral-500
        primary: 'rgb(from var(--primary) r g b / <alpha-value>)',
        secondary: 'rgb(from var(--secondary) r g b / <alpha-value>)',
        accent: 'rgb(from var(--accent) r g b / <alpha-value>)',
        // Semantic Colors
        ink: 'rgb(from var(--ink) r g b / <alpha-value>)',
        'ink-light': 'rgb(from var(--ink-light) r g b / <alpha-value>)',
        paper: 'rgb(from var(--paper) r g b / <alpha-value>)',
        sepia: 'rgb(from var(--sepia) r g b / <alpha-value>)',
        'sepia-dark': 'rgb(from var(--sepia-dark) r g b / <alpha-value>)',
        border: 'rgb(from var(--border) r g b / <alpha-value>)',
        'border-focus': 'rgb(from var(--border-focus) r g b / <alpha-value>)',
        // Status Colors
        success: 'rgb(from var(--success) r g b / <alpha-value>)',
        warning: 'rgb(from var(--warning) r g b / <alpha-value>)',
        error: 'rgb(from var(--error) r g b / <alpha-value>)',
        info: 'rgb(from var(--info) r g b / <alpha-value>)',
      },
      fontFamily: {
        ui: ['var(--font-ui)', 'system-ui', '-apple-system', 'sans-serif'],
        reading: ['var(--font-reading)', 'Georgia', 'Times New Roman', 'serif'],
      },
      fontSize: {
        xs: 'var(--text-xs)',
        sm: 'var(--text-sm)',
        base: 'var(--text-base)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
      },
      spacing: {
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '12': 'var(--space-12)',
        '16': 'var(--space-16)',
      },
      maxWidth: {
        reading: 'var(--reading-width)',
      },
      lineHeight: {
        reading: 'var(--reading-line-height)',
        ui: 'var(--ui-line-height)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(232, 114, 94, 0.3)',
        'glow-lg': '0 0 40px rgba(232, 114, 94, 0.4)',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};

export default config;
