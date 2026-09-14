import "../styles/EventInfo.css";

import calendarioGifDefault from "../assets/gifs/calendario.gif";
import bolaFiestaGifDefault from "../assets/gifs/bola-fiesta.gif";
import { formatFechaTexto, formatHoraTexto } from "../lib/formatFecha";
import { EditableText } from '@/shared/components/EditableText'
import { EditableImagen } from '@/shared/components/EditableImagen'
import { useEditable } from '@/shared/components/EditableContext'

export default function EventInfo({
  fechaHoraISO = "2026-03-23T21:30:00",
  lugarNombre = "La Casona del Francés",
  lugarMapsLink = "https://www.google.com/maps/place/La+Casona+del+Frances/@-31.5414893,-63.5297996,18z/data=!4m6!3m5!1s0x94332b7d8828b98d:0x1e669b9dfece4466!8m2!3d-31.5415187!4d-63.5294081!16s%2Fg%2F11vbsm7_jd?hl=es&entry=ttu&g_ep=EgoyMDI2MDIyNC4wIKXMDSoASAFQAw%3D%3D",
  labelCuando = "¿CUÁNDO?",
  labelDonde = "¿DÓNDE?",
  botonComoLlegar = "CÓMO LLEGAR",
  fotoCuando = calendarioGifDefault,
  fotoDonde = bolaFiestaGifDefault,
}) {
  const { editable } = useEditable()

  return (
    <>
      <section className="section event-info event-info--when alignfull" data-aos="fade-up" data-aos-duration="600" data-aos-easing="ease-out" data-aos-once="true">
        <div className="info-card fade-up">
          <EditableImagen path="fotoCuando" src={fotoCuando} alt="" className="info-card__gif" />
          <EditableText path="textos.labelCuando" value={labelCuando} as="h3" className="info-card__title" />
          <p className="info-card__text">{formatFechaTexto(fechaHoraISO)}</p>
          <p className="info-card__text">
            | <strong>{formatHoraTexto(fechaHoraISO)}</strong> |
          </p>
        </div>
      </section>
         <section className="section event-info event-info--where alignfull" data-aos="fade-up" data-aos-duration="600" data-aos-easing="ease-out" data-aos-once="true">
        <div className="info-card fade-up">
          <EditableImagen path="fotoDonde" src={fotoDonde} alt="" className="info-card__gif" />
          <EditableText path="textos.labelDonde" value={labelDonde} as="h3" className="info-card__title" />
          <EditableText path="evento.lugarNombre" value={lugarNombre} as="p" className="info-card__text" />
          <a
            className="info-card__btn"
            href={lugarMapsLink}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => { if (editable) e.preventDefault() }}
          >
            <EditableText path="textos.botonComoLlegar" value={botonComoLlegar} as="span" />
          </a>
        </div>
      </section>
    </>
  );
}
