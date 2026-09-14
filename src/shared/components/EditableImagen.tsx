import { useRef, type CSSProperties } from 'react'
import { useEditable } from './EditableContext'

type EditableImagenProps = {
  path: string
  src: string
  alt?: string
  className?: string
  style?: CSSProperties
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
}

/**
 * Foto clickeable-para-reemplazar dentro del preview de un formulario de
 * creación. Con editable=false es un <img> normal. El wrapper usa
 * display:contents para no crear una caja propia — muchas de estas fotos
 * dependen de que su padre DIRECTO tenga position:relative (className
 * "absolute inset-0 ..."), y una caja intermedia rompería ese layout.
 */
export function EditableImagen({
  path,
  src,
  alt = '',
  className,
  style,
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
}: EditableImagenProps) {
  const { editable, onArchivoChange } = useEditable()
  const inputRef = useRef<HTMLInputElement>(null)

  const img = (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
    />
  )

  if (!editable) return img

  return (
    <div
      className="editable-imagen"
      style={{ display: 'contents' }}
      onClick={() => inputRef.current?.click()}
    >
      {img}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onArchivoChange(path, file)
        }}
      />
    </div>
  )
}
