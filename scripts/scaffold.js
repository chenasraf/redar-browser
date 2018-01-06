const SimpleScaffold = require('simple-scaffold').default
const path = require('path')
const args = process.argv.slice(2)

new SimpleScaffold({
  name: args[0],
  templates: [ path.join(__dirname, '/../scaffold/component/**/*') ],
  output: __dirname + '/../src/components'
}).run()
