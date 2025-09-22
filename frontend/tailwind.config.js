/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyberpunk: {
          primary: '#00ff88',
          secondary: '#ff0080',
          accent: '#00d4ff',
          dark: '#0a0a0a',
          darker: '#050505',
          gray: '#1a1a1a',
          lightgray: '#2a2a2a',
        },
        neon: {
          green: '#00ff88',
          pink: '#ff0080',
          blue: '#00d4ff',
          purple: '#8b5cf6',
          yellow: '#fbbf24',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00ff88, 0 0 10px #00ff88, 0 0 15px #00ff88' },
          '100%': { boxShadow: '0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88' },
        }
      },
      backgroundImage: {
        'cyberpunk-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        'neon-gradient': 'linear-gradient(45deg, #00ff88, #00d4ff, #ff0080)',
      }
    },
  },
  plugins: [],
}
