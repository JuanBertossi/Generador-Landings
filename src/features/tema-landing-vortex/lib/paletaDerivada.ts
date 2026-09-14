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
export function derivarPaletaVortex(apariencia: { colorFondo: string; colorTexto: string; colorAcento: string }): CSSProperties {
  const { colorFondo: bg, colorTexto: texto, colorAcento: acento } = apariencia

  return {
    '--v-bg': bg,
    '--v-text': texto,
    '--v-accent': acento,

    // Fondo de tarjetas (gradiente de 2 tonos usado en Problem/Process/Products/Services/Testimonials)
    '--v-card-1': `color-mix(in srgb, ${bg} 88%, white 12%)`,
    '--v-card-2': `color-mix(in srgb, ${bg} 94%, black 6%)`,
    // Panel anidado más claro (chip de agente en Products)
    '--v-card-3': `color-mix(in srgb, ${bg} 82%, white 18%)`,
    '--v-card-3-border': `color-mix(in srgb, ${bg} 75%, white 25%)`,
    // Fondo "hundido" (footer, overlays oscuros del header)
    '--v-bg-sunken': `color-mix(in srgb, ${bg} 92%, black 8%)`,
    // Tono claro del vidrio del header/nav (reemplaza el navy fijo rgba(15,62,87,*))
    '--v-glass': `color-mix(in srgb, ${bg} 55%, white 45%)`,
  } as CSSProperties
}
