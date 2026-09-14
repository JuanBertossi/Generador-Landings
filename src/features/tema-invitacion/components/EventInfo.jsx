import "../styles/EventInfo.css";

import calendarioGif from "../assets/gifs/calendario.gif";
import bolaFiestaGif from "../assets/gifs/bola-fiesta.gif";
import { formatFechaTexto, formatHoraTexto } from "../lib/formatFecha";

export default function EventInfo({
  fechaHoraISO = "2026-03-23T21:30:00",
  lugarNombre = "La Casona del Francés",
  lugarMapsLink = "https://www.google.com/maps/place/La+Casona+del+Frances/@-31.5414893,-63.5297996,18z/data=!4m6!3m5!1s0x94332b7d8828b98d:0x1e669b9dfece4466!8m2!3d-31.5415187!4d-63.5294081!16s%2Fg%2F11vbsm7_jd?hl=es&entry=ttu&g_ep=EgoyMDI2MDIyNC4wIKXMDSoASAFQAw%3D%3D",
  labelCuando = "¿CUÁNDO?",
  labelDonde = "¿DÓNDE?",
  botonComoLlegar = "CÓMO LLEGAR",
}) {
  return (
    <>
      <section className="section event-info event-info--when alignfull" data-aos="fade-up" data-aos-duration="600" data-aos-easing="ease-out" data-aos-once="true">
        <div className="info-card fade-up">
          <img
            className="info-card__gif"
            src={calendarioGif}
            alt=""
            aria-hidden="true"
          />

          <h3 className="info-card__title">{labelCuando}</h3>
          <p className="info-card__text">{formatFechaTexto(fechaHoraISO)}</p>
          <p className="info-card__text">
            | <strong>{formatHoraTexto(fechaHoraISO)}</strong> |
          </p>
        </div>
      </section>
         <section className="section event-info event-info--where alignfull" data-aos="fade-up" data-aos-duration="600" data-aos-easing="ease-out" data-aos-once="true">
        <div className="info-card fade-up">
          <img className="info-card__gif" src={bolaFiestaGif} alt="" aria-hidden="true" />
          <h3 className="info-card__title">{labelDonde}</h3>
          <p className="info-card__text">{lugarNombre}</p>
          <a
            className="info-card__btn"
            href={lugarMapsLink}
            target="_blank"
            rel="noreferrer"
          >
            {botonComoLlegar}
          </a>
        </div>
      </section>
    </>
  );
}
