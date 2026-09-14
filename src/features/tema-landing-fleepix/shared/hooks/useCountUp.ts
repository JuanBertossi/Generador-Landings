import { useEffect, useState } from 'react'

const CYCLE = 6000
const GROW = 0.7
const fmt = new Intl.NumberFormat('es-AR')

/**
 * Contador animado en loop (usado en la card "Liquidación Inteligente"),
 * sincronizado con el resto de las animaciones de esa card (ciclo de 6s).
 */
export function useCountUp(to: number) {
  const [label, setLabel] = useState(() => '$' + fmt.format(to))

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setLabel('$' + fmt.format(to))
      return
    }

    let raf = 0
    function frame(now: number) {
      const p = (now % CYCLE) / CYCLE
      let f = p >= GROW ? 1 : p / GROW
      f = 1 - Math.pow(1 - f, 2)
      const next = '$' + fmt.format(Math.round(to * f))
      setLabel((prev) => (prev === next ? prev : next))
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [to])

  return label
}
