// Webpack: import all JavaScript files except test files
const requireAll = require.context('./', true, /^(?!.*\.(spec|test)\.js$).*\.js$/)
requireAll.keys().forEach(requireAll)

import './scss/main.scss'
import { registerPostCommentModal, registerScrollToComments } from './components/comments.js'

document.addEventListener('DOMContentLoaded', () => {
  registerPostCommentModal()
  registerScrollToComments()
  
  // Anti-bfcache strategy - more aggressive approach
  window.addEventListener('beforeunload', () => {
    // Empty beforeunload handler prevents bfcache
  })
  
  // If bfcache still occurs, force complete refresh
  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      // bfcache detected - force page reload as last resort
      console.log('bfcache detected, forcing reload')
      window.location.reload()
    }
  })
})