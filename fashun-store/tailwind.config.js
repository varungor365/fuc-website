/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', 'class'],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'50': '#F8F8F8',
  				'100': '#E8E8E8',
  				'200': '#D4D4D4',
  				'300': '#A3A3A3',
  				'400': '#737373',
  				'500': '#525252',
  				'600': '#404040',
  				'700': '#262626',
  				'800': '#171717',
  				'900': '#0F0F10',
  				'950': '#080808',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			accent: {
  				'50': '#FEFCE8',
  				'100': '#FEF9C3',
  				'200': '#FEF08A',
  				'300': '#FDE047',
  				'400': '#FACC15',
  				'500': '#E4C590',
  				'600': '#CA8A04',
  				'700': '#A16207',
  				'800': '#854D0E',
  				'900': '#713F12',
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			highlight: {
  				'50': '#FDF2F8',
  				'100': '#FCE7F3',
  				'200': '#FBCFE8',
  				'300': '#F9A8D4',
  				'400': '#F472B6',
  				'500': '#C96C8B',
  				'600': '#DB2777',
  				'700': '#BE185D',
  				'800': '#9D174D',
  				'900': '#831843'
  			},
  			success: '#10B981',
  			warning: '#F59E0B',
  			error: '#EF4444',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			],
  			display: [
  				'Montserrat',
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'JetBrains Mono',
  				'monospace'
  			]
  		},
  		fontSize: {
  			xs: [
  				'0.75rem',
  				{
  					lineHeight: '1rem'
  				}
  			],
  			sm: [
  				'0.875rem',
  				{
  					lineHeight: '1.25rem'
  				}
  			],
  			base: [
  				'1rem',
  				{
  					lineHeight: '1.5rem'
  				}
  			],
  			lg: [
  				'1.125rem',
  				{
  					lineHeight: '1.75rem'
  				}
  			],
  			xl: [
  				'1.25rem',
  				{
  					lineHeight: '1.75rem'
  				}
  			],
  			'2xl': [
  				'1.5rem',
  				{
  					lineHeight: '2rem'
  				}
  			],
  			'3xl': [
  				'1.875rem',
  				{
  					lineHeight: '2.25rem'
  				}
  			],
  			'4xl': [
  				'2.25rem',
  				{
  					lineHeight: '2.5rem'
  				}
  			],
  			'5xl': [
  				'3rem',
  				{
  					lineHeight: '1'
  				}
  			],
  			'6xl': [
  				'3.75rem',
  				{
  					lineHeight: '1'
  				}
  			],
  			'7xl': [
  				'4.5rem',
  				{
  					lineHeight: '1'
  				}
  			],
  			'8xl': [
  				'6rem',
  				{
  					lineHeight: '1'
  				}
  			],
  			'9xl': [
  				'8rem',
  				{
  					lineHeight: '1'
  				}
  			]
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.5s ease-in-out',
  			'slide-up': 'slideUp 0.3s ease-out',
  			'slide-down': 'slideDown 0.3s ease-out',
  			'scale-in': 'scaleIn 0.2s ease-out',
  			float: 'float 6s ease-in-out infinite',
  			'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			shimmer: 'shimmer 2s linear infinite',
  			glow: 'glow 2s ease-in-out infinite alternate',
  			levitate: 'levitate 4s ease-in-out infinite',
  			'rotate-slow': 'rotateSlow 20s linear infinite',
  			aurora: 'aurora 15s ease-in-out infinite',
  			hologram: 'hologram 3s ease-in-out infinite',
  			'neon-pulse': 'neonPulse 2s ease-in-out infinite',
  			morpheus: 'morpheus 8s ease-in-out infinite',
  			'crystal-shine': 'crystalShine 3s ease-in-out infinite',
  			'liquid-flow': 'liquidFlow 6s ease-in-out infinite',
  			'particle-float': 'particleFloat 10s linear infinite'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			slideUp: {
  				'0%': {
  					transform: 'translateY(10px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			slideDown: {
  				'0%': {
  					transform: 'translateY(-10px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			scaleIn: {
  				'0%': {
  					transform: 'scale(0.95)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0px)'
  				},
  				'50%': {
  					transform: 'translateY(-20px)'
  				}
  			},
  			shimmer: {
  				'0%': {
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					transform: 'translateX(100%)'
  				}
  			},
  			glow: {
  				'0%': {
  					boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
  				},
  				'100%': {
  					boxShadow: '0 0 40px rgba(139, 92, 246, 0.8)'
  				}
  			},
  			levitate: {
  				'0%, 100%': {
  					transform: 'translateY(0px) rotateX(0deg)'
  				},
  				'50%': {
  					transform: 'translateY(-30px) rotateX(5deg)'
  				}
  			},
  			rotateSlow: {
  				'0%': {
  					transform: 'rotate(0deg)'
  				},
  				'100%': {
  					transform: 'rotate(360deg)'
  				}
  			},
  			aurora: {
  				'0%, 100%': {
  					filter: 'hue-rotate(0deg) brightness(1.2)'
  				},
  				'25%': {
  					filter: 'hue-rotate(90deg) brightness(1.5)'
  				},
  				'50%': {
  					filter: 'hue-rotate(180deg) brightness(1.8)'
  				},
  				'75%': {
  					filter: 'hue-rotate(270deg) brightness(1.5)'
  				}
  			},
  			hologram: {
  				'0%, 100%': {
  					opacity: '1',
  					transform: 'translateZ(0)'
  				},
  				'50%': {
  					opacity: '0.7',
  					transform: 'translateZ(10px)'
  				}
  			},
  			neonPulse: {
  				'0%, 100%': {
  					textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor'
  				},
  				'50%': {
  					textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor'
  				}
  			},
  			morpheus: {
  				'0%, 100%': {
  					borderRadius: '20px',
  					transform: 'rotate(0deg)'
  				},
  				'25%': {
  					borderRadius: '50px',
  					transform: 'rotate(5deg)'
  				},
  				'50%': {
  					borderRadius: '30px',
  					transform: 'rotate(-5deg)'
  				},
  				'75%': {
  					borderRadius: '40px',
  					transform: 'rotate(3deg)'
  				}
  			},
  			crystalShine: {
  				'0%, 100%': {
  					background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
  					transform: 'translateX(-100%)'
  				},
  				'50%': {
  					transform: 'translateX(100%)'
  				}
  			},
  			liquidFlow: {
  				'0%, 100%': {
  					clipPath: 'polygon(0% 45%, 15% 44%, 32% 50%, 54% 60%, 70% 61%, 84% 59%, 100% 52%, 100% 100%, 0% 100%)'
  				},
  				'50%': {
  					clipPath: 'polygon(0% 60%, 16% 65%, 34% 66%, 51% 62%, 67% 50%, 84% 45%, 100% 46%, 100% 100%, 0% 100%)'
  				}
  			},
  			particleFloat: {
  				'0%, 100%': {
  					transform: 'translateY(0px) translateX(0px) rotate(0deg)'
  				},
  				'33%': {
  					transform: 'translateY(-30px) translateX(20px) rotate(120deg)'
  				},
  				'66%': {
  					transform: 'translateY(-60px) translateX(-20px) rotate(240deg)'
  				}
  			}
  		},
  		backdropBlur: {
  			xs: '2px'
  		},
  		screens: {
  			xs: '475px',
  			'3xl': '1600px'
  		},
  		spacing: {
  			'18': '4.5rem',
  			'88': '22rem',
  			'128': '32rem'
  		},
  		borderRadius: {
  			'4xl': '2rem',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		aspectRatio: {
  			'4/5': '4 / 5',
  			'3/4': '3 / 4',
  			'9/16': '9 / 16'
  		},
  		perspective: {
  			'1000': '1000px',
  			'1500': '1500px',
  			'2000': '2000px'
  		},
  		transformStyle: {
  			'preserve-3d': 'preserve-3d'
  		},
  		boxShadow: {
  			'neon-purple': '0 0 20px rgba(139, 92, 246, 0.6)',
  			'neon-blue': '0 0 20px rgba(59, 130, 246, 0.6)',
  			'neon-pink': '0 0 20px rgba(236, 72, 153, 0.6)',
  			glass: '0 8px 32px rgba(31, 38, 135, 0.37)',
  			holographic: '0 25px 50px -12px rgba(139, 92, 246, 0.4)',
  			aurora: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)'
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
  			holographic: 'linear-gradient(45deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 25%, rgba(34, 211, 238, 0.1) 50%, rgba(236, 72, 153, 0.1) 75%, rgba(139, 92, 246, 0.1) 100%)',
  			'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%)'
  		}
  	}
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
      require("tailwindcss-animate")
],
};
