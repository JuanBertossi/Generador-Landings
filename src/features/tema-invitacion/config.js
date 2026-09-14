import fotoPrincipalDefault from './assets/images/Hero-Image.png'
import fotoCuandoDefault from './assets/gifs/calendario.gif'
import fotoDondeDefault from './assets/gifs/bola-fiesta.gif'
import fondoFooterDefault from './assets/images/fuegos-artificiales.png'
import fotoRsvpDefault from './assets/gifs/mensaje.gif'

/**
 * Config del tema Invitación. Esto es lo que en el generador va a llenar
 * cada usuario con un formulario — acá viven los datos reales del ejemplo
 * (86 años de Miro) como default, para que el ejemplo siga funcionando igual.
 */
export const invitacionDefaultConfig = {
  apariencia: {
    colorFondo: '#f0f5fb',
    colorTexto: '#1a2a3a',
    colorAcento: '#6b93c4',
  },

  anfitrion: {
    nombre: 'MIRO',
    eyebrow: '86 AÑOS', // ej: "86 AÑOS", "SE CASAN", "BABY SHOWER DE"
  },

  bienvenida: {
    subtitulo:
      'Hay momentos en la vida que son únicos e inolvidables.\nEste es uno de ellos.',
    youtubeVideoId: 'mQmOZX-8EZI',
  },

  tituloDestacado: 'MIS 86\nMIRO',

  evento: {
    fechaHoraISO: '2026-03-23T21:30:00',
    lugarNombre: 'La Casona del Francés',
    lugarMapsLink:
      'https://www.google.com/maps/place/La+Casona+del+Frances/@-31.5414893,-63.5297996,18z/data=!4m6!3m5!1s0x94332b7d8828b98d:0x1e669b9dfece4466!8m2!3d-31.5415187!4d-63.5294081!16s%2Fg%2F11vbsm7_jd?hl=es&entry=ttu&g_ep=EgoyMDI2MDIyNC4wIKXMDSoASAFQAw%3D%3D',
  },

  frase: 'Un recuerdo inolvidable se crea al compartirlo con vos.',

  rsvp: {
    telefonoWhatsapp: '00000000000',
    mensajePlantilla: 'Hola! Confirmo mi asistencia al cumple de {nombre}',
    fechaLimiteISO: '2026-03-16',
    fotoMensaje: fotoRsvpDefault,
  },

  footer: {
    titulo: 'TE ESPERO',
    fotoFondo: fondoFooterDefault,
  },

  precios: [
    { categoria: 'Mayores', precio: '$50.000' },
    { categoria: 'Menores (4 a 12 años)', precio: '$28.000' },
  ],

  fotoPrincipal: fotoPrincipalDefault,
  fotoCuando: fotoCuandoDefault,
  fotoDonde: fotoDondeDefault,

  // Textos fijos de la interfaz (botones, títulos de sección) — editables
  // para poder adaptar el tono (cumpleaños vs casamiento vs baby shower).
  textos: {
    botonIngresar: 'INGRESAR',
    labelCuando: '¿CUÁNDO?',
    labelDonde: '¿DÓNDE?',
    botonComoLlegar: 'CÓMO LLEGAR',
    labelConfirmar: 'CONFIRMÁ TU ASISTENCIA',
    botonVerValor: 'VER VALOR TARJETA',
    botonVoyAsistir: 'VOY A ASISTIR',
    botonNoAsistir: 'NO VOY A PODER IR',
    tituloValorTarjeta: 'VALOR TARJETA',
    notaPago: 'La tarjeta se abona en el salón sólo en efectivo',
  },
}

/** Punto de partida para el formulario de creación — vacío/genérico, no los datos de Miro. */
export const invitacionBlankConfig = {
  apariencia: {
    colorFondo: '#f0f5fb',
    colorTexto: '#1a2a3a',
    colorAcento: '#6b93c4',
  },

  anfitrion: {
    nombre: '',
    eyebrow: '15 AÑOS',
  },
  bienvenida: {
    subtitulo: 'Hay momentos en la vida que son únicos e inolvidables.\nEste es uno de ellos.',
    youtubeVideoId: '',
  },
  tituloDestacado: '',
  evento: {
    fechaHoraISO: '',
    lugarNombre: '',
    lugarMapsLink: '',
  },
  frase: '',
  rsvp: {
    telefonoWhatsapp: '',
    mensajePlantilla: 'Hola! Confirmo mi asistencia a la fiesta de {nombre}',
    fechaLimiteISO: '',
    // Gif genérico de fiesta, no una foto de la persona — se puede dejar
    // el default sin que la invitación "se note copiada" (a diferencia de
    // fotoPrincipal, que sí es la foto real del festejado).
    fotoMensaje: fotoRsvpDefault,
  },
  footer: {
    titulo: 'TE ESPERO',
    fotoFondo: fondoFooterDefault,
  },
  precios: [{ categoria: 'General', precio: '' }],
  fotoPrincipal: '',
  fotoCuando: fotoCuandoDefault,
  fotoDonde: fotoDondeDefault,
  textos: {
    botonIngresar: 'INGRESAR',
    labelCuando: '¿CUÁNDO?',
    labelDonde: '¿DÓNDE?',
    botonComoLlegar: 'CÓMO LLEGAR',
    labelConfirmar: 'CONFIRMÁ TU ASISTENCIA',
    botonVerValor: 'VER VALOR TARJETA',
    botonVoyAsistir: 'VOY A ASISTIR',
    botonNoAsistir: 'NO VOY A PODER IR',
    tituloValorTarjeta: 'VALOR TARJETA',
    notaPago: 'La tarjeta se abona en el salón sólo en efectivo',
  },
}
