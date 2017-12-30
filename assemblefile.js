'use strict';

var assemble = require('assemble');
var app = assemble();

app.task('default', function() {
  app.engine('any', (str, locals, cb) => {
    console.info('DEBUG:', locals)

    const upperName = 'CompName'
    str = str.split('{{Name}}').join(upperName).split('{{name}}').join(upperName)

    console.log(locals.helpers.partial)
    cb(null, str)
  })

  return app.src('scaffolds/component/**/*')
    .pipe(app.renderFile('any'))
    .pipe(app.dest('src/components/CompName'))
});

module.exports = app;
