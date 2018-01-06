const path = require('path')

function TemplateReplacer(content, localsPath) {
  const locals = require(localsPath)
  const exp = /\<%=\s*([a-z\.]+)\s*\%>/ig
  content = content.toString()

  content = content.replace(exp, (match, $1) => {
    const path = $1.split('.')
    return path.slice(1).reduce((accu, cur, _i, _arr) => {
      return accu[cur]
    }, locals)
  })

  return content.toString()
}

module.exports = TemplateReplacer
