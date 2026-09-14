import { supabase } from './supabaseClient'

const MAX_DIMENSION = 1920
const BUCKET = 'archivos-paginas'

/** Redimensiona a un máximo de 1920px de lado y recodifica a WebP calidad 82% — mismo look, mucho menos peso. */
function comprimirImagen(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const escala = MAX_DIMENSION / Math.max(width, height)
        width = Math.round(width * escala)
        height = Math.round(height * escala)
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('No se pudo procesar la imagen'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('No se pudo comprimir la imagen'))),
        'image/webp',
        0.82,
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen'))
    }
    img.src = url
  })
}

/**
 * Sube una imagen (comprimida a WebP) a Supabase Storage y devuelve la URL
 * pública. Solo imágenes — sin video: el plan free de Supabase da 1GB de
 * Storage, y un video pesa fácil 50-100x lo que una foto ya comprimida.
 * Con muchos usuarios subiendo video ese 1GB se llena rápido; con solo
 * fotos (livianas, todas convertidas a WebP acá abajo) rinde muchísimo más.
 */
export async function subirArchivo(file: File): Promise<string> {
  if (file.type.startsWith('video/')) {
    throw new Error('No se pueden subir videos, solo fotos.')
  }

  const cuerpo = await comprimirImagen(file)
  const nombre = `${crypto.randomUUID()}.webp`

  const { error } = await supabase.storage.from(BUCKET).upload(nombre, cuerpo, {
    contentType: 'image/webp',
    cacheControl: '31536000',
  })
  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(nombre)
  return data.publicUrl
}

/**
 * Borra un archivo previamente subido con subirArchivo(), a partir de su URL
 * pública — se usa al reemplazar una foto/video para no dejar huérfanos en
 * el bucket. Si la URL no es de este bucket (ej: un blob: local que todavía
 * no terminó de subir, o vino vacía) no hace nada.
 */
export async function eliminarArchivo(url: string | undefined | null): Promise<void> {
  if (!url) return
  const marcador = `/object/public/${BUCKET}/`
  const indice = url.indexOf(marcador)
  if (indice === -1) return
  const ruta = url.slice(indice + marcador.length)
  if (!ruta) return
  await supabase.storage.from(BUCKET).remove([ruta])
}
