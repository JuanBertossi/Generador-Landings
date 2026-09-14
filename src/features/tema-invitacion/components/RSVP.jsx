import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import '../styles/RSVP.css'
import mensajeGif from '../assets/gifs/mensaje.gif'
import { formatFechaTexto } from '../lib/formatFecha'
import { supabase } from '@/shared/lib/supabaseClient'

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
  paginaId = null,
}) {
  const [nombreInvitado, setNombreInvitado] = useState('')
  const [acompanantes, setAcompanantes] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [confirmado, setConfirmado] = useState(null)

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
        <img className="rsvp__gif" src={mensajeGif} alt="" aria-hidden="true" />
        <div className="rsvp__body">
          <span className="rsvp__label">{labelConfirmar}</span>
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
              {botonVerValor}
            </button>
            <button
              type="button"
              className="rsvp__btn-primary"
              onClick={() => handleConfirmar(true)}
              disabled={enviando || faltaNombre}
            >
              <FaWhatsapp aria-hidden="true" />
              {botonVoyAsistir}
            </button>
            <button
              type="button"
              className="rsvp__btn-secundario-no"
              onClick={() => handleConfirmar(false)}
              disabled={enviando || faltaNombre}
            >
              {botonNoAsistir}
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