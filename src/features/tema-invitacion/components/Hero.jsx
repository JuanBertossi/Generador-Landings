import { useState, useEffect } from 'react'
import '../styles/Hero.css'
import heroImageDefault from '../assets/images/Hero-Image.png'

function pad(n) { return String(n).padStart(2, '0') }

function getTimeLeft(eventDate) {
  const diff = eventDate - Date.now()
  if (diff <= 0) return null
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
  backgroundImage: `linear-gradient(160deg, color-mix(in srgb, var(--color-dark) 75%, transparent) 0%, color-mix(in srgb, var(--color-dark) 65%, transparent) 100%), url(${fotoPrincipal})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}}

    >
      <div className="hero__content fade-up">
        <p className="hero__eyebrow">{eyebrow}</p>
        <h1 className="hero__title">{nombre}</h1>
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