import '../styles/Footer.css'
import fireworks from '../assets/images/fuegos-artificiales.png'
import { EditableText } from '@/shared/components/EditableText'
import { useFondoEditable } from '@/shared/hooks/useFondoEditable'

export default function Footer({ titulo = 'TE ESPERO', fotoFondo = fireworks }) {
  const fondo = useFondoEditable('footer.fotoFondo')

  return (
    <footer className="footer alignfull fade-up" data-aos="fade-up" data-aos-duration="600" data-aos-easing="ease-out" data-aos-once="true" style={{
      position: 'relative',
      backgroundImage: `linear-gradient(160deg, color-mix(in srgb, var(--color-dark) 75%, transparent) 0%, color-mix(in srgb, var(--color-dark) 65%, transparent) 100%), url(${fotoFondo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      {fondo.editable && (
        <>
          <button type="button" className="editable-fondo-btn" onClick={fondo.abrirSelector}>
            Cambiar foto
          </button>
          <input ref={fondo.inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={fondo.onFileChange} />
        </>
      )}
      <EditableText path="footer.titulo" value={titulo} as="h2" className="footer__title" />
    </footer>
  )
}
