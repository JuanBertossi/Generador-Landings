export function slugify(texto) {
  const sinTildes = (texto || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  return sinTildes.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'sin-nombre'
}
