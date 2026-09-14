/**
 * Dominio final del producto. Cuando compres el dominio real, cambiá SOLO
 * esta constante — la usan los 3 formularios de creación para mostrar
 * "tu página va a quedar en slug.tudominio.com".
 */
export const DOMINIO_BASE = 'tugenerador.com'

export function urlPublicada(slug: string) {
  return `${slug}.${DOMINIO_BASE}`
}
