import type { CSSProperties } from 'react'

/** Negro o blanco según qué de los dos contrasta mejor con el color de fondo dado. */
function colorDeContraste(hex: string): string {
  const limpio = hex.replace('#', '')
  const r = parseInt(limpio.substring(0, 2), 16) || 0
  const g = parseInt(limpio.substring(2, 4), 16) || 0
  const b = parseInt(limpio.substring(4, 6), 16) || 0
  const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminancia > 0.6 ? '#001117' : '#ffffff'
}

/**
 * La plantilla de Fleepix no usa un solo par fondo/texto/acento en todos
 * lados — tiene escalas propias (verde-*, azul-*, navy-*, neutro-*) que
 * varias secciones (ParaQuien, Beneficios, FAQ...) referencian DIRECTO, sin
 * pasar por --bg/--text/--accent. Si solo pisás esas 3 variables, esas
 * secciones quedan con los colores originales de Fleepix pase lo que pase.
 *
 * Esto deriva TODA la escala a partir de los 3 colores que elige el usuario,
 * con color-mix (mismo mecanismo que ya usa el propio CSS de la plantilla).
 */
export function derivarPaleta(apariencia: { colorFondo: string; colorTexto: string; colorAcento: string }): CSSProperties {
  const { colorFondo: bg, colorTexto: texto, colorAcento: acento } = apariencia

  return {
    '--bg': bg,
    '--bg-elev': `color-mix(in srgb, ${bg} 40%, white 60%)`,
    '--neutro-200': bg,
    '--neutro-100': `color-mix(in srgb, ${bg} 50%, white 50%)`,
    '--neutro-300': `color-mix(in srgb, ${bg} 70%, ${texto} 30%)`,
    '--border': `color-mix(in srgb, ${bg} 70%, ${texto} 30%)`,

    '--text': texto,
    '--text-soft': `color-mix(in srgb, ${texto} 70%, white)`,
    '--text-faint': `color-mix(in srgb, ${texto} 50%, white)`,
    '--navy-500': texto,
    '--navy-900': `color-mix(in srgb, ${texto} 85%, black)`,
    '--navy-600': `color-mix(in srgb, ${texto} 60%, black)`,
    '--navy-400': `color-mix(in srgb, ${texto} 70%, white)`,
    '--navy-300': `color-mix(in srgb, ${texto} 50%, white)`,
    '--navy-200': `color-mix(in srgb, ${texto} 30%, white)`,
    '--navy-100': `color-mix(in srgb, ${texto} 15%, white)`,

    '--accent': acento,
    '--accent-ink': colorDeContraste(acento),
    '--azul-600': `color-mix(in srgb, ${acento} 70%, black)`,
    '--azul-500': acento,
    '--azul-400': `color-mix(in srgb, ${acento} 80%, white)`,
    '--azul-300': `color-mix(in srgb, ${acento} 60%, white)`,
    '--azul-200': `color-mix(in srgb, ${acento} 30%, white)`,
    '--verde-600': `color-mix(in srgb, ${acento} 70%, black)`,
    '--verde-500': acento,
    '--verde-400': `color-mix(in srgb, ${acento} 85%, white)`,
    '--verde-300': `color-mix(in srgb, ${acento} 55%, white)`,
    '--verde-100': `color-mix(in srgb, ${acento} 20%, white)`,
  } as CSSProperties
}
