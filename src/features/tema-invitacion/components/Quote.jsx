import '../styles/Quote.css'
import { EditableText } from '@/shared/components/EditableText'

export default function Quote({
  texto = 'Un recuerdo inolvidable se crea al compartirlo con vos.',
}) {
  return (
    <section className="section quote-section fade-up alignfull" data-aos="fade-up" data-aos-duration="600" data-aos-easing="ease-out" data-aos-once="true">
      <hr className="divider" />
      <EditableText path="frase" value={texto} as="h3" className="quote__text" multiline />
      <hr className="divider" />
    </section>
  )
}
