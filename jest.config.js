module.exports = {
  testMatch: ['**/*.(test|spec).js'],
  transform: {
    '^.+\\.js$': '<rootDir>/jest.transform.js',
    '^.+\\.svelte$': 'jest-transform-svelte'
  },
  moduleFileExtensions: ['js', 'svelte'],
  bail: false,
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js'
  ]
}
