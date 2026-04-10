import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          deep: '#0A1324',
          ink: '#0F172A',
          teal: '#0EA5A4',
          tealDark: '#0C8C86',
          gold: '#E0B35A',
          desert: '#C89A5B',
          sand: '#F6F1E4',
          dune: '#E9E0CD',
          cloud: '#E7EEF7',
        },
      },
      boxShadow: {
        card: '0 20px 60px -30px rgba(12, 22, 41, 0.45), 0 10px 30px -15px rgba(12, 22, 41, 0.25)',
        glow: '0 20px 80px -40px rgba(14, 165, 164, 0.6)',
      },
      borderRadius: {
        xl: '18px',
        '2xl': '22px',
      },
      backgroundImage: {
        'desert-radial': 'radial-gradient(circle at 20% 20%, rgba(224, 179, 90, 0.25), transparent 30%), radial-gradient(circle at 80% 10%, rgba(14, 165, 164, 0.22), transparent 28%), radial-gradient(circle at 50% 80%, rgba(15, 23, 42, 0.18), transparent 38%)',
        'card-glow': 'radial-gradient(circle at 20% 20%, rgba(14, 165, 164, 0.14), transparent 32%)',
      },
    },
  },
  plugins: [],
} satisfies Config
