export function getPath(obj, path) {
  return path.split('.').reduce((acc, k) => acc?.[k], obj)
}
