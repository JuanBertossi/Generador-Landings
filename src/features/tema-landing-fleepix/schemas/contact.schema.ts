import { z } from 'zod'

export const contactSchema = z.object({
  nombre: z.string().min(1, 'Ingresá tu nombre y apellido'),
  telefono: z.string().min(1, 'Ingresá un teléfono'),
  email: z.string().min(1, 'Ingresá un mail').email('Ingresá un mail válido'),
  mensaje: z.string().min(10, 'Contanos un poco más (mínimo 10 caracteres)'),
})

export type ContactInput = z.infer<typeof contactSchema>
