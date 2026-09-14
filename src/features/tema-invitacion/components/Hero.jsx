import { useState, useEffect } from 'react'
import '../styles/Hero.css'
import heroImageDefault from '../assets/images/Hero-Image.png'
import { EditableText } from '@/shared/components/EditableText'
import { useFondoEditable } from '@/shared/hooks/useFondoEditable'

function pad(n) { return String(n).padStart(2, '0') }

function getTimeLeft(eventDate) {
  const diff = eventDate - Date.now()
  // Config en blanco (invitación recién creada, sin fecha elegida todavía)
  // manda fechaHoraISO === '' → `new Date('')` es Invalid Date → diff es
  // NaN, y `NaN <= 0` da false, así que sin este chequeo seguía de largo y
  // mostraba "NaN" en las 4 cajas del contador.
  if (!Number.isFinite(diff) || diff <= 0) return null
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  }
}

export default function Hero({
  eyebrow = '86 AÑOS',
  nombre = 'MIRO',
  fechaHoraISO = '2026-03-23T21:30:00',
  fotoPrincipal = heroImageDefault,
}) {
  const eventDate = new Date(fechaHoraISO)
  const [time, setTime] = useState(() => getTimeLeft(eventDate))
  const fondo = useFondoEditable('fotoPrincipal')
  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(eventDate)), 1000)
    return () => clearInterval(id)
  }, [fechaHoraISO])

  return (
    <section
      className="hero alignfull"
      data-aos="fade-up"
      data-aos-duration="600"
      data-aos-easing="ease-out"
      data-aos-once="true"
    style={{
  position: 'relative',
  backgroundImage: `linear-gradient(160deg, color-mix(in srgb, var(--color-dark) 75%, transparent) 0%, color-mix(in srgb, var(--color-dark) 65%, transparent) 100%), url(${fotoPrincipal})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}}

    >
      {fondo.editable && (
        <>
          <button type="button" className="editable-fondo-btn" onClick={fondo.abrirSelector}>
            Cambiar foto
          </button>
          <input ref={fondo.inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={fondo.onFileChange} />
        </>
      )}
      <div className="hero__content fade-up">
        <EditableText path="anfitrion.eyebrow" value={eyebrow} as="p" className="hero__eyebrow" />
        <EditableText path="anfitrion.nombre" value={nombre} as="h1" className="hero__title" />
        {time ? (
          <div className="hero__countdown">
            {[
              { val: pad(time.d), label: 'DÍAS' },
              { val: pad(time.h), label: 'HORAS' },
              { val: pad(time.m), label: 'MINUTOS' },
              { val: pad(time.s), label: 'SEGUNDOS' },
            ].map(({ val, label }) => (
              <div className="hero__count-box" key={label}>
                <span className="hero__count-num">{val}</span>
                <span className="hero__count-label">{label}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="hero__countdown-pasado">¡Ya llegó el día!</p>
        )}
      </div>
    </section>
  )
}
