import '../styles/BirthdaySection.css'
import heroImageDefault from '../assets/images/Hero-Image.png'
import { EditableText } from '@/shared/components/EditableText'
import { useFondoEditable } from '@/shared/hooks/useFondoEditable'

function renderMultilinea(texto) {
  return texto.split('\n').map((linea, i, arr) => (
    <span key={i}>
      {linea}
      {i < arr.length - 1 && <br />}
    </span>
  ))
}

export default function BirthdaySection({
  tituloDestacado = 'MIS 86\nMIRO',
  fotoPrincipal = heroImageDefault,
}) {
  const fondo = useFondoEditable('fotoPrincipal')

  return (
    <section
      className="birthday-section alignfull fade-up"
      data-aos="fade-up"
      data-aos-duration="600"
      data-aos-easing="ease-out"
      data-aos-once="true"
      style={{
        position: 'relative',
        backgroundImage: `linear-gradient(160deg, color-mix(in srgb, var(--color-dark) 75%, transparent) 0%, color-mix(in srgb, var(--color-dark) 65%, transparent) 100%), url(${fotoPrincipal})`,
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
      <div className="birthday-section__content">
        <EditableText
          path="tituloDestacado"
          value={tituloDestacado}
          as="h1"
          multiline
          className="birthday-section__title"
          render={renderMultilinea}
        />
      </div>
    </section>
  )
}
