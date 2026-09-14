import { useState, useEffect } from 'react'
import './styles/global.css'
import WelcomeScreen from './components/WelcomeScreen.jsx'
import Hero from './components/Hero.jsx'
import EventInfo from './components/EventInfo.jsx'
import BirthdaySection from './components/BirthdaySection.jsx'
import Quote from './components/Quote.jsx'
import RSVP from './components/RSVP.jsx'
import Footer from './components/Footer.jsx'
import { FaMoneyBillWave } from 'react-icons/fa'
import { invitacionDefaultConfig } from './config.js'
import { useProteccionBasica } from '@/shared/hooks/useProteccionBasica'
import { derivarPaleta } from './lib/paletaDerivada'

export default function InvitacionPage({ config = invitacionDefaultConfig, saltarBienvenida = false, paginaId = null }) {
  const [entered, setEntered] = useState(saltarBienvenida)
  const [priceOpen, setPriceOpen] = useState(false)
  const proteccionRef = useProteccionBasica()

  useEffect(() => {
    if (window.AOS) {
      window.AOS.init()
    }
  }, [])

  const coloresPersonalizados = derivarPaleta(config.apariencia)

  return (
    <div className="invitacion-root" ref={proteccionRef} style={coloresPersonalizados}>
      {!entered && (
        <WelcomeScreen
          onEnter={() => setEntered(true)}
          eyebrow={config.anfitrion.eyebrow}
          nombre={config.anfitrion.nombre}
          subtitulo={config.bienvenida.subtitulo}
          youtubeVideoId={config.bienvenida.youtubeVideoId}
          botonIngresar={config.textos.botonIngresar}
        />
      )}
      {entered && (
        <>
          <Hero
            eyebrow={config.anfitrion.eyebrow}
            nombre={config.anfitrion.nombre}
            fechaHoraISO={config.evento.fechaHoraISO}
            fotoPrincipal={config.fotoPrincipal}
          />
          <EventInfo
            fechaHoraISO={config.evento.fechaHoraISO}
            lugarNombre={config.evento.lugarNombre}
            lugarMapsLink={config.evento.lugarMapsLink}
            labelCuando={config.textos.labelCuando}
            labelDonde={config.textos.labelDonde}
            botonComoLlegar={config.textos.botonComoLlegar}
          />
          <BirthdaySection
            tituloDestacado={config.tituloDestacado}
            fotoPrincipal={config.fotoPrincipal}
          />
          <Quote texto={config.frase} />
          <RSVP
            onOpenPrices={() => setPriceOpen(true)}
            nombre={config.anfitrion.nombre}
            telefonoWhatsapp={config.rsvp.telefonoWhatsapp}
            mensajePlantilla={config.rsvp.mensajePlantilla}
            fechaLimiteISO={config.rsvp.fechaLimiteISO}
            labelConfirmar={config.textos.labelConfirmar}
            botonVerValor={config.textos.botonVerValor}
            botonVoyAsistir={config.textos.botonVoyAsistir}
            botonNoAsistir={config.textos.botonNoAsistir}
            paginaId={paginaId}
          />
          <Footer titulo={config.footer.titulo} />

          {priceOpen && (
            <div className="modal-overlay" onClick={() => setPriceOpen(false)}>
              <div className="modal-box" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setPriceOpen(false)}>✕</button>
                <h5 className="price-modal__title">{config.textos.tituloValorTarjeta}</h5>
                <ul className="price-modal__list">
                  {config.precios.map(({ categoria, precio }) => (
                    <li key={categoria}>
                      <span className="price-modal__cat">{categoria}</span>
                      <strong className="price-modal__price">{precio}</strong>
                    </li>
                  ))}
                </ul>
                <p className="price-modal__note">
                  <FaMoneyBillWave aria-hidden="true" /> {config.textos.notaPago}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
