import { useEffect, useRef } from 'react'

/**
 * Fricción básica contra copiado casual (clic derecho -> "Guardar imagen
 * como" / "Inspeccionar" desde el menú, atajos de DevTools, arrastrar
 * imágenes para guardarlas). NO es protección real: cualquiera con F12 ya
 * abierto, o que entre por la barra de menú del navegador en vez del
 * atajo, sigue viendo el HTML/CSS igual — eso es inherente a cómo funciona
 * un navegador con contenido del lado del cliente. Solo eleva la vara para
 * el usuario casual que copia lo primero que encuentra.
 *
 * A propósito NO se toca `user-select` (seguiría dejando copiar texto): en
 * una landing/invitación real, un visitante necesita poder seleccionar y
 * copiar el teléfono o la dirección — bloquear selección global rompe eso
 * para gente real a cambio de una protección igual de floja.
 *
 * Se engancha con un ref a un contenedor puntual (no a `document`) para no
 * romper el clic derecho/atajos en los campos del editor cuando esta misma
 * página se usa como vista previa en vivo dentro del formulario de creación.
 */
export function useProteccionBasica() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const bloquearMenu = (e) => e.preventDefault()

    const bloquearAtajos = (e) => {
      const tecla = e.key?.toLowerCase()
      const esDevtools =
        tecla === 'f12' ||
        (e.ctrlKey && e.shiftKey && (tecla === 'i' || tecla === 'j' || tecla === 'c')) ||
        (e.ctrlKey && (tecla === 'u' || tecla === 's'))
      if (esDevtools) e.preventDefault()
    }

    const bloquearArrastreImagen = (e) => {
      if (e.target instanceof HTMLImageElement) e.preventDefault()
    }

    el.addEventListener('contextmenu', bloquearMenu)
    el.addEventListener('keydown', bloquearAtajos)
    el.addEventListener('dragstart', bloquearArrastreImagen)
    return () => {
      el.removeEventListener('contextmenu', bloquearMenu)
      el.removeEventListener('keydown', bloquearAtajos)
      el.removeEventListener('dragstart', bloquearArrastreImagen)
    }
  }, [])

  return ref
}
