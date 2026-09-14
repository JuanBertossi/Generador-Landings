export const PRECIOS = {
  invitacion: 19900,
  'landing-fleepix': 179000,
  'landing-vortex': 229000,
} as const

export function formatoPrecio(valor: number) {
  return `$${valor.toLocaleString('es-AR')}`
}
