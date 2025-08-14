// Webpack: import all JavaScript files except test files
const requireAll = require.context('./', true, /^(?!.*\.(spec|test)\.js$).*\.js$/)
requireAll.keys().forEach(requireAll)

import './scss/main.scss'
import { registerPostCommentModal, registerScrollToCommentsSection } from './components/comments-counter.js'

document.addEventListener('DOMContentLoaded', () => {
  registerPostCommentModal()
  registerScrollToCommentsSection()
})

// Handle browser back/forward cache (bfcache)
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Page was restored from cache, refresh dynamic content
    window.dispatchEvent(new CustomEvent('refresh-dynamic-content'))
  }
})