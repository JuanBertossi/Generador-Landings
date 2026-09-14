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

  // Sin foto todavía (campo vacío en un config nuevo/en blanco): un <img
  // src=""> se ve como ícono de imagen rota. Mostramos un placeholder
  // clickeable en su lugar, con el mismo className/style del caller (así
  // ocupa el mismo espacio que ocuparía la foto real — clave para los usos
  // con className="absolute inset-0 ...").
  if (!src) {
    return (
      <>
        <button
          type="button"
          className={className}
          style={{
            ...style,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed rgba(128,128,128,0.6)',
            background: 'rgba(128,128,128,0.08)',
            color: 'rgba(128,128,128,0.9)',
            cursor: 'pointer',
            fontSize: 18,
            lineHeight: 1,
            padding: 0,
          }}
          onClick={() => inputRef.current?.click()}
          aria-label="Subir imagen"
        >
          +
        </button>
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
      </>
    )
  }

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
