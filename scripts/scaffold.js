const SimpleScaffold = require('simple-scaffold').default
const path = require('path')

new SimpleScaffold({
  templates: [ path.join(__dirname, '/../scaffold/component/**/*') ],
  output: __dirname + '/../src/components'
}).run()
