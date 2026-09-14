import { useEffect, useRef, useState } from 'react'

const STICKY_TOP = 110

/**
 * Replica la lógica de stacking sticky + scroll-sync de la sección "Funcionalidades"
 * del landing original: a medida que se scrollea, las cards se van "apilando" con
 * translateY/scale/opacity decrecientes, y el nav lateral resalta la card activa.
 */
export function useFuncionalidadesStack(cardCount: number) {
  const rightRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  // Posición absoluta (documento) "natural" de cada card, medida una sola vez sin
  // ningún transform/sticky-stuck aplicado todavía. getBoundingClientRect()/offsetTop
  // sobre un elemento position:sticky ya "pegado" (o con el transform de stacking
  // aplicado) da un valor ambiguo según el navegador — por eso no se puede medir en
  // el momento del click, solo cachear el valor limpio de antemano.
  const cardOffsets = useRef<number[]>([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    const right = rightRef.current
    if (!right) return

    let detach: (() => void) | undefined

    // La sección "Funcionalidades" está debajo del fold: diferimos el cálculo inicial
    // (que fuerza un reflow síncrono vía getBoundingClientRect) hasta que esté por
    // entrar en viewport, para no competir por main thread con el paint inicial.
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        io.disconnect()

        const cards = cardRefs.current.filter((c): c is HTMLElement => c !== null)
        if (!cards.length) return

        function measureOffsets() {
          cardOffsets.current = cards.map((c) => c.getBoundingClientRect().top + window.scrollY)
        }

        function updateStack() {
          let activeIdx = 0
          cards.forEach((c, i) => {
            if (c.getBoundingClientRect().top <= STICKY_TOP + 4) activeIdx = i
          })
          cards.forEach((c, i) => {
            const d = activeIdx - i
            if (d > 0) {
              const k = Math.min(d, 3)
              c.style.transform = `translateY(${-k * 11}px) scale(${1 - k * 0.035})`
              c.style.opacity = String(Math.max(1 - d * 0.12, 0.55))
            } else {
              c.style.transform = 'translateY(0) scale(1)'
              c.style.opacity = '1'
            }
          })
          setActive(activeIdx)
        }

        let ticking = false
        const onScroll = () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              updateStack()
              ticking = false
            })
            ticking = true
          }
        }

        const onResize = () => {
          measureOffsets()
          updateStack()
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onResize)
        measureOffsets()
        updateStack()

        detach = () => {
          window.removeEventListener('scroll', onScroll)
          window.removeEventListener('resize', onResize)
        }
      },
      { rootMargin: '600px 0px' },
    )
    io.observe(right)

    return () => {
      io.disconnect()
      detach?.()
    }
  }, [cardCount])

  function scrollToCard(idx: number) {
    const target = cardOffsets.current[idx]
    if (target === undefined) return
    window.scrollTo({ top: Math.round(target - STICKY_TOP + 2), behavior: 'smooth' })
  }

  return { rightRef, cardRefs, active, scrollToCard }
}
