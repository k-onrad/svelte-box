const dev = !!process.env.ROLLUP_WATCH
const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    require('postcss-preset-env')(),
    require('tailwindcss')('./tailwind.config.js'),
    !dev && purgecss({
      content: ['./**/*.html', './**/*.svelte'],
      defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
    })
  ]
}
