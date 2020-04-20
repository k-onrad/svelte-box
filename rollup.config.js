import svelte from 'rollup-plugin-svelte'
import autoPreprocess from 'svelte-preprocess'
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
    preprocess: autoPreprocess({
      postcss: true
    })
  }),
  resolve({
    browser: true,
    dedupe: ['svelte', 'svelte-spa-router']
  }),
  commonjs(),
  postcss({
    extract: 'bundle.css',
    minimize: !dev,
    sourceMap: true
  }),
  legacy && babel({
    extensions: ['.js', '.mjs', '.html', '.svelte'],
    exclude: ['node_modules/@babel/**', /\/core-js\//],
    runtimeHelpers: true,
    ...require('./babel.config.js')
  })
]

if (dev) {
  plugins.push(dev && livereload('static'))
} else {
  plugins.push(!dev && terser({ module: true }))
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
