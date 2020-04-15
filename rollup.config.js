import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'

const mode = process.env.NODE_ENV
const dev = mode === 'development'
const legacy = !!process.env.LEGACY_BUILD

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/bundle.js'
  },

  plugins: [

    svelte({
      dev,
      emitCss: true
    }),

    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),

    postcss({
      plugins: []
    }),

    legacy && babel({
      extensions: ['.js', '.mjs', '.html', '.svelte'],
      runtimeHelpers: true,
      exclude: ['node_modules/@babel/**'],
      presets: [
        ['@babel/preset-env', {
          targets: '> 0.25%, not dead'
        }]
      ],
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        ['@babel/plugin-transform-runtime', {
          useESModules: true
        }]
      ]
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    dev && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    dev && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    !dev && terser({
      module: true
    })
  ],
  watch: {
    clearScreen: false
  }
}

function serve () {
  let started = false

  return {
    writeBundle () {
      if (!started) {
        started = true

        require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true
        })
      }
    }
  }
}
