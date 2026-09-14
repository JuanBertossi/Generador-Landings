import heroImg from './shared/assets/hero/hero.webp'
import heroBackImg from './shared/assets/hero/hero-back.webp'
import pqDuenoFlota from './shared/assets/para-quien/pq-dueno-flota.webp'
import pqIntermediarios from './shared/assets/para-quien/pq-intermediarios.webp'
import fkChoferes from './shared/assets/funcionalidades/fk-choferes.webp'
import fkAdelantos from './shared/assets/funcionalidades/fk-adelantos.webp'

export interface NavLink {
  href: string
  label: string
}

export interface TarjetaTexto {
  titulo: string
  descripcion: string
  bullets: string[]
}

export interface TarjetaFoto {
  badge: string
  foto: string
}

export interface Beneficio {
  icono: string
  titulo: string
  /** Soporta **negrita** para resaltar palabras clave */
  cuerpo: string
}

export interface Funcionalidad {
  navLabel: string
  chipIcono: string
  chipLabel: string
  titulo: string
  descripcion: string
  foto: string
}

export interface FaqItem {
  pregunta: string
  respuesta: string
}

export interface LandingFleepixConfig {
  identidad: {
    nombreEmpresa: string
    /** Vacío = usa el logo de ejemplo de la plantilla */
    logoUrl: string
  }
  /** Colores de todo el sitio — se aplican como variables CSS en la raíz, se propagan solas */
  apariencia: {
    colorFondo: string
    colorTexto: string
    colorAcento: string
  }
  navLinks: NavLink[]
  navCtaLabel: string
  whatsappNumero: string
  whatsappMensajeDemo: string
  hero: {
    eyebrow: string
    /** Usa ==texto== para la parte destacada con el subrayado animado */
    titulo: string
    descripcion: string
    cta1Label: string
    cta2Label: string
    fotoPrincipal: string
    fotoSecundaria: string
  }
  paraQuien: {
    eyebrow: string
    titulo: string
    descripcion: string
    tarjetaTexto1: TarjetaTexto
    tarjetaFoto1: TarjetaFoto
    tarjetaFoto2: TarjetaFoto
    tarjetaTexto2: TarjetaTexto
  }
  beneficios: {
    eyebrow: string
    /** Usa ==texto== para la parte destacada con el subrayado animado */
    titulo: string
    descripcion: string
    items: Beneficio[]
  }
  funcionalidades: {
    eyebrow: string
    titulo: string
    descripcion: string
    items: Funcionalidad[]
  }
  faq: {
    eyebrow: string
    titulo: string
    descripcion: string
    ctaLabel: string
    items: FaqItem[]
  }
  contactoSeccion: {
    eyebrow: string
    titulo: string
    descripcion: string
    bullets: string[]
    botonEnviar: string
    mensajeExito: string
  }
  footer: {
    descripcion: string
    contacto: {
      email: string
      whatsappNumero: string
      whatsappTexto: string
      direccion: string
    }
    mostrarBloqueDesarrolloAMedida: boolean
    mensajeWhatsappDesarrolloAMedida: string
    redes: {
      instagram: string
      linkedin: string
      facebook: string
    }
    copyrightTexto: string
    /** "Un producto de GoodApps" + logo — atribución de la plataforma, no del cliente */
    mostrarSelloGoodApps: boolean
  }
  /** Mostrar/ocultar bloques completos de la landing. Opcional — páginas
   * publicadas antes de esto no tienen este campo, así que en LandingPage se
   * lee con `?.` y default `true` (mostrado) si falta. */
  secciones?: {
    paraQuien: boolean
    beneficios: boolean
    funcionalidades: boolean
    faq: boolean
    contacto: boolean
  }
}

export const fleepixDefaultConfig: LandingFleepixConfig = {
  identidad: {
    nombreEmpresa: 'Fleepix',
    logoUrl: '',
  },
  apariencia: {
    colorFondo: '#f7f7f7',
    colorTexto: '#002534',
    colorAcento: '#0093d1',
  },
  navLinks: [
    { href: '#para-quien', label: '¿Para quién?' },
    { href: '#beneficios', label: 'Beneficios' },
    { href: '#funcionalidades', label: 'Funcionalidades' },
    { href: '#faq', label: 'Preguntas' },
  ],
  navCtaLabel: 'Solicitar Demo',
  whatsappNumero: '00000000000',
  whatsappMensajeDemo: 'Hola! Quiero solicitar una demo de Fleepix.',
  hero: {
    eyebrow: 'Plataforma logística para el transporte',
    titulo: 'El ==control total== de tu logística, desde la carga inicial hasta el balance final.',
    descripcion:
      'Un nuevo ecosistema que conecta la operación en ruta con la administración contable. Diseñado para transportistas y operadores logísticos que buscan eficiencia real sin planillas Excel.',
    cta1Label: 'Solicitar Demo',
    cta2Label: 'Ver Video Demo',
    fotoPrincipal: heroImg,
    fotoSecundaria: heroBackImg,
  },
  paraQuien: {
    eyebrow: '¿Para quién?',
    titulo: 'A quién está dirigido',
    descripcion:
      'Cada módulo se adapta al rol operativo para ordenar procesos críticos y acelerar la toma de decisiones.',
    tarjetaTexto1: {
      titulo: 'Control de Activos',
      descripcion:
        'Centraliza validación CNRT/AFIP, alertas de VTV, seguros y consumo de combustible para evitar riesgos operativos.',
      bullets: ['Validación CNRT/AFIP', 'Alertas VTV y seguros', 'Gestión de combustible'],
    },
    tarjetaFoto1: { badge: 'Para Dueños de Flota', foto: pqDuenoFlota },
    tarjetaFoto2: { badge: 'Para Intermediarios y Forwarders', foto: pqIntermediarios },
    tarjetaTexto2: {
      titulo: 'Cerebro Logístico',
      descripcion: 'Orquesta viajes, cupos de cosecha y control documental en un solo flujo.',
      bullets: ['Asignación de viajes', 'Gestión de cupos de cosecha', 'Control documental conforme'],
    },
  },
  beneficios: {
    eyebrow: 'Beneficios',
    titulo: 'Por qué elegir ==Fleepix==',
    descripcion: 'Beneficios diseñados para asegurar tu rentabilidad y darte el control total.',
    items: [
      {
        icono: 'panel',
        titulo: 'Control total 360°',
        cuerpo:
          'De la ruta al balance, sin escalas. Sincronizá el estado de tus camiones con la administración contable **en tiempo real**. Eliminá los llamados innecesarios y **centralizá toda tu operación** en una sola pantalla.',
      },
      {
        icono: 'ahorro',
        titulo: 'Rentabilidad blindada',
        cuerpo:
          'Cuidá cada kilo, optimizá cada litro. Detectá **mermas de carga al instante** y gestioná adelantos de combustible con **validación automática**. Maximizá tus márgenes eliminando fugas de capital.',
      },
      {
        icono: 'documentos',
        titulo: 'Gestión sin papeles',
        cuerpo:
          'Tu compliance en piloto automático. **Sincronización directa con AFIP (CTG)** y alertas de vencimientos (VTV, CNRT). Emití liquidaciones y facturas MiPyME **con un solo clic**, sin errores ni olvidos.',
      },
    ],
  },
  funcionalidades: {
    eyebrow: 'Funcionalidades',
    titulo: 'Funcionalidades Clave',
    descripcion:
      'Un ecosistema ágil y flexible que conecta documentos, operaciones y finanzas en una sola capa de control.',
    items: [
      {
        navLabel: 'Sincronización AFIP (CTG)',
        chipIcono: 'integracion',
        chipLabel: 'Integración',
        titulo: 'Sincronización AFIP (CTG)',
        descripcion: 'Captura automática de datos para eliminar carga manual y reducir errores críticos.',
        foto: fkChoferes,
      },
      {
        navLabel: 'Liquidación Inteligente',
        chipIcono: 'finanzas',
        chipLabel: 'Finanzas',
        titulo: 'Liquidación Inteligente',
        descripcion: 'Calcula fletes, diferencias de kilos y ajustes en segundos con trazabilidad.',
        foto: fkAdelantos,
      },
      {
        navLabel: 'App para Choferes',
        chipIcono: 'ruta',
        chipLabel: 'Operación en ruta',
        titulo: 'App para Choferes',
        descripcion: 'Digitaliza cartas de porte, tickets y eventos en ruta desde el celular.',
        foto: fkChoferes,
      },
      {
        navLabel: 'Seguridad Financiera',
        chipIcono: 'seguridad',
        chipLabel: 'Compliance',
        titulo: 'Seguridad Financiera',
        descripcion: 'Valida BCRA, Factura MiPyME y actores clave antes de cada operación.',
        foto: fkAdelantos,
      },
      {
        navLabel: 'Alertas de Cumplimiento',
        chipIcono: 'alertas',
        chipLabel: 'Alertas',
        titulo: 'Alertas de Cumplimiento',
        descripcion: 'Detecta desvíos documentales y vencimientos con alertas proactivas.',
        foto: fkChoferes,
      },
      {
        navLabel: 'Adelantos y Combustible',
        chipIcono: 'combustible',
        chipLabel: 'Gastos',
        titulo: 'Adelantos y Combustible',
        descripcion: 'Administra anticipos, consumos y rendiciones en tiempo real.',
        foto: fkAdelantos,
      },
    ],
  },
  faq: {
    eyebrow: 'Preguntas',
    titulo: 'Resolvemos todas tus dudas',
    descripcion: '¿Todavía tenés dudas? Estas respuestas te van a ayudar a decidir.',
    ctaLabel: 'Solicitar Demo',
    items: [
      {
        pregunta: '¿Cómo funciona la carga automática vía CTG?',
        respuesta:
          'Fleepix sincroniza con AFIP y precompleta los datos operativos para que tu equipo valide y opere sin duplicar tareas.',
      },
      {
        pregunta: '¿Puedo controlar terceros y transportistas externos?',
        respuesta:
          'Sí. La plataforma valida estado documental y fiscal de terceros, y genera alertas de riesgo antes de asignar viajes.',
      },
      {
        pregunta: '¿Cómo gestionan adelantos de combustible?',
        respuesta:
          'Registrás adelantos por viaje o chofer, con trazabilidad de consumo y conciliación para administración y liquidación.',
      },
      {
        pregunta: '¿Qué pasa con la diferencia de kilos en liquidación?',
        respuesta:
          'El liquidador inteligente compara origen/destino, aplica reglas de negocio y deja auditoría completa de cada ajuste.',
      },
      {
        pregunta: '¿Se integra con mi circuito administrativo-contable?',
        respuesta:
          'Sí. Fleepix conecta operación en ruta con administración, exportando datos listos para conciliación y cierre.',
      },
      {
        pregunta: '¿Qué nivel de seguridad hay para validar cheques?',
        respuesta:
          'Se incluyen controles financieros y validaciones previas para reducir fraude y evitar aceptar instrumentos de alto riesgo.',
      },
    ],
  },
  contactoSeccion: {
    eyebrow: 'Contactanos',
    titulo: 'Comenzá a ordenar tu empresa',
    descripcion: 'Dejanos tus datos y un especialista en logística se comunica con vos.',
    bullets: ['Demo personalizada', 'Sin compromiso'],
    botonEnviar: 'Enviar Solicitud',
    mensajeExito: '¡Gracias! Te vamos a contactar a la brevedad.',
  },
  footer: {
    descripcion:
      'La plataforma logística que conecta la operación en ruta con la administración contable. Control total, del CTG al balance final.',
    contacto: {
      email: 'contacto@fleepix.com',
      whatsappNumero: '00000000000',
      whatsappTexto: '+54 9 00 0000-0000',
      direccion: 'Argentina',
    },
    mostrarBloqueDesarrolloAMedida: false,
    mensajeWhatsappDesarrolloAMedida: '',
    redes: {
      instagram: '',
      linkedin: '',
      facebook: '',
    },
    copyrightTexto: '© 2026 Fleepix. Todos los derechos reservados',
    mostrarSelloGoodApps: false,
  },
  secciones: {
    paraQuien: true,
    beneficios: true,
    funcionalidades: true,
    faq: true,
    contacto: true,
  },
}

export const fleepixBlankConfig: LandingFleepixConfig = {
  identidad: { nombreEmpresa: '', logoUrl: '' },
  apariencia: {
    colorFondo: '#f7f7f7',
    colorTexto: '#002534',
    colorAcento: '#0093d1',
  },
  navLinks: [
    { href: '#para-quien', label: '¿Para quién?' },
    { href: '#beneficios', label: 'Beneficios' },
    { href: '#funcionalidades', label: 'Funcionalidades' },
    { href: '#faq', label: 'Preguntas' },
  ],
  navCtaLabel: 'Contactanos',
  whatsappNumero: '',
  whatsappMensajeDemo: 'Hola! Quiero más información.',
  hero: {
    eyebrow: 'Escribí una frase corta que diga qué hacés',
    titulo: 'Título principal con ==una parte destacada==',
    descripcion: 'Un párrafo corto explicando el problema que resolvés y para quién es.',
    cta1Label: 'Contactanos',
    cta2Label: 'Ver más',
    fotoPrincipal: heroImg,
    fotoSecundaria: heroBackImg,
  },
  paraQuien: {
    eyebrow: '¿Para quién?',
    titulo: 'A quién está dirigido',
    descripcion: 'Describí brevemente los perfiles de cliente a los que apuntás.',
    tarjetaTexto1: {
      titulo: 'Título del primer perfil',
      descripcion: 'Descripción corta de este perfil de cliente.',
      bullets: ['Punto clave 1', 'Punto clave 2', 'Punto clave 3'],
    },
    tarjetaFoto1: { badge: 'Nombre del segundo perfil', foto: pqDuenoFlota },
    tarjetaFoto2: { badge: 'Nombre del tercer perfil', foto: pqIntermediarios },
    tarjetaTexto2: {
      titulo: 'Título del cuarto perfil',
      descripcion: 'Descripción corta de este perfil de cliente.',
      bullets: ['Punto clave 1', 'Punto clave 2', 'Punto clave 3'],
    },
  },
  beneficios: {
    eyebrow: 'Beneficios',
    titulo: 'Por qué elegir ==tu marca==',
    descripcion: 'Resumen corto de los beneficios principales.',
    items: [
      { icono: 'panel', titulo: 'Beneficio 1', cuerpo: 'Explicá este beneficio en dos o tres líneas.' },
      { icono: 'ahorro', titulo: 'Beneficio 2', cuerpo: 'Explicá este beneficio en dos o tres líneas.' },
      { icono: 'documentos', titulo: 'Beneficio 3', cuerpo: 'Explicá este beneficio en dos o tres líneas.' },
    ],
  },
  funcionalidades: {
    eyebrow: 'Funcionalidades',
    titulo: 'Funcionalidades Clave',
    descripcion: 'Resumen corto de lo que puede hacer tu producto o servicio.',
    items: [
      { navLabel: 'Funcionalidad 1', chipIcono: 'integracion', chipLabel: 'Categoría', titulo: 'Funcionalidad 1', descripcion: 'Descripción corta.', foto: fkChoferes },
      { navLabel: 'Funcionalidad 2', chipIcono: 'finanzas', chipLabel: 'Categoría', titulo: 'Funcionalidad 2', descripcion: 'Descripción corta.', foto: fkAdelantos },
      { navLabel: 'Funcionalidad 3', chipIcono: 'ruta', chipLabel: 'Categoría', titulo: 'Funcionalidad 3', descripcion: 'Descripción corta.', foto: fkChoferes },
      { navLabel: 'Funcionalidad 4', chipIcono: 'seguridad', chipLabel: 'Categoría', titulo: 'Funcionalidad 4', descripcion: 'Descripción corta.', foto: fkAdelantos },
      { navLabel: 'Funcionalidad 5', chipIcono: 'alertas', chipLabel: 'Categoría', titulo: 'Funcionalidad 5', descripcion: 'Descripción corta.', foto: fkChoferes },
      { navLabel: 'Funcionalidad 6', chipIcono: 'combustible', chipLabel: 'Categoría', titulo: 'Funcionalidad 6', descripcion: 'Descripción corta.', foto: fkAdelantos },
    ],
  },
  faq: {
    eyebrow: 'Preguntas',
    titulo: 'Resolvemos todas tus dudas',
    descripcion: '¿Todavía tenés dudas? Estas respuestas te van a ayudar a decidir.',
    ctaLabel: 'Contactanos',
    items: [
      { pregunta: '¿Pregunta frecuente 1?', respuesta: 'Respuesta corta.' },
      { pregunta: '¿Pregunta frecuente 2?', respuesta: 'Respuesta corta.' },
      { pregunta: '¿Pregunta frecuente 3?', respuesta: 'Respuesta corta.' },
    ],
  },
  contactoSeccion: {
    eyebrow: 'Contactanos',
    titulo: 'Hablemos de tu proyecto',
    descripcion: 'Dejanos tus datos y te contactamos a la brevedad.',
    bullets: ['Respuesta rápida', 'Sin compromiso'],
    botonEnviar: 'Enviar Solicitud',
    mensajeExito: '¡Gracias! Te vamos a contactar a la brevedad.',
  },
  footer: {
    descripcion: 'Descripción corta de tu empresa para el pie de página.',
    contacto: { email: '', whatsappNumero: '', whatsappTexto: '', direccion: '' },
    mostrarBloqueDesarrolloAMedida: false,
    mensajeWhatsappDesarrolloAMedida: '',
    redes: { instagram: '', linkedin: '', facebook: '' },
    copyrightTexto: '© 2026 Todos los derechos reservados',
    mostrarSelloGoodApps: false,
  },
  secciones: {
    paraQuien: true,
    beneficios: true,
    funcionalidades: true,
    faq: true,
    contacto: true,
  },
}
