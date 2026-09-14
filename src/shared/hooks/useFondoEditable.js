import { useRef } from 'react'
import { useEditable } from '@/shared/components/EditableContext'

/**
 * Para fotos usadas como CSS background-image (no un <img> normal) —
 * EditableImagen no sirve ahí porque necesita renderizar un <img>. Devuelve
 * lo necesario para poner un botón "Cambiar foto" superpuesto a la sección,
 * que dispara el mismo flujo de subida que EditableImagen (mismo
 * onArchivoChange del contexto — revert-on-fail incluido).
 */
export function useFondoEditable(path) {
  const { editable, onArchivoChange } = useEditable()
  const inputRef = useRef(null)

  return {
    editable,
    abrirSelector: () => inputRef.current?.click(),
    inputRef,
    onFileChange: (e) => {
      const file = e.target.files?.[0]
      if (file) onArchivoChange(path, file)
    },
  }
}
