import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import '../styles/RSVP.css'
import mensajeGifDefault from '../assets/gifs/mensaje.gif'
import { formatFechaTexto } from '../lib/formatFecha'
import { supabase } from '@/shared/lib/supabaseClient'
import { EditableText } from '@/shared/components/EditableText'
import { EditableImagen } from '@/shared/components/EditableImagen'
import { useEditable } from '@/shared/components/EditableContext'

export default function RSVP({
  onOpenPrices,
  nombre = 'Miro',
  telefonoWhatsapp = '00000000000',
  mensajePlantilla = 'Hola! Confirmo mi asistencia al cumple de {nombre}',
  fechaLimiteISO = '2026-03-16',
  labelConfirmar = 'CONFIRMÁ TU ASISTENCIA',
  botonVerValor = 'VER VALOR TARJETA',
  botonVoyAsistir = 'VOY A ASISTIR',
  botonNoAsistir = 'NO VOY A PODER IR',
  fotoMensaje = mensajeGifDefault,
  paginaId = null,
}) {
  const [nombreInvitado, setNombreInvitado] = useState('')
  const [acompanantes, setAcompanantes] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [confirmado, setConfirmado] = useState(null)
  const { editable } = useEditable()

  const mensaje = mensajePlantilla.replace('{nombre}', nombre)
  const waUrl = `https://wa.me/${telefonoWhatsapp}?text=${encodeURIComponent(mensaje)}`
  const faltaNombre = Boolean(paginaId) && !nombreInvitado.trim()

  async function handleConfirmar(asiste) {
    // Abrimos la pestaña ANTES del await: si esperamos a que termine el
    // insert, el navegador pierde el "gesto de usuario" y Safari/iOS
    // bloquea el popup en silencio (el invitado no ve ningún error).
    const nuevaPestana = asiste ? window.open('', '_blank') : null
    if (paginaId && nombreInvitado.trim()) {
      setEnviando(true)
      try {
        await supabase.from('rsvps').insert({
          pagina_id: paginaId,
          nombre: nombreInvitado.trim(),
          asiste,
          acompanantes: asiste ? Number(acompanantes) || 0 : 0,
        })
      } catch {
        // si falla el guardado no bloqueamos la confirmación por WhatsApp
      } finally {
        setEnviando(false)
      }
    }
    setConfirmado(asiste)
    if (nuevaPestana) nuevaPestana.location.href = waUrl
  }

  return (
    <section className="section rsvp fade-up alignfull" data-aos="fade-up" data-aos-duration="600" data-aos-easing="ease-out" data-aos-once="true">
      <div className="rsvp__row">
        <EditableImagen path="rsvp.fotoMensaje" src={fotoMensaje} alt="" className="rsvp__gif" />
        <div className="rsvp__body">
          <EditableText path="textos.labelConfirmar" value={labelConfirmar} as="span" className="rsvp__label" />
          <p className="rsvp__sub">ANTES DEL {formatFechaTexto(fechaLimiteISO)}</p>
          {paginaId && (
            <div className="rsvp__campos">
              <input
                type="text"
                className="rsvp__input"
                placeholder="Tu nombre"
                value={nombreInvitado}
                onChange={(e) => setNombreInvitado(e.target.value)}
              />
              <input
                type="number"
                min="0"
                className="rsvp__input rsvp__input--corto"
                placeholder="Acompañantes"
                value={acompanantes}
                onChange={(e) => setAcompanantes(e.target.value)}
              />
            </div>
          )}
          <div className="rsvp__actions">
            <button className="rsvp__btn-secondary" onClick={onOpenPrices}>
              <span onClick={(e) => editable && e.stopPropagation()}>
                <EditableText path="textos.botonVerValor" value={botonVerValor} as="span" />
              </span>
            </button>
            <button
              type="button"
              className="rsvp__btn-primary"
              onClick={() => handleConfirmar(true)}
              disabled={enviando || faltaNombre}
            >
              <FaWhatsapp aria-hidden="true" />
              <span onClick={(e) => editable && e.stopPropagation()}>
                <EditableText path="textos.botonVoyAsistir" value={botonVoyAsistir} as="span" />
              </span>
            </button>
            <button
              type="button"
              className="rsvp__btn-secundario-no"
              onClick={() => handleConfirmar(false)}
              disabled={enviando || faltaNombre}
            >
              <span onClick={(e) => editable && e.stopPropagation()}>
                <EditableText path="textos.botonNoAsistir" value={botonNoAsistir} as="span" />
              </span>
            </button>
          </div>
          {confirmado !== null && (
            <p className="rsvp__gracias">
              {confirmado ? '¡Gracias por confirmar! Te esperamos.' : 'Gracias por avisar, ¡te vamos a extrañar!'}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
