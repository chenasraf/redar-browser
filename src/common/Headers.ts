import * as Immutable from 'immutable'

export type Headers = Immutable.List<[string, string]>

export function stringHeaders(headers: Headers) {
  return headers.entrySeq()
    .map((header) => {
      if (!header) {
        return
      }
      let [ name, value ] = header[1]
      name = name.split('-').map(s => capitalize(s)).join('-')
      return name ?
        `${name}: ${value}`
      : undefined
    })
    .filter(s => Boolean(s))
    .join('\n')
}

export function headerListToObject(headers: Headers) {
  const headerObj = {}
  headers.toJS().forEach((header) => {
    let [ name, value ] = header
    name = name.split('-').map(s => capitalize(s)).join('-').trim()
    if (name.length) {  
      headerObj[name] = value
    }
  })
  return headerObj
}

export function parseHeaderList(headers: string) {
  let headerMap = Immutable.List<[string, string]>()

  headers.split('\n').forEach((header, idx) => {
    const [ name, value ] = header.split(':').map(s => s.trim())
    const finalName = name.split('-')
      .map(s => capitalize(s))
      .join('-')

    if (finalName) {
      headerMap = headerMap.set(idx, [finalName, value || ''])
    }
  })

  return headerMap
}

export function capitalize(str: string) {
  return !str ? '' : str[0].toUpperCase() + str.slice(1).toLowerCase()
}
