const requireAll = require.context('./', true, /^(?!.*\.spec\.js$).*\.js$/)
requireAll.keys().forEach(requireAll)

import './style.css'
