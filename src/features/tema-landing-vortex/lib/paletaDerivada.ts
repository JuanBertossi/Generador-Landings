import type { CSSProperties } from 'react'

/**
 * Los componentes de Vortex tenían ~90 colores hardcodeados (fondos de
 * tarjetas, texto tenue en rgba(255,255,255,X), overlays de vidrio del
 * header) que ignoraban los 3 colores que elige el usuario. Esto deriva
 * toda esa escala a partir de --v-bg/--v-text/--v-accent con color-mix,
 * mismo mecanismo que ya usa Fleepix.
 *
 * El violeta secundario del banner/nav (rgba(153,102,255,*), #7c3aed,
 * #a855f7, #9966FF) queda fijo a propósito — así lo pidió el cliente
 * ("el violeta secundario queda fijo") — no se deriva acá.
 */
// El diseño original tiñe tarjetas y vidrio del header con un azul marino
// fijo (rgb(15,62,87), visto en header/index.tsx y benefits/index.tsx del
// proyecto de referencia) — no es gris neutro. Mezclar hacia white/black
// (como hacía la v1 de esta función) lava ese tinte y deja todo gris plano.
// Mezclamos hacia este navy fijo en vez de blanco/negro para conservarlo.
const NAVY_VIDRIO = 'rgb(15, 62, 87)'
// El chip anidado de "agentes" en Products usa un azul pizarra distinto
// (#161c25 / borde #1f2d3d en products/index.tsx), más gris que el navy de arriba.
const SLATE_CHIP = 'rgb(35, 52, 71)'

export function derivarPaletaVortex(apariencia: { colorFondo: string; colorTexto: string; colorAcento: string }): CSSProperties {
  const { colorFondo: bg, colorTexto: texto, colorAcento: acento } = apariencia

  return {
    '--v-bg': bg,
    '--v-text': texto,
    '--v-accent': acento,

    // Fondo de tarjetas (gradiente de 2 tonos usado en Problem/Process/Products/Services/Testimonials)
    '--v-card-1': `color-mix(in srgb, ${bg} 55%, ${NAVY_VIDRIO} 45%)`,
    '--v-card-2': `color-mix(in srgb, ${bg} 88%, ${NAVY_VIDRIO} 12%)`,
    // Panel anidado más claro (chip de agente en Products)
    '--v-card-3': `color-mix(in srgb, ${bg} 45%, ${SLATE_CHIP} 55%)`,
    '--v-card-3-border': `color-mix(in srgb, ${bg} 25%, ${SLATE_CHIP} 75%)`,
    // Fondo "hundido" (footer, overlays oscuros del header) — acá sí es gris/negro neutro en el original (rgba(6,6,6,*)).
    '--v-bg-sunken': `color-mix(in srgb, ${bg} 92%, black 8%)`,
    // Vidrio del header/nav — el navy fijo original, mezclado apenas con el fondo elegido.
    '--v-glass': `color-mix(in srgb, ${bg} 12%, ${NAVY_VIDRIO} 88%)`,
  } as CSSProperties
}
