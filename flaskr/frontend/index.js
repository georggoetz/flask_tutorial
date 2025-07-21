// Webpack: import all JavaScript files except test files
const requireAll = require.context('./', true, /^(?!.*\.(spec|test)\.js$).*\.js$/)
requireAll.keys().forEach(requireAll)

import './scss/main.scss'
import { registerPostCommentModal, registerScrollToComments } from './components/comments.js'

document.addEventListener('DOMContentLoaded', () => {
  registerPostCommentModal()
  registerScrollToComments()
  
  // Force the page to reload when hitting the back or forward button. Otherwise, interactive elements will not perform
  // fetch requests but retrieve results from the cache.
  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      window.location.reload()
    }
  })
})

