import { z } from 'zod'

/**
 * Forma completa del config de invitación (ver ../config.js) — cubre TODOS
 * los campos para que react-hook-form tipe bien `watch()`/`setValue(path)`,
 * pero solo exige (`.min(1)`) los 3 campos que ya se validaban a mano en
 * handleGenerar hoy. No se agregan bloqueos nuevos antes del deploy.
 */
export const invitacionSchema = z.object({
  apariencia: z.object({
    colorFondo: z.string(),
    colorTexto: z.string(),
    colorAcento: z.string(),
  }),
  anfitrion: z.object({
    nombre: z.string().min(1, 'Falta el nombre de quién festeja.'),
    eyebrow: z.string(),
  }),
  bienvenida: z.object({
    subtitulo: z.string(),
    youtubeVideoId: z.string(),
  }),
  tituloDestacado: z.string(),
  evento: z.object({
    fechaHoraISO: z.string().min(1, 'Falta la fecha y hora del evento.'),
    lugarNombre: z.string(),
    lugarMapsLink: z.string(),
  }),
  frase: z.string(),
  rsvp: z.object({
    telefonoWhatsapp: z.string(),
    mensajePlantilla: z.string(),
    fechaLimiteISO: z.string().min(1, 'Falta la fecha límite para confirmar asistencia.'),
    fotoMensaje: z.string(),
  }),
  footer: z.object({
    titulo: z.string(),
    fotoFondo: z.string(),
  }),
  precios: z.array(
    z.object({
      categoria: z.string(),
      precio: z.string(),
    }),
  ),
  fotoPrincipal: z.string(),
  fotoCuando: z.string(),
  fotoDonde: z.string(),
  // Opcional — invitaciones publicadas antes de esta feature no tienen este
  // campo guardado todavía (ver ../config.js).
  secciones: z
    .object({
      eventInfo: z.boolean(),
      birthdaySection: z.boolean(),
      quote: z.boolean(),
      rsvp: z.boolean(),
    })
    .optional(),
  textos: z.object({
    botonIngresar: z.string(),
    labelCuando: z.string(),
    labelDonde: z.string(),
    botonComoLlegar: z.string(),
    labelConfirmar: z.string(),
    botonVerValor: z.string(),
    botonVoyAsistir: z.string(),
    botonNoAsistir: z.string(),
    tituloValorTarjeta: z.string(),
    notaPago: z.string(),
  }),
})

export type InvitacionFormData = z.infer<typeof invitacionSchema>
