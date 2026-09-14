import { supabase } from './supabaseClient'

const MAX_VIDEO_BYTES = 25 * 1024 * 1024
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

/** Sube una imagen (comprimida a WebP) o video a Supabase Storage y devuelve la URL pública. */
export async function subirArchivo(file: File): Promise<string> {
  const esVideo = file.type.startsWith('video/')

  if (esVideo && file.size > MAX_VIDEO_BYTES) {
    throw new Error('El video pesa más de 25MB — subí uno más liviano.')
  }

  const cuerpo = esVideo ? file : await comprimirImagen(file)
  const extension = esVideo ? file.name.split('.').pop() || 'mp4' : 'webp'
  const nombre = `${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage.from(BUCKET).upload(nombre, cuerpo, {
    contentType: esVideo ? file.type : 'image/webp',
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
