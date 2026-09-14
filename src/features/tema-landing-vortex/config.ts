export interface VortexNavLink {
  href: string
  label: string
}

export interface VortexItemTexto {
  icono: string
  titulo: string
  descripcion: string
}

export interface VortexProducto {
  titulo: string
  destacado: string
  descripcion: string
  tags: string[]
  ctaLabel: string
  foto: string
}

export interface VortexAgente {
  titulo: string
  descripcion: string
}

export interface VortexServicio {
  titulo: string
  subtitulo: string
  descripcion: string
  ctaLabel: string
  foto: string
}

export interface VortexPaso {
  icono: string
  numero: string
  titulo: string
  descripcion: string
}

export interface VortexBeneficio {
  titulo: string
  subtitulo: string
  valor: string
}

export interface VortexCaso {
  tag: string
  titulo: string
  descripcion: string
  /** Logo del cliente del caso — opcional, si no se sube se muestra un placeholder. */
  logoUrl?: string
}

export interface VortexFaqItem {
  pregunta: string
  respuesta: string
}

export interface VortexConfig {
  identidad: { nombreEmpresa: string; logoUrl: string }
  /** Fondo, texto y acento principal (verde). El violeta secundario queda fijo. */
  apariencia: { colorFondo: string; colorTexto: string; colorAcento: string }
  whatsappNumero: string
  whatsappMensaje: string
  whatsappTooltip: string
  bannerTexto: string
  navLinks: VortexNavLink[]
  navCtaLabel: string
  hero: {
    badge: string
    /** usa ==texto== para la parte con gradiente */
    titulo: string
    descripcion: string
    ctaLabel: string
    /** 'tunel' = animación 3D fija de la plantilla. 'imagen'/'video' = archivo elegido por el usuario en fondoUrl. */
    fondoTipo: 'tunel' | 'imagen' | 'video'
    fondoUrl: string
  }
  problem: {
    eyebrow: string
    titulo: string
    descripcion: string
    items: VortexItemTexto[]
    ctaLabel: string
  }
  products: {
    eyebrow: string
    titulo: string
    descripcion: string
    subtitulo: string
    subdescripcion: string
    producto1: VortexProducto
    producto2: VortexProducto
    agentes: VortexAgente[]
  }
  services: {
    eyebrow: string
    descripcion: string
    items: VortexServicio[]
  }
  process: {
    eyebrow: string
    titulo: string
    descripcion: string
    items: VortexPaso[]
    ctaLabel: string
  }
  benefitsExtra: {
    tituloLinea1: string
    tituloLinea2: string
    items: VortexBeneficio[]
  }
  testimonials: {
    eyebrow: string
    titulo: string
    descripcion: string
    items: VortexCaso[]
    ctaLabel: string
  }
  faq: {
    eyebrow: string
    titulo: string
    items: VortexFaqItem[]
    ctaPregunta: string
    ctaLabel: string
  }
  finalCta: {
    /** dos líneas separadas por \n, cada una admite ==destacado== */
    titulo: string
    descripcion: string
    ctaLabel: string
  }
  footer: {
    descripcion: string
    tituloNavegacion: string
    tituloContacto: string
    contacto: { email: string; whatsappNumero: string; whatsappTexto: string; direccion: string }
    copyrightTexto: string
  }
  /** Mostrar/ocultar bloques completos de la landing. Opcional — páginas
   * publicadas antes de esto no tienen este campo, así que en VortexPage se
   * lee con `?.` y default `true` (mostrado) si falta. */
  secciones?: {
    beneficios: boolean
    soluciones: boolean
    servicios: boolean
    comoEmpezar: boolean
    beneficiosExtra: boolean
    casos: boolean
    preguntas: boolean
    ctaFinal: boolean
  }
}

const MENSAJE_DEMO = '¡Hola! Me interesa conocer más sobre Vortex y cómo puede ayudar a mi empresa.'

const NAV_LINKS: VortexNavLink[] = [
  { href: 'beneficios', label: 'Beneficios' },
  { href: 'soluciones', label: 'Soluciones' },
  { href: 'cómo-empezar', label: 'Cómo Empezar' },
  { href: 'casos', label: 'Casos de éxito' },
  { href: 'preguntas-frecuentes', label: 'Preguntas' },
]

export const vortexDefaultConfig: VortexConfig = {
  identidad: { nombreEmpresa: 'Vortex', logoUrl: '' },
  apariencia: { colorFondo: '#07070e', colorTexto: '#ffffff', colorAcento: '#00ff88' },
  whatsappNumero: '00000000000',
  whatsappMensaje: MENSAJE_DEMO,
  whatsappTooltip: '¿En qué puedo ayudarte?',
  bannerTexto: '⚡ Esta landing fue creada con IA, como las soluciones que diseñamos para tu negocio',
  navLinks: NAV_LINKS,
  navCtaLabel: 'Comenzar Ahora',
  hero: {
    badge: 'Unidad de Inteligencia Artificial',
    titulo: 'La IA que impulsa ==la evolución== de tu empresa',
    descripcion:
      'Dejá de perder clientes por falta de tiempo o demoras. Implementamos agentes de IA que responden, venden, organizan y aprenden, sin pausas ni errores.',
    ctaLabel: 'Agendá una reunión gratuita',
    fondoTipo: 'tunel',
    fondoUrl: '',
  },
  problem: {
    eyebrow: 'Beneficios',
    titulo: 'Menos tareas, ==más crecimiento==',
    descripcion:
      'Responder las mismas consultas una y otra vez, atender reclamos, coordinar agendas, dar soporte… Ese tiempo se acumula. Y lo que perdés no es solo productividad, sino oportunidades. La inteligencia artificial viene a liberarte.',
    items: [
      {
        icono: 'actividad',
        titulo: 'IA viva y adaptable',
        descripcion: 'Agentes que aprenden de tu negocio y mejoran con cada interacción.',
      },
      {
        icono: 'rayo',
        titulo: 'Automatiza lo cotidiano',
        descripcion: 'Delegá tareas repetitivas y flujos manuales a tus agentes.',
      },
      {
        icono: 'crecimiento',
        titulo: 'Escala con tu negocio',
        descripcion: 'Crecé sin sumar complejidad: la IA escala tu operación sin fricción.',
      },
    ],
    ctaLabel: 'Quiero liberar mi tiempo y crecer',
  },
  products: {
    eyebrow: 'Soluciones',
    titulo: 'Lo que podés ==implementar hoy==',
    descripcion:
      'Creamos agentes vivos que aprenden, se adaptan y se integran a tu empresa. Creamos inteligencia que trabaja para vos.',
    subtitulo: 'Productos',
    subdescripcion: 'Agentes de IA listos para tu desafío',
    producto1: {
      titulo: 'Clon interno de gestión',
      destacado: 'Automatiza flujos internos, responde a tu equipo y conecta tus sistemas.',
      descripcion:
        'Elimina tareas repetitivas y conecta todos tus sistemas en una sola plataforma inteligente.',
      tags: ['Flujos internos', 'Equipo', 'Sistemas'],
      ctaLabel: 'Explorar Integraciones',
      foto: '',
    },
    producto2: {
      titulo: 'Clon digital de atención y ventas',
      destacado: 'Atiende, asesora y agenda 24/7 por WhatsApp, web o redes.',
      descripcion:
        'Tu asistente virtual que nunca duerme. Convierte visitantes en clientes y optimiza cada interacción.',
      tags: ['Reclamos', 'Consultas', 'Turneros'],
      ctaLabel: 'Ver Demo en Vivo',
      foto: '',
    },
    agentes: [
      {
        titulo: 'Reclamos',
        descripcion:
          'Recibe, registra y gestiona reclamos de clientes de forma automática. Clasifica el problema, responde con empatía y escala al equipo humano solo cuando es necesario.',
      },
      {
        titulo: 'Consultas',
        descripcion:
          'Responde preguntas frecuentes sobre productos, precios y procesos. Disponible 24/7, sin tiempos de espera, con respuestas basadas en el conocimiento real de tu negocio.',
      },
      {
        titulo: 'Turnero',
        descripcion:
          'Gestiona agendas y reservas en tiempo real. El cliente elige horario, confirma turno y recibe recordatorios automáticos. Sin llamadas, sin turnos perdidos.',
      },
    ],
  },
  services: {
    eyebrow: 'Servicios',
    descripcion: 'Más que tecnología, acompañamiento personalizado',
    items: [
      {
        titulo: 'Desarrollo a medida',
        subtitulo: 'Creamos tus propios agentes y pipelines de IA',
        descripcion:
          'Soluciones personalizadas que se adaptan perfectamente a los procesos únicos de tu empresa.',
        ctaLabel: 'Solicitar Propuesta',
        foto: '',
      },
      {
        titulo: 'Consultoría estratégica',
        subtitulo: 'Definimos tu roadmap de automatización',
        descripcion:
          'Te guiamos paso a paso para implementar IA de forma estratégica y obtener resultados reales.',
        ctaLabel: 'Agendar Consultoría',
        foto: '',
      },
      {
        titulo: 'Capacitación para equipos y software factories',
        subtitulo: 'Formamos a tu equipo para el mañana',
        descripcion:
          'Programas prácticos para que tu equipo domine las herramientas de IA y automatización.',
        ctaLabel: 'Ver Programas',
        foto: '',
      },
    ],
  },
  process: {
    eyebrow: 'Cómo empezar',
    titulo: 'Transformar tu negocio es ==más simple de lo que pensás==',
    descripcion:
      'Abordamos cada proyecto con una mirada estratégica. Escuchamos tu necesidad, analizamos tus procesos, entendemos tu negocio y diseñamos soluciones de IA reales, escalables y a medida para vos.',
    items: [
      {
        icono: 'equipo',
        numero: '01',
        titulo: 'Reunión de descubrimiento (gratuita)',
        descripcion:
          'Analizamos tu negocio, procesos actuales y objetivos específicos para identificar las mejores oportunidades de automatización.',
      },
      {
        icono: 'buscar',
        numero: '02',
        titulo: 'Diagnóstico y propuesta personalizada',
        descripcion:
          'Creamos un roadmap específico con arquitectura técnica, cronograma detallado, inversión requerida y ROI proyectado.',
      },
      {
        icono: 'codigo',
        numero: '03',
        titulo: 'Desarrollo y entrenamiento de tu agente de IA',
        descripcion:
          'Construimos y entrenamos tus agentes de IA personalizados con los datos, procesos y requerimientos específicos de tu empresa.',
      },
      {
        icono: 'cohete',
        numero: '04',
        titulo: 'Lanzamiento, monitoreo y evolución continua',
        descripcion:
          'Implementación gradual con supervisión 24/7, soporte técnico dedicado y optimización continua basada en métricas reales.',
      },
    ],
    ctaLabel: 'Agendá una reunión gratuita',
  },
  benefitsExtra: {
    tituloLinea1: 'No es solo IA',
    tituloLinea2: 'Es ==libertad, foco y crecimiento==',
    items: [
      { titulo: 'Tiempo real', subtitulo: 'Para lo que más importa.', valor: '+75%' },
      { titulo: 'Inteligencia estratégica', subtitulo: 'IA que analiza y decide.', valor: '+24/7' },
      { titulo: 'Escalabilidad', subtitulo: 'Crecé sin aumentar el caos.', valor: '+90%' },
      { titulo: 'Paz mental', subtitulo: 'Tu negocio sigue, incluso cuando vos no estás.', valor: '+99%' },
      { titulo: 'Menos errores operativos', subtitulo: 'Procesos perfectos, resultados consistentes.', valor: '-90%' },
      { titulo: 'Más productividad en tareas críticas', subtitulo: 'Tu equipo enfocado en lo que realmente importa.', valor: '+5.0x' },
    ],
  },
  testimonials: {
    eyebrow: 'Casos de éxito',
    titulo: 'Soluciones reales, ==resultados concretos==',
    descripcion: 'Proyectos reales, en producción, con resultados medibles.',
    items: [
      {
        tag: 'Retail',
        titulo: 'Análisis de datos y estrategia',
        descripcion:
          'Desarrollamos un agente de IA que recorre todo el ecosistema de datos de la empresa y analiza estadísticas, genera reportes y asiste en la toma de decisiones estratégicas.',
        logoUrl: '',
      },
      {
        tag: 'Turismo',
        titulo: 'Asistente turístico 24/7',
        descripcion:
          'Implementamos un agente que brinda información sobre actividades, alojamiento y productos turísticos con seguimiento en tiempo real y visualización de mapas interactivos.',
        logoUrl: '',
      },
      {
        tag: 'Membresías',
        titulo: 'Portal inteligente para socios',
        descripcion:
          'Creamos un agente de asistencia que conecta al socio con toda la información de su panel: estado de cuotas, deudas, eventos y más.',
        logoUrl: '',
      },
      {
        tag: 'Logística',
        titulo: 'Incorporación de personal con IA',
        descripcion:
          'Automatizamos el proceso de incorporación de choferes a la plataforma logística, desde la carga de datos hasta la habilitación final.',
        logoUrl: '',
      },
    ],
    ctaLabel: 'Hablemos de tu proyecto',
  },
  faq: {
    eyebrow: 'Preguntas',
    titulo: 'Resolvemos tus ==dudas==',
    items: [
      {
        pregunta: '¿Se integra con mis sistemas actuales?',
        respuesta:
          'Sí, Vortex está diseñado para integrarse con tus sistemas existentes. Trabajamos con APIs REST, bases de datos SQL/NoSQL, CRMs, ERPs y plataformas cloud.',
      },
      {
        pregunta: '¿Cuál es la inversión requerida?',
        respuesta:
          'La inversión depende del tipo de solución que necesite tu negocio. Cada proyecto se evalúa según su complejidad, alcance y objetivos.',
      },
      {
        pregunta: '¿Qué nivel de customización tiene?',
        respuesta:
          'Es completamente personalizable. Desde la interfaz hasta los algoritmos de IA, todo se adapta a tus necesidades específicas.',
      },
      {
        pregunta: '¿Qué pasa si la IA comete un error?',
        respuesta:
          'Minimizamos errores con un entrenamiento riguroso antes del lanzamiento, métricas de mejora continua y derivación a un humano cuando hace falta.',
      },
      {
        pregunta: '¿Cuánto tiempo lleva implementar una solución?',
        respuesta: 'Depende de la complejidad, pero un proyecto estándar se completa en 4 a 8 semanas.',
      },
      {
        pregunta: '¿Mis datos están seguros?',
        respuesta:
          'Absolutamente. Seguimos estrictos protocolos de seguridad para que tus datos sensibles nunca sean compartidos.',
      },
      {
        pregunta: '¿Funciona para mi industria?',
        respuesta: 'Cualquier industria con procesos repetitivos puede beneficiarse de la automatización inteligente.',
      },
    ],
    ctaPregunta: '¿No encontraste tu pregunta?',
    ctaLabel: 'Contactanos',
  },
  finalCta: {
    titulo: 'El cambio no se espera,\n==se construye==',
    descripcion: 'Empezá hoy a transformar tu negocio con inteligencia artificial que trabaja para vos.',
    ctaLabel: 'Agendá una reunión gratuita',
  },
  footer: {
    descripcion:
      'Inteligencia artificial que transforma empresas. Automatizamos procesos, optimizamos operaciones y liberamos el potencial de tu equipo.',
    tituloNavegacion: 'Navegación',
    tituloContacto: 'Contacto',
    contacto: {
      email: 'contacto@vortex.com',
      whatsappNumero: '00000000000',
      whatsappTexto: '+54 00 0000-0000',
      direccion: 'Argentina',
    },
    copyrightTexto: '© 2026 Vortex. Todos los derechos reservados.',
  },
  secciones: {
    beneficios: true,
    soluciones: true,
    servicios: true,
    comoEmpezar: true,
    beneficiosExtra: true,
    casos: true,
    preguntas: true,
    ctaFinal: true,
  },
}

export const vortexBlankConfig: VortexConfig = {
  identidad: { nombreEmpresa: '', logoUrl: '' },
  apariencia: { colorFondo: '#07070e', colorTexto: '#ffffff', colorAcento: '#00ff88' },
  whatsappNumero: '',
  whatsappMensaje: 'Hola! Quiero más información.',
  whatsappTooltip: '¿En qué puedo ayudarte?',
  bannerTexto: '',
  navLinks: NAV_LINKS,
  navCtaLabel: 'Contactanos',
  hero: {
    badge: 'Escribí una frase corta',
    titulo: 'Título principal con ==una parte destacada==',
    descripcion: 'Un párrafo corto explicando el problema que resolvés y para quién es.',
    ctaLabel: 'Contactanos',
    fondoTipo: 'imagen',
    fondoUrl: '',
  },
  problem: {
    eyebrow: 'Beneficios',
    titulo: 'Título con ==una parte destacada==',
    descripcion: 'Resumen corto de los beneficios principales.',
    items: [
      { icono: 'actividad', titulo: 'Beneficio 1', descripcion: 'Descripción corta.' },
      { icono: 'rayo', titulo: 'Beneficio 2', descripcion: 'Descripción corta.' },
      { icono: 'crecimiento', titulo: 'Beneficio 3', descripcion: 'Descripción corta.' },
    ],
    ctaLabel: 'Contactanos',
  },
  products: {
    eyebrow: 'Soluciones',
    titulo: 'Lo que podés ==ofrecer==',
    descripcion: 'Resumen corto de tu propuesta de valor.',
    subtitulo: 'Productos',
    subdescripcion: 'Descripción corta',
    producto1: {
      titulo: 'Producto 1',
      destacado: 'Frase destacada corta.',
      descripcion: 'Descripción del producto.',
      tags: ['Tag 1', 'Tag 2', 'Tag 3'],
      ctaLabel: 'Ver más',
      foto: '',
    },
    producto2: {
      titulo: 'Producto 2',
      destacado: 'Frase destacada corta.',
      descripcion: 'Descripción del producto.',
      tags: ['Tag 1', 'Tag 2', 'Tag 3'],
      ctaLabel: 'Ver más',
      foto: '',
    },
    agentes: [
      { titulo: 'Función 1', descripcion: 'Descripción corta.' },
      { titulo: 'Función 2', descripcion: 'Descripción corta.' },
      { titulo: 'Función 3', descripcion: 'Descripción corta.' },
    ],
  },
  services: {
    eyebrow: 'Servicios',
    descripcion: 'Descripción corta de tus servicios',
    items: [
      {
        titulo: 'Servicio 1',
        subtitulo: 'Subtítulo corto',
        descripcion: 'Descripción del servicio.',
        ctaLabel: 'Consultar',
        foto: '',
      },
      {
        titulo: 'Servicio 2',
        subtitulo: 'Subtítulo corto',
        descripcion: 'Descripción del servicio.',
        ctaLabel: 'Consultar',
        foto: '',
      },
      {
        titulo: 'Servicio 3',
        subtitulo: 'Subtítulo corto',
        descripcion: 'Descripción del servicio.',
        ctaLabel: 'Consultar',
        foto: '',
      },
    ],
  },
  process: {
    eyebrow: 'Cómo empezar',
    titulo: 'Es ==más simple de lo que pensás==',
    descripcion: 'Resumen corto de tu proceso de trabajo.',
    items: [
      { icono: 'equipo', numero: '01', titulo: 'Paso 1', descripcion: 'Descripción corta.' },
      { icono: 'buscar', numero: '02', titulo: 'Paso 2', descripcion: 'Descripción corta.' },
      { icono: 'codigo', numero: '03', titulo: 'Paso 3', descripcion: 'Descripción corta.' },
      { icono: 'cohete', numero: '04', titulo: 'Paso 4', descripcion: 'Descripción corta.' },
    ],
    ctaLabel: 'Contactanos',
  },
  benefitsExtra: {
    tituloLinea1: 'Título línea 1',
    tituloLinea2: 'Es ==destacado==',
    items: [
      { titulo: 'Beneficio 1', subtitulo: 'Subtítulo corto.', valor: '+00%' },
      { titulo: 'Beneficio 2', subtitulo: 'Subtítulo corto.', valor: '+00%' },
      { titulo: 'Beneficio 3', subtitulo: 'Subtítulo corto.', valor: '+00%' },
      { titulo: 'Beneficio 4', subtitulo: 'Subtítulo corto.', valor: '+00%' },
      { titulo: 'Beneficio 5', subtitulo: 'Subtítulo corto.', valor: '+00%' },
      { titulo: 'Beneficio 6', subtitulo: 'Subtítulo corto.', valor: '+00%' },
    ],
  },
  testimonials: {
    eyebrow: 'Casos de éxito',
    titulo: 'Resultados ==concretos==',
    descripcion: 'Resumen corto de tus casos de éxito.',
    items: [
      { tag: 'Rubro', titulo: 'Caso 1', descripcion: 'Descripción corta.', logoUrl: '' },
      { tag: 'Rubro', titulo: 'Caso 2', descripcion: 'Descripción corta.', logoUrl: '' },
    ],
    ctaLabel: 'Contactanos',
  },
  faq: {
    eyebrow: 'Preguntas',
    titulo: 'Preguntas ==frecuentes==',
    items: [
      { pregunta: '¿Pregunta frecuente 1?', respuesta: 'Respuesta corta.' },
      { pregunta: '¿Pregunta frecuente 2?', respuesta: 'Respuesta corta.' },
    ],
    ctaPregunta: '¿No encontraste tu pregunta?',
    ctaLabel: 'Contactanos',
  },
  finalCta: {
    titulo: 'El cambio no se espera,\n==se construye==',
    descripcion: 'Frase corta de cierre invitando a contactar.',
    ctaLabel: 'Contactanos',
  },
  footer: {
    descripcion: 'Descripción corta de tu empresa para el pie de página.',
    tituloNavegacion: 'Navegación',
    tituloContacto: 'Contacto',
    contacto: { email: '', whatsappNumero: '', whatsappTexto: '', direccion: '' },
    copyrightTexto: '© 2026 Todos los derechos reservados.',
  },
  secciones: {
    beneficios: true,
    soluciones: true,
    servicios: true,
    comoEmpezar: true,
    beneficiosExtra: true,
    casos: true,
    preguntas: true,
    ctaFinal: true,
  },
}
