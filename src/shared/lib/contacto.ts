export const WHATSAPP_SOPORTE = '00000000000'

export function linkWhatsappSoporte(mensaje: string) {
  return `https://wa.me/${WHATSAPP_SOPORTE}?text=${encodeURIComponent(mensaje)}`
}
