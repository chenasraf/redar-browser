const sandboxProxies = new WeakMap()

export default function compileCode (src: string) {
  src = 'with (sandbox) {' + src + '}'
  const code = new Function('sandbox', src)

  return function (sandbox: any) {
    if (!sandboxProxies.has(sandbox)) {
      const sandboxProxy = new Proxy(sandbox, {has, get})
      sandboxProxies.set(sandbox, sandboxProxy)
    }
    return code(sandboxProxies.get(sandbox))
  }
}

export { compileCode }

function has (target: any, key: string) {
  return true
}

function get (target: any, key: string | symbol) {
  if (key === Symbol.unscopables) {
    return undefined
  }
  return target[key]
}
