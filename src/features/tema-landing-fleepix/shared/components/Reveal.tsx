import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'

interface RevealProps {
  as?: ElementType
  index?: number
  className?: string
  children: ReactNode
}

export function Reveal({ as: Tag = 'div', index = 0, className, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  // `is-visible` vive en estado de React (no como mutación imperativa del DOM):
  // si `className` cambia en un re-render (ej. accordion que abre/cierra), React
  // vuelve a escribir el atributo `class` entero y una clase agregada a mano por
  // fuera de React se pierde.
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setVisible(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const revealClassName = [className, visible ? 'is-visible' : null].filter(Boolean).join(' ')

  return (
    <Tag ref={ref} data-reveal className={revealClassName} style={{ '--i': index } as CSSProperties}>
      {children}
    </Tag>
  )
}
