module.exports = {
  exclude: ['node_modules/@babel/**', /core-js*/],
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'entry',
      corejs: 3
    }]
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-transform-runtime', {
      useESModules: true,
      corejs: 3
    }]
  ]
}
