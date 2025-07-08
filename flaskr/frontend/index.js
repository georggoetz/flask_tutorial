// Webpack: import all JavaScript files except test files
const requireAll = require.context('./', true, /^(?!.*\.(spec|test)\.js$).*\.js$/)
requireAll.keys().forEach(requireAll)

// Import global styles
import './scss/main.scss'
