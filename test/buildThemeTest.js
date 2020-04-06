var {buildTheme} = require('../buildTheme')

let components = [
  'nav/standard',
  'header/standard',
]

buildTheme("newTheme", "index", components, true, true, false)