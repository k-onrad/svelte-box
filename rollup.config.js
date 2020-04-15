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

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'static/bundle.js'
  },
  plugins: [
    svelte({
      dev,
      emitCss: true,
      preprocess: autoPreprocess()
    }),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),
    postcss({
      extract: 'static/bundle.css',
      sourceMap: true,
      minify: !dev,
      plugins: [require('postcss-preset-env')()]
    }),
    legacy && babel({
      extensions: ['.js', '.mjs', '.html', '.svelte'],
      runtimeHelpers: true,
      exclude: ['node_modules'],
      presets: ['babel/preset-env'],
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-object-rest-spread',
        ['@babel/plugin-transform-runtime', {
          useESModules: true
        }]
      ]
    }),

    /* DEV */
    // Call `npm run start` once the bundle has been generated
    dev && serve(),
    // Watch `static` directory, refresh browser on changes
    dev && livereload('static'),

    /* PROD */
    // minify
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
