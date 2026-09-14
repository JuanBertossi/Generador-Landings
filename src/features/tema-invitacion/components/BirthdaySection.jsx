import '../styles/BirthdaySection.css'
import heroImageDefault from '../assets/images/Hero-Image.png'

export default function BirthdaySection({
  tituloDestacado = 'MIS 86\nMIRO',
  fotoPrincipal = heroImageDefault,
}) {
  return (
    <section
      className="birthday-section alignfull fade-up"
      data-aos="fade-up"
      data-aos-duration="600"
      data-aos-easing="ease-out"
      data-aos-once="true"
      style={{
        backgroundImage: `linear-gradient(160deg, color-mix(in srgb, var(--color-dark) 75%, transparent) 0%, color-mix(in srgb, var(--color-dark) 65%, transparent) 100%), url(${fotoPrincipal})`,
      }}
    >
      <div className="birthday-section__content">
        <h1 className="birthday-section__title">
          {tituloDestacado.split('\n').map((linea, i, arr) => (
            <span key={i}>
              {linea}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </h1>
      </div>
    </section>
  )
}
