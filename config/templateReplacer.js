const packageContents = require('../package.json');

function TemplateReplacer(content) {
  const exp = /\<%=\s*([a-z\.]+)\s*\%>/ig
  content = content.toString()

  content = content.replace(exp, (match, $1) => {
    const path = $1.split('.')
    switch (path[0]) {
      case 'package':
      return path.slice(1).reduce((accu, cur, _i, _arr) => {
        console.log('returning', cur, 'for', content)
        return accu[cur]
      }, packageContents)
      break;
      default:
      throw new Error(`Can't find mapping for \`${$1}\``)
    }
  })

  return content.toString()
}

module.exports = TemplateReplacer
