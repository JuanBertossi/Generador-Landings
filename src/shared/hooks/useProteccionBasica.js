import { useEffect, useRef } from 'react'

/**
 * Fricción básica contra copiado casual (clic derecho -> "Guardar imagen
 * como" / "Inspeccionar" desde el menú). NO es protección real: cualquiera
 * con F12 sigue viendo el HTML/CSS igual, eso es inherente a cómo funciona
 * un navegador. Solo eleva un poco la vara para el usuario casual.
 *
 * Se engancha con un ref a un contenedor puntual (no a `document`) para no
 * romper el clic derecho -> pegar en los campos del editor cuando esta
 * misma página se usa como vista previa en vivo dentro del formulario.
 */
export function useProteccionBasica() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const bloquearMenu = (e) => e.preventDefault()
    el.addEventListener('contextmenu', bloquearMenu)
    return () => el.removeEventListener('contextmenu', bloquearMenu)
  }, [])

  return ref
}
