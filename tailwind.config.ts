import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['var(--font-outfit)', 'sans-serif'],
        'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
        jetbrains: ['var(--font-jetbrains)', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
