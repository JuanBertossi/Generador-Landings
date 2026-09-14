import '../styles/Quote.css'

export default function Quote({
  texto = 'Un recuerdo inolvidable se crea al compartirlo con vos.',
}) {
  return (
    <section className="section quote-section fade-up alignfull" data-aos="fade-up" data-aos-duration="600" data-aos-easing="ease-out" data-aos-once="true">
      <hr className="divider" />
      <h3 className="quote__text">{texto}</h3>
      <hr className="divider" />
    </section>
  )
}