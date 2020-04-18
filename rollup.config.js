import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import babel from 'rollup-plugin-babel'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'

const dev = !!process.env.ROLLUP_WATCH
const legacy = !!process.env.LEGACY_BUILD

const plugins = [
  svelte({
    dev,
    emitCss: true,
    ...require('./svelte.config.js')
  }),
  resolve({
    browser: true,
    dedupe: ['svelte', 'svelte-spa-router']
  }),
  commonjs(),
  postcss({
    extract: 'static/bundle.css',
    sourceMap: true,
    minify: !dev,
    ...require('./postss.config.js')
  }),
  legacy && babel({
    extensions: ['.js', '.mjs', '.html', '.svelte'],
    exclude: ['node_modules/@babel/**', /\/core-js\//],
    runtimeHelpers: true,
    ...require('./babel.config.js')
  })
]

if (dev) {
  // Call `npm run start` once the bundle has been generated,
  // Then watch `static` directory, refresh browser on changes
  plugins.push(
    dev && serve(),
    dev && livereload('static')
  )
} else {
  // minify if not dev mode
  plugins.push(!dev && terser({ module: true }))
}

function serve () {
  let started = false
  const writeBundle = () => {
    if (!started) {
      started = true

      require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      })
    }
  }
  return writeBundle()
}

module.exports = {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'static/bundle.js'
  },
  plugins,
  watch: {
    clearScreen: false
  }
}
