import { useState, type CSSProperties, type ReactNode, type KeyboardEvent, type ClipboardEvent, type FocusEvent } from 'react'
import { useEditable } from './EditableContext'

type Tag = 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div'

type EditableTextProps = {
  path: string
  value: string
  as?: Tag
  multiline?: boolean
  className?: string
  style?: CSSProperties
  placeholder?: string
  /** Cómo se ve el valor cuando NO se está editando (ej: textoConEnfasis del tema). */
  render?: (value: string) => ReactNode
}

/**
 * Texto clickeable-para-editar dentro del preview de un formulario de
 * creación. Con editable=false (páginas públicas/ejemplo) es un <Tag> normal,
 * sin ningún cambio de comportamiento respecto a antes de este componente.
 */
export function EditableText({
  path,
  value,
  as = 'span',
  multiline = false,
  className,
  style,
  placeholder,
  render,
}: EditableTextProps) {
  const { editable, onChange } = useEditable()
  const [editando, setEditando] = useState(false)
  const Tag = as

  if (!editable) {
    return <Tag className={className} style={style}>{render ? render(value) : value}</Tag>
  }

  function handlePaste(e: ClipboardEvent<HTMLElement>) {
    e.preventDefault()
    const texto = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, texto)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault()
      e.currentTarget.blur()
    }
  }

  function handleBlur(e: FocusEvent<HTMLElement>) {
    setEditando(false)
    onChange(path, e.currentTarget.textContent ?? '')
  }

  return (
    <Tag
      className={`${className ?? ''} editable-text`.trim()}
      style={style}
      data-placeholder={placeholder}
      contentEditable
      suppressContentEditableWarning
      onFocus={() => setEditando(true)}
      onBlur={handleBlur}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
    >
      {editando ? value : render ? render(value) : value}
    </Tag>
  )
}
