import { useEffect, useRef, useState } from 'react'

const ANCHO_REAL = 1600
const ALTO_REAL = 1067

/**
 * Vista previa en vivo de una página (iframe) escalada para llenar el
 * contenedor exacto, sin importar el ancho real (responsive). Con una escala
 * fija en vez de medida, el iframe queda más chico o más grande que el
 * contenedor según el breakpoint y se ve el fondo alrededor (bordes negros).
 */
export function LivePreviewFrame({ src, titulo }: { src: string; titulo: string }) {
  const contenedorRef = useRef<HTMLDivElement>(null)
  const [escala, setEscala] = useState(0)

  useEffect(() => {
    const el = contenedorRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const ancho = entries[0]?.contentRect.width
      if (ancho) setEscala(ancho / ANCHO_REAL)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={contenedorRef} className="relative aspect-[1600/1067] w-full overflow-hidden bg-neutral-100 dark:bg-black">
      {escala > 0 && (
        <iframe
          src={src}
          title={titulo}
          loading="lazy"
          tabIndex={-1}
          scrolling="no"
          className="pointer-events-none absolute left-0 top-0 origin-top-left overflow-hidden"
          style={{ width: ANCHO_REAL, height: ALTO_REAL, transform: `scale(${escala})` }}
          onLoad={(e) => {
            // Mismo origen: forzamos que la página interna no muestre su propia
            // scrollbar — scrolling="no" solo no alcanza en todos los navegadores.
            const doc = e.currentTarget.contentDocument
            if (doc?.documentElement) doc.documentElement.style.overflow = 'hidden'
          }}
        />
      )}
    </div>
  )
}
