import { z } from 'zod'

/**
 * Forma completa del config de fleepix (ver ../config.ts, LandingFleepixConfig)
 * — cubre TODOS los campos para que react-hook-form tipe bien
 * `watch()`/`setValue(path)`, pero solo exige (`.min(1)`) el campo que ya se
 * validaba a mano en handleGenerar hoy (nombreEmpresa). La validación de
 * "todavía tenés fotos de ejemplo sin cambiar" es un chequeo aparte
 * (compara contra fleepixBlankConfig), no se puede expresar acá — sigue
 * viviendo en CrearLandingFleepixPage.tsx tal cual estaba.
 */
const navLinkSchema = z.object({ href: z.string(), label: z.string() })

const tarjetaTextoSchema = z.object({
  titulo: z.string(),
  descripcion: z.string(),
  bullets: z.array(z.string()),
})

const tarjetaFotoSchema = z.object({
  badge: z.string(),
  foto: z.string(),
})

const beneficioSchema = z.object({
  icono: z.string(),
  titulo: z.string(),
  cuerpo: z.string(),
})

const funcionalidadSchema = z.object({
  navLabel: z.string(),
  chipIcono: z.string(),
  chipLabel: z.string(),
  titulo: z.string(),
  descripcion: z.string(),
  foto: z.string(),
})

const faqItemSchema = z.object({
  pregunta: z.string(),
  respuesta: z.string(),
})

// Opcional — páginas publicadas antes de esta feature no tienen este campo
// guardado todavía (ver ../config.ts).
const seccionesSchema = z
  .object({
    paraQuien: z.boolean(),
    beneficios: z.boolean(),
    funcionalidades: z.boolean(),
    faq: z.boolean(),
    contacto: z.boolean(),
  })
  .optional()

export const landingFleepixSchema = z.object({
  identidad: z.object({
    nombreEmpresa: z.string().min(1, 'Falta el nombre de tu empresa.'),
    logoUrl: z.string(),
  }),
  apariencia: z.object({
    colorFondo: z.string(),
    colorTexto: z.string(),
    colorAcento: z.string(),
  }),
  navLinks: z.array(navLinkSchema),
  navCtaLabel: z.string(),
  whatsappNumero: z.string(),
  whatsappMensajeDemo: z.string(),
  hero: z.object({
    eyebrow: z.string(),
    titulo: z.string(),
    descripcion: z.string(),
    cta1Label: z.string(),
    cta2Label: z.string(),
    fotoPrincipal: z.string(),
    fotoSecundaria: z.string(),
  }),
  paraQuien: z.object({
    eyebrow: z.string(),
    titulo: z.string(),
    descripcion: z.string(),
    tarjetaTexto1: tarjetaTextoSchema,
    tarjetaFoto1: tarjetaFotoSchema,
    tarjetaFoto2: tarjetaFotoSchema,
    tarjetaTexto2: tarjetaTextoSchema,
  }),
  beneficios: z.object({
    eyebrow: z.string(),
    titulo: z.string(),
    descripcion: z.string(),
    items: z.array(beneficioSchema),
  }),
  funcionalidades: z.object({
    eyebrow: z.string(),
    titulo: z.string(),
    descripcion: z.string(),
    items: z.array(funcionalidadSchema),
  }),
  faq: z.object({
    eyebrow: z.string(),
    titulo: z.string(),
    descripcion: z.string(),
    ctaLabel: z.string(),
    items: z.array(faqItemSchema),
  }),
  contactoSeccion: z.object({
    eyebrow: z.string(),
    titulo: z.string(),
    descripcion: z.string(),
    bullets: z.array(z.string()),
    botonEnviar: z.string(),
    mensajeExito: z.string(),
  }),
  footer: z.object({
    descripcion: z.string(),
    contacto: z.object({
      email: z.string(),
      whatsappNumero: z.string(),
      whatsappTexto: z.string(),
      direccion: z.string(),
    }),
    mostrarBloqueDesarrolloAMedida: z.boolean(),
    mensajeWhatsappDesarrolloAMedida: z.string(),
    redes: z.object({
      instagram: z.string(),
      linkedin: z.string(),
      facebook: z.string(),
    }),
    copyrightTexto: z.string(),
    mostrarSelloGoodApps: z.boolean(),
  }),
  secciones: seccionesSchema,
})

export type LandingFleepixFormData = z.infer<typeof landingFleepixSchema>
