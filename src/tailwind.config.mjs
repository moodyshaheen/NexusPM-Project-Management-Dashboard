/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1.25', letterSpacing: '0.02em', fontWeight: '400' }],
                sm: ['0.875rem', { lineHeight: '1.3', letterSpacing: '0.02em', fontWeight: '400' }],
                base: ['1rem', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '400' }],
                lg: ['1.125rem', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' }],
                xl: ['1.25rem', { lineHeight: '1.3', letterSpacing: '0.02em', fontWeight: '500' }],
                '2xl': ['1.5rem', { lineHeight: '1.2', letterSpacing: '0.01em', fontWeight: '600' }],
                '3xl': ['1.875rem', { lineHeight: '1.15', letterSpacing: '0.01em', fontWeight: '600' }],
                '4xl': ['2.25rem', { lineHeight: '1.1', letterSpacing: '0.005em', fontWeight: '700' }],
                '5xl': ['3rem', { lineHeight: '1.05', letterSpacing: '0.005em', fontWeight: '700' }],
                '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '0.002em', fontWeight: '800' }],
                '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '0.001em', fontWeight: '800' }],
                '8xl': ['6rem', { lineHeight: '1', letterSpacing: '0', fontWeight: '900' }],
                '9xl': ['8rem', { lineHeight: '1', letterSpacing: '0', fontWeight: '900' }],
            },
            fontFamily: {
                heading: "syne",
                paragraph: "azeret-mono"
            },
            colors: {
                'deep-space-blue': '#16213E',
                charcoal: '#24243E',
                'electric-teal': '#00FFFF',
                'electric-magenta': '#FF00FF',
                destructive: '#FF4136',
                'destructive-foreground': '#FFFFFF',
                background: '#1A1A2E',
                secondary: '#FF00FF',
                foreground: '#E0E0E0',
                'secondary-foreground': '#FFFFFF',
                'primary-foreground': '#000000',
                primary: '#00FFFF'
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/typography')],
}
