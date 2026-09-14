/**
 * global.css de Miro usa varias variables (--color-bg2, --color-primary,
 * --color-mid, --color-light) además de las 3 que elige el usuario
 * (bg/dark/accent). Sin derivarlas, botones y bordes se quedan con los
 * tonos originales de ejemplo pase lo que pase.
 */
export function derivarPaleta({ colorFondo, colorTexto, colorAcento }) {
  return {
    '--color-bg': colorFondo,
    '--color-bg2': `color-mix(in srgb, ${colorFondo} 80%, black 20%)`,
    '--color-light': `color-mix(in srgb, ${colorFondo} 60%, white 40%)`,
    '--color-dark': colorTexto,
    '--color-primary': colorTexto,
    '--color-mid': `color-mix(in srgb, ${colorTexto} 60%, white)`,
    '--color-accent': colorAcento,
  }
}
