import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type MobilePreviewFrameProps = {
  children: ReactNode
  width?: number
  height?: number
}

/**
 * Los media queries de Tailwind/CSS evalúan el viewport real del documento
 * donde vive la hoja de estilos — angostar un <div> contenedor no alcanza
 * para disparar el layout mobile. Por eso esto es un <iframe> con ancho
 * fijo de celular: tiene su propio documento, y ese ancho ES su viewport.
 *
 * Solo vista (no interactivo): los eventos del contenido no llegan al árbol
 * de React del documento padre al cruzar el límite del iframe, así que acá
 * siempre se renderiza con editable=false — para editar hay que volver a
 * la vista Desktop.
 */
export function MobilePreviewFrame({ children, width = 390, height = 800 }: MobilePreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [bodyEl, setBodyEl] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    function alCargar() {
      const doc = iframe!.contentDocument
      if (!doc) return
      document.head.querySelectorAll('link[rel="stylesheet"], style').forEach((nodo) => {
        doc.head.appendChild(nodo.cloneNode(true))
      })
      doc.documentElement.setAttribute('data-theme', document.documentElement.getAttribute('data-theme') ?? '')
      doc.documentElement.style.height = '100%'
      doc.body.style.margin = '0'
      doc.body.style.minHeight = '100%'
      doc.body.style.overflowX = 'hidden'
      setBodyEl(doc.body)
    }
    iframe.addEventListener('load', alCargar)
    return () => iframe.removeEventListener('load', alCargar)
  }, [])

  return (
    <iframe
      ref={iframeRef}
      title="Vista mobile"
      srcDoc="<!doctype html><html><head></head><body></body></html>"
      style={{
        width,
        height,
        border: '10px solid #1a1a1a',
        borderRadius: 28,
        display: 'block',
        background: '#fff',
        flex: 'none',
      }}
    >
      {bodyEl ? createPortal(children, bodyEl) : null}
    </iframe>
  )
}
