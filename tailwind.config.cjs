/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        bg: {
          light: 'rgb(var(--color-bg-light) / <alpha-value>)',
          dark: 'rgb(var(--color-bg-dark) / <alpha-value>)',
        },
        text: {
          light: 'rgb(var(--color-text-light) / <alpha-value>)',
          dark: 'rgb(var(--color-text-dark) / <alpha-value>)',
        }
      },
    },
  },
  plugins: [],
}
