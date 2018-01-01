const SimpleScaffold = require('simple-scaffold').default

new SimpleScaffold({
  templates: [ __dirname + '/../scaffold/component' ],
  output: __dirname + '/../src/components'
}).run()
