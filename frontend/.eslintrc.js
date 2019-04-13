module.exports = {
  parser: 'babel-eslint',
  env: {
    'browser': true,
    'node': true,
    'es6': true,
    'jest': true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jest/recommended'
  ],
  plugins: [
    'react',
    'jest'
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.json']
      }
    }
  },
  globals: {
    DOMAIN_ADDRESS: false,
    FRONTEND_ADDRESS: false
  },
  rules: {
    'no-confusing-arrow': 'off',
    'react/prop-types': 'off',
    'no-unused-vars': 'warn',
    'no-console': 'warn'
  }
}