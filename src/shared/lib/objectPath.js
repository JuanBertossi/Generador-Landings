export function setPath(obj, path, value) {
  const keys = path.split('.')
  const clone = structuredClone(obj)
  let cur = clone
  for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]]
  cur[keys[keys.length - 1]] = value
  return clone
}

export function getPath(obj, path) {
  return path.split('.').reduce((acc, k) => acc?.[k], obj)
}
