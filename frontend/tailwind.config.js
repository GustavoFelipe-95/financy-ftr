import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			/* Semantic (CSS variables) */
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			card: {
  				DEFAULT: 'var(--card)',
  				foreground: 'var(--card-foreground)'
  			},
  			popover: {
  				DEFAULT: 'var(--popover)',
  				foreground: 'var(--popover-foreground)'
  			},
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: 'var(--primary-foreground)'
  			},
  			secondary: {
  				DEFAULT: 'var(--secondary)',
  				foreground: 'var(--secondary-foreground)'
  			},
  			muted: {
  				DEFAULT: 'var(--muted)',
  				foreground: 'var(--muted-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'var(--accent-foreground)'
  			},
  			destructive: {
  				DEFAULT: 'var(--destructive)',
  				foreground: 'var(--destructive-foreground)'
  			},
  			border: 'var(--border)',
  			input: 'var(--input)',
  			ring: 'var(--ring)',
  			chart: {
  				'1': 'var(--chart-1)',
  				'2': 'var(--chart-2)',
  				'3': 'var(--chart-3)',
  				'4': 'var(--chart-4)',
  				'5': 'var(--chart-5)'
  			},
  			/* Palette: Brand */
  			brand: {
  				dark: '#124b2b',
  				base: '#1f6f43'
  			},
  			/* Palette: Grayscale */
  			gray: {
  				100: '#f8f9fa',
  				200: '#e5e7eb',
  				300: '#d1d5db',
  				400: '#9ca3af',
  				500: '#6b7280',
  				600: '#4b5563',
  				700: '#374151',
  				800: '#111827'
  			},
  			/* Palette: Neutral */
  			neutral: {
  				black: '#000000',
  				white: '#ffffff'
  			},
  			/* Palette: Feedback */
  			danger: '#ef4444',
  			success: '#19ad70',
  			/* Palette: Colors (dark / base / light) */
  			blue: {
  				dark: '#1d4ed8',
  				base: '#2563eb',
  				light: '#dbeafe'
  			},
  			purple: {
  				dark: '#7e22ce',
  				base: '#9333ea',
  				light: '#f3e8ff'
  			},
  			pink: {
  				dark: '#be185d',
  				base: '#db2777',
  				light: '#fce7f3'
  			},
  			red: {
  				dark: '#b91c1c',
  				base: '#dc2626',
  				light: '#fee2e2'
  			},
  			orange: {
  				dark: '#c2410c',
  				base: '#ea580c',
  				light: '#ffedd5'
  			},
  			yellow: {
  				dark: '#a16207',
  				base: '#ca8a04',
  				light: '#f7f3ca'
  			},
  			green: {
  				dark: '#15803d',
  				base: '#16a34a',
  				light: '#e0fae9'
  			}
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
}
