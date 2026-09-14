import { z } from 'zod'

/**
 * Forma completa del config de vortex (ver ../config.ts, VortexConfig) —
 * cubre TODOS los campos para que react-hook-form tipe bien
 * `watch()`/`setValue(path)`, pero solo exige (`.min(1)`) el campo que ya se
 * validaba a mano en handleGenerar hoy (nombreEmpresa).
 */
const navLinkSchema = z.object({ href: z.string(), label: z.string() })

const itemTextoSchema = z.object({
  icono: z.string(),
  titulo: z.string(),
  descripcion: z.string(),
})

const productoSchema = z.object({
  titulo: z.string(),
  destacado: z.string(),
  descripcion: z.string(),
  tags: z.array(z.string()),
  ctaLabel: z.string(),
  foto: z.string(),
})

const agenteSchema = z.object({
  titulo: z.string(),
  descripcion: z.string(),
})

const servicioSchema = z.object({
  titulo: z.string(),
  subtitulo: z.string(),
  descripcion: z.string(),
  ctaLabel: z.string(),
  foto: z.string(),
})

const pasoSchema = z.object({
  icono: z.string(),
  numero: z.string(),
  titulo: z.string(),
  descripcion: z.string(),
})

const beneficioSchema = z.object({
  titulo: z.string(),
  subtitulo: z.string(),
  valor: z.string(),
})

const casoSchema = z.object({
  tag: z.string(),
  titulo: z.string(),
  descripcion: z.string(),
  logoUrl: z.string().optional(),
})

const faqItemSchema = z.object({
  pregunta: z.string(),
  respuesta: z.string(),
})

// Opcional — páginas publicadas antes de esta feature no tienen este campo
// guardado todavía (ver VortexConfig).
const seccionesSchema = z
  .object({
    beneficios: z.boolean(),
    soluciones: z.boolean(),
    servicios: z.boolean(),
    comoEmpezar: z.boolean(),
    beneficiosExtra: z.boolean(),
    casos: z.boolean(),
    preguntas: z.boolean(),
    ctaFinal: z.boolean(),
  })
  .optional()

export const landingVortexSchema = z.object({
  identidad: z.object({
    nombreEmpresa: z.string().min(1, 'Falta el nombre de tu empresa.'),
    logoUrl: z.string(),
  }),
  apariencia: z.object({
    colorFondo: z.string(),
    colorTexto: z.string(),
    colorAcento: z.string(),
  }),
  whatsappNumero: z.string(),
  whatsappMensaje: z.string(),
  whatsappTooltip: z.string(),
  bannerTexto: z.string(),
  navLinks: z.array(navLinkSchema),
  navCtaLabel: z.string(),
  hero: z.object({
    badge: z.string(),
    titulo: z.string(),
    descripcion: z.string(),
    ctaLabel: z.string(),
    fondoTipo: z.enum(['tunel', 'imagen', 'video']),
    fondoUrl: z.string(),
  }),
  problem: z.object({
    eyebrow: z.string(),
    titulo: z.string(),
    descripcion: z.string(),
    items: z.array(itemTextoSchema),
    ctaLabel: z.string(),
  }),
  products: z.object({
    eyebrow: z.string(),
    titulo: z.string(),
    descripcion: z.string(),
    subtitulo: z.string(),
    subdescripcion: z.string(),
    producto1: productoSchema,
    producto2: productoSchema,
    agentes: z.array(agenteSchema),
  }),
  services: z.object({
    eyebrow: z.string(),
    descripcion: z.string(),
    items: z.array(servicioSchema),
  }),
  process: z.object({
    eyebrow: z.string(),
    titulo: z.string(),
    descripcion: z.string(),
    items: z.array(pasoSchema),
    ctaLabel: z.string(),
  }),
  benefitsExtra: z.object({
    tituloLinea1: z.string(),
    tituloLinea2: z.string(),
    items: z.array(beneficioSchema),
  }),
  testimonials: z.object({
    eyebrow: z.string(),
    titulo: z.string(),
    descripcion: z.string(),
    items: z.array(casoSchema),
    ctaLabel: z.string(),
  }),
  faq: z.object({
    eyebrow: z.string(),
    titulo: z.string(),
    items: z.array(faqItemSchema),
    ctaPregunta: z.string(),
    ctaLabel: z.string(),
  }),
  finalCta: z.object({
    titulo: z.string(),
    descripcion: z.string(),
    ctaLabel: z.string(),
  }),
  footer: z.object({
    descripcion: z.string(),
    tituloNavegacion: z.string(),
    tituloContacto: z.string(),
    contacto: z.object({
      email: z.string(),
      whatsappNumero: z.string(),
      whatsappTexto: z.string(),
      direccion: z.string(),
    }),
    copyrightTexto: z.string(),
  }),
  secciones: seccionesSchema,
})

export type LandingVortexFormData = z.infer<typeof landingVortexSchema>
