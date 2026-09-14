import '../styles/Footer.css'
import fireworks from '../assets/images/fuegos-artificiales.png'

export default function Footer({ titulo = 'TE ESPERO' }) {
  return (
    <footer className="footer alignfull fade-up" data-aos="fade-up" data-aos-duration="600" data-aos-easing="ease-out" data-aos-once="true" style={{
      backgroundImage: `linear-gradient(160deg, color-mix(in srgb, var(--color-dark) 75%, transparent) 0%, color-mix(in srgb, var(--color-dark) 65%, transparent) 100%), url(${fireworks})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <h2 className="footer__title">{titulo}</h2>
    </footer>
  )
}