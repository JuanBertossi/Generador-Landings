import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactInput } from '../schemas/contact.schema'
import { buildWhatsappUrl } from '@/features/tema-landing-fleepix/shared/lib/whatsapp'
import { supabase } from '@/shared/lib/supabaseClient'

function buildContactWhatsappUrl(numero: string, data: ContactInput) {
  const message = [
    'Hola! Quiero solicitar una demo de Fleepix.',
    '',
    `Nombre: ${data.nombre}`,
    `Teléfono: ${data.telefono}`,
    `Email: ${data.email}`,
    `Mensaje: ${data.mensaje}`,
  ].join('\n')
  return buildWhatsappUrl(numero, message)
}

export function useContactForm(numeroWhatsapp: string, paginaId?: string | null) {
  const [sent, setSent] = useState(false)
  const form = useForm<ContactInput>({ resolver: zodResolver(contactSchema) })

  const onSubmit = form.handleSubmit(async (data) => {
    // Abrimos la pestaña ANTES del await: si esperamos a que termine el
    // insert, el navegador pierde el "gesto de usuario" y Safari/iOS
    // bloquea el popup en silencio (la persona ve "enviado" pero WhatsApp
    // nunca abre).
    const nuevaPestana = window.open('', '_blank')
    if (paginaId) {
      const { error } = await supabase.from('leads').insert({
        pagina_id: paginaId,
        nombre: data.nombre,
        telefono: data.telefono,
        email: data.email,
        mensaje: data.mensaje,
      })
      // si falla el guardado no bloqueamos el contacto por WhatsApp, pero
      // lo dejamos en consola para poder detectar leads que se pierden
      if (error) console.error('No se pudo guardar el lead:', error)
    }
    if (nuevaPestana) nuevaPestana.location.href = buildContactWhatsappUrl(numeroWhatsapp, data)
    setSent(true)
    form.reset()
  })

  return { ...form, onSubmit, sent }
}
