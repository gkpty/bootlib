var {buildTheme} = require('../buildTheme')

let components = [
  'nav/standard',
  'headers/standard',
  'section/split',
  'section/standard',
  'footer/standard'
]

buildTheme("newTheme", "index", components, true, true, false)