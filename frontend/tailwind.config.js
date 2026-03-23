/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:            '#EEF1F9',
          primarybg:     '#EEF1F9',
          card:          '#FFFFFF',
          secondarybg:   '#FFFFFF',
          surface:       '#F6F7FD',
          border:        '#D8DCF0',
          primary:       '#7D53F6',
          'primary-light': '#9F74F7',
          primarydull:   '#9F74F7',
          sidebar:       '#5F6388',
          green:         '#008000',
          pending:       '#F0B041',
          red:           '#DC2626',
          text:          '#000000',
          primarytext:   '#000000',
          muted:         '#5F6388',
          secondarytext: '#5F6388',
          scroll:        '#D1D1D1',
          'scroll-hover': '#9CA3AF',
          scrollHover:   '#9CA3AF',
          skyblue:       '#0388FC',
          gold:          '#F0B041',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Segoe UI', 'sans-serif'],
        sans:    ['var(--font-sans)', 'Segoe UI', 'sans-serif'],
        mono:    ['var(--font-mono)', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card':       '0 12px 32px rgba(125, 83, 246, 0.10)',
        'card-hover': '0 18px 48px rgba(125, 83, 246, 0.14)',
        'brand':      '0 14px 36px rgba(125, 83, 246, 0.28)',
      },
      animation: {
        'fade-in':  'fadeIn 0.4s ease',
        'slide-up': 'slideUp 0.35s ease',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
