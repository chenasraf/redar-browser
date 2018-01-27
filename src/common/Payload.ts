export const typeMap = {
  JSON: JSON.parse,
  Form: String
}

export type TypeMap = 'JSON' | 'Form'

export function parsePayload(payload: string, type: keyof TypeMap) {
  try {
    payload = JSON.parse(payload)
    if (!type
        || !typeMap.hasOwnProperty(type)
        || !payload.length) {
      return undefined
    }
    return typeMap[type](payload)
  } catch (e) {
    return undefined
  }
}
