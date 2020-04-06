var {buildTheme} = require('../buildTheme')

let components = [
  'nav/standard',
  'header/standard',
  'static_section/split',
  'static_section/standard',
  'footer/standard'
]

buildTheme("newTheme", "index", components, true, true, false)