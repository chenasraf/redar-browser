const Scaffold = require('scaffold')

const scaffold = new Scaffold({
  component: {
    cwd: 'scaffold',
    src: ['component/**/*'],
    dest: 'src/components/'
  }  
})

console.info(scaffold)
console.info(scaffold.targets.component.files)
