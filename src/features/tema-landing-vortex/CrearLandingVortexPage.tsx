import { useState } from 'react'
import './styles/CrearLandingVortex.css'
import VortexPage from './views/VortexPage'
import { vortexBlankConfig, type VortexConfig } from './config'
import { ICONOS } from './lib/iconos'
import { setPath, getPath } from '@/shared/lib/objectPath'
import { slugify } from '@/shared/lib/slugify'
import { PRECIOS, formatoPrecio } from '@/shared/lib/precios'
import { usePaginaPersistida } from '@/shared/hooks/usePaginaPersistida'
import { subirArchivo, eliminarArchivo } from '@/shared/lib/subirArchivo'
import { urlPublicada, DOMINIO_BASE } from '@/shared/lib/dominio'
import { linkWhatsappSoporte } from '@/shared/lib/contacto'
import { Bookmark, CheckCircle2, Copy, Check, AlertCircle, Globe } from 'lucide-react'

const OPCIONES_ICONO = Object.keys(ICONOS)

function Field({
  label,
  path,
  config,
  onChange,
  textarea = false,
}: {
  label: string
  path: string
  config: VortexConfig
  onChange: (path: string, value: string) => void
  textarea?: boolean
}) {
  const value = (getPath(config, path) as string) ?? ''
  return (
    <div className="crear-vortex__field">
      <label htmlFor={path}>{label}</label>
      {textarea ? (
        <textarea id={path} value={value} onChange={(e) => onChange(path, e.target.value)} />
      ) : (
        <input id={path} type="text" value={value} onChange={(e) => onChange(path, e.target.value)} />
      )}
    </div>
  )
}

function CampoColor({
  label,
  path,
  config,
  onChange,
}: {
  label: string
  path: string
  config: VortexConfig
  onChange: (path: string, value: string) => void
}) {
  const value = (getPath(config, path) as string) ?? '#000000'
  return (
    <div className="crear-vortex__field">
      <label htmlFor={path}>{label}</label>
      <div className="crear-vortex__color-row">
        <input id={path} type="color" value={value} onChange={(e) => onChange(path, e.target.value)} />
        <input type="text" value={value} onChange={(e) => onChange(path, e.target.value)} />
      </div>
    </div>
  )
}

function CampoArchivo({
  label,
  path,
  onArchivoChange,
}: {
  label: string
  path: string
  onArchivoChange: (path: string, file: File) => void
}) {
  return (
    <div className="crear-vortex__field">
      <label>{label}</label>
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onArchivoChange(path, file)
        }}
      />
    </div>
  )
}

export default function CrearLandingVortexPage() {
  const { config, setConfig, cargando, guardando, error, publicar } = usePaginaPersistida(
    'landing-vortex',
    vortexBlankConfig,
    '/crear/landing-vortex',
  )
  const [resultado, setResultado] = useState<{ slug: string; url: string } | null>(null)
  const [publicando, setPublicando] = useState(false)
  const [errorPublicar, setErrorPublicar] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const linkEdicion = typeof window !== 'undefined' ? window.location.href : ''

  function handleCopiarLink() {
    navigator.clipboard.writeText(linkEdicion).then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    })
  }

  function handleChange(path: string, value: string) {
    setConfig((prev) => setPath(prev, path, value))
  }

  function handleArchivoChange(path: string, file: File) {
    const anterior = getPath(config, path) as string | undefined
    setConfig((prev) => setPath(prev, path, URL.createObjectURL(file)))
    subirArchivo(file)
      .then((url) => {
        setConfig((prev) => setPath(prev, path, url))
        eliminarArchivo(anterior)
      })
      .catch(() => {
        setConfig((prev) => setPath(prev, path, anterior ?? ''))
        setErrorPublicar('No pudimos subir el archivo. Probá de nuevo.')
      })
  }

  async function handleGenerar() {
    if (!config.identidad.nombreEmpresa.trim()) {
      setErrorPublicar('Falta el nombre de tu empresa.')
      return
    }
    setPublicando(true)
    setErrorPublicar(null)
    let slug = slugify(config.identidad.nombreEmpresa)
    try {
      try {
        await publicar(slug, PRECIOS['landing-vortex'])
      } catch {
        slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`
        await publicar(slug, PRECIOS['landing-vortex'])
      }
      setResultado({ slug, url: urlPublicada(slug) })
    } catch {
      setErrorPublicar('No pudimos publicar tu landing. Probá de nuevo en un momento.')
    } finally {
      setPublicando(false)
    }
  }

  // --- Beneficios (problem, 3 items fijos) ---
  function handleProblemItem(i: number, campo: 'icono' | 'titulo' | 'descripcion', value: string) {
    setConfig((prev) => {
      const items = [...prev.problem.items]
      items[i] = { ...items[i], [campo]: value }
      return { ...prev, problem: { ...prev.problem, items } }
    })
  }

  // --- Producto 1 / 2 ---
  function handleProductoCampo(cual: 'producto1' | 'producto2', campo: 'titulo' | 'destacado' | 'descripcion' | 'ctaLabel', value: string) {
    setConfig((prev) => ({ ...prev, products: { ...prev.products, [cual]: { ...prev.products[cual], [campo]: value } } }))
  }
  function handleProductoTag(cual: 'producto1' | 'producto2', i: number, value: string) {
    setConfig((prev) => {
      const tags = [...prev.products[cual].tags]
      tags[i] = value
      return { ...prev, products: { ...prev.products, [cual]: { ...prev.products[cual], tags } } }
    })
  }

  // --- Agentes (3 fijos) ---
  function handleAgenteCampo(i: number, campo: 'titulo' | 'descripcion', value: string) {
    setConfig((prev) => {
      const agentes = [...prev.products.agentes]
      agentes[i] = { ...agentes[i], [campo]: value }
      return { ...prev, products: { ...prev.products, agentes } }
    })
  }

  // --- Servicios (3 fijos) ---
  function handleServicioCampo(i: number, campo: 'titulo' | 'subtitulo' | 'descripcion' | 'ctaLabel', value: string) {
    setConfig((prev) => {
      const items = [...prev.services.items]
      items[i] = { ...items[i], [campo]: value }
      return { ...prev, services: { ...prev.services, items } }
    })
  }
  function handleServicioVideo(i: number, file: File) {
    const anterior = config.services.items[i]?.video
    const aplicar = (url: string) =>
      setConfig((prev) => {
        const items = [...prev.services.items]
        items[i] = { ...items[i], video: url }
        return { ...prev, services: { ...prev.services, items } }
      })
    aplicar(URL.createObjectURL(file))
    subirArchivo(file)
      .then((url) => {
        aplicar(url)
        eliminarArchivo(anterior)
      })
      .catch(() => {
        if (anterior) aplicar(anterior)
        setErrorPublicar('No pudimos subir el archivo. Probá de nuevo.')
      })
  }

  // --- Proceso (4 fijos) ---
  function handleProcesoCampo(i: number, campo: 'icono' | 'numero' | 'titulo' | 'descripcion', value: string) {
    setConfig((prev) => {
      const items = [...prev.process.items]
      items[i] = { ...items[i], [campo]: value }
      return { ...prev, process: { ...prev.process, items } }
    })
  }

  // --- Beneficios extra (6 fijos) ---
  function handleBeneficioExtraCampo(i: number, campo: 'titulo' | 'subtitulo' | 'valor', value: string) {
    setConfig((prev) => {
      const items = [...prev.benefitsExtra.items]
      items[i] = { ...items[i], [campo]: value }
      return { ...prev, benefitsExtra: { ...prev.benefitsExtra, items } }
    })
  }

  // --- Casos (dinámico) ---
  function handleCasoCampo(i: number, campo: 'tag' | 'titulo' | 'descripcion', value: string) {
    setConfig((prev) => {
      const items = [...prev.testimonials.items]
      items[i] = { ...items[i], [campo]: value }
      return { ...prev, testimonials: { ...prev.testimonials, items } }
    })
  }
  function agregarCaso() {
    setConfig((prev) => ({ ...prev, testimonials: { ...prev.testimonials, items: [...prev.testimonials.items, { tag: '', titulo: '', descripcion: '', logoUrl: '' }] } }))
  }
  function quitarCaso(i: number) {
    setConfig((prev) => ({ ...prev, testimonials: { ...prev.testimonials, items: prev.testimonials.items.filter((_, idx) => idx !== i) } }))
  }
  function handleCasoLogo(i: number, file: File) {
    const anterior = config.testimonials.items[i]?.logoUrl
    const aplicar = (url: string) =>
      setConfig((prev) => {
        const items = [...prev.testimonials.items]
        items[i] = { ...items[i], logoUrl: url }
        return { ...prev, testimonials: { ...prev.testimonials, items } }
      })
    aplicar(URL.createObjectURL(file))
    subirArchivo(file)
      .then((url) => {
        aplicar(url)
        eliminarArchivo(anterior)
      })
      .catch(() => {
        if (anterior !== undefined) aplicar(anterior)
        setErrorPublicar('No pudimos subir el archivo. Probá de nuevo.')
      })
  }

  // --- FAQ (dinámico) ---
  function handleFaqCampo(i: number, campo: 'pregunta' | 'respuesta', value: string) {
    setConfig((prev) => {
      const items = [...prev.faq.items]
      items[i] = { ...items[i], [campo]: value }
      return { ...prev, faq: { ...prev.faq, items } }
    })
  }
  function agregarFaq() {
    setConfig((prev) => ({ ...prev, faq: { ...prev.faq, items: [...prev.faq.items, { pregunta: '', respuesta: '' }] } }))
  }
  function quitarFaq(i: number) {
    setConfig((prev) => ({ ...prev, faq: { ...prev.faq, items: prev.faq.items.filter((_, idx) => idx !== i) } }))
  }

  if (error) {
    return (
      <div className="crear-vortex__error-pantalla">
        <p>{error}</p>
        <a href="/">Volver al inicio</a>
      </div>
    )
  }

  return (
    <div className="crear-vortex">
      <div className="crear-vortex__form">
        <h1>Armá tu landing</h1>
        <p>
          Vas viendo el resultado a la derecha, en tiempo real.
          {cargando ? ' Cargando tu página…' : guardando ? ' Guardando…' : ' Guardado.'}
        </p>
        {!cargando && (
          <p className="crear-vortex__aviso-link">
            <Bookmark size={15} strokeWidth={2} />
            <span>Guardá esta URL (o marcala como favorita) — es tu único acceso para seguir editando más tarde.</span>
          </p>
        )}

        <details className="crear-vortex__seccion" open>
          <summary>Identidad</summary>
          <Field label="Nombre de tu empresa" path="identidad.nombreEmpresa" config={config} onChange={handleChange} />
          <CampoArchivo label="Logo" path="identidad.logoUrl" onArchivoChange={handleArchivoChange} />
          <Field label="WhatsApp (con código de país, sin +)" path="whatsappNumero" config={config} onChange={handleChange} />
          <Field label="Mensaje predefinido de WhatsApp" path="whatsappMensaje" config={config} onChange={handleChange} />
          <Field label="Texto del globo del botón de WhatsApp" path="whatsappTooltip" config={config} onChange={handleChange} />
          <Field label="Texto del banner superior (vacío = sin banner)" path="bannerTexto" config={config} onChange={handleChange} textarea />
          <Field label="Texto del botón principal del menú" path="navCtaLabel" config={config} onChange={handleChange} />
        </details>

        <details className="crear-vortex__seccion" open>
          <summary>Apariencia</summary>
          <CampoColor label="Color de fondo" path="apariencia.colorFondo" config={config} onChange={handleChange} />
          <CampoColor label="Color de texto" path="apariencia.colorTexto" config={config} onChange={handleChange} />
          <CampoColor label="Color de acento principal (el violeta secundario queda fijo)" path="apariencia.colorAcento" config={config} onChange={handleChange} />
        </details>

        <details className="crear-vortex__seccion" open>
          <summary>Portada (Hero)</summary>
          <Field label="Frase corta (badge)" path="hero.badge" config={config} onChange={handleChange} />
          <Field label="Título (usá ==así== para resaltar)" path="hero.titulo" config={config} onChange={handleChange} textarea />
          <Field label="Descripción" path="hero.descripcion" config={config} onChange={handleChange} textarea />
          <Field label="Texto del botón" path="hero.ctaLabel" config={config} onChange={handleChange} />
          <div className="crear-vortex__field">
            <label>Tipo de fondo</label>
            <select value={config.hero.fondoTipo} onChange={(e) => handleChange('hero.fondoTipo', e.target.value)}>
              <option value="tunel">Túnel 3D (animado)</option>
              <option value="imagen">Imagen</option>
              <option value="video">Video</option>
            </select>
          </div>
          {config.hero.fondoTipo !== 'tunel' && (
            <CampoArchivo label="Foto o video de fondo (si no subís nada, se ve el color de fondo sólido)" path="hero.fondoUrl" onArchivoChange={handleArchivoChange} />
          )}
        </details>

        <details className="crear-vortex__seccion">
          <summary>Beneficios</summary>
          <Field label="Etiqueta" path="problem.eyebrow" config={config} onChange={handleChange} />
          <Field label="Título (usá ==así== para resaltar)" path="problem.titulo" config={config} onChange={handleChange} />
          <Field label="Descripción" path="problem.descripcion" config={config} onChange={handleChange} textarea />
          <Field label="Texto del botón" path="problem.ctaLabel" config={config} onChange={handleChange} />
          {config.problem.items.map((item, i) => (
            <div className="crear-vortex__tarjeta" key={i}>
              <p className="crear-vortex__tarjeta-titulo">Beneficio {i + 1}</p>
              <div className="crear-vortex__field">
                <label>Ícono</label>
                <select value={item.icono} onChange={(e) => handleProblemItem(i, 'icono', e.target.value)}>
                  {OPCIONES_ICONO.map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </div>
              <div className="crear-vortex__field">
                <label>Título</label>
                <input type="text" value={item.titulo} onChange={(e) => handleProblemItem(i, 'titulo', e.target.value)} />
              </div>
              <div className="crear-vortex__field">
                <label>Descripción</label>
                <textarea value={item.descripcion} onChange={(e) => handleProblemItem(i, 'descripcion', e.target.value)} />
              </div>
            </div>
          ))}
        </details>

        <details className="crear-vortex__seccion">
          <summary>Soluciones</summary>
          <Field label="Etiqueta" path="products.eyebrow" config={config} onChange={handleChange} />
          <Field label="Título (usá ==así== para resaltar)" path="products.titulo" config={config} onChange={handleChange} />
          <Field label="Descripción" path="products.descripcion" config={config} onChange={handleChange} textarea />
          <Field label="Subtítulo (Productos)" path="products.subtitulo" config={config} onChange={handleChange} />
          <Field label="Bajada del subtítulo" path="products.subdescripcion" config={config} onChange={handleChange} />

          {(['producto1', 'producto2'] as const).map((cual, idx) => (
            <div className="crear-vortex__tarjeta" key={cual}>
              <p className="crear-vortex__tarjeta-titulo">Producto {idx + 1}</p>
              <div className="crear-vortex__field">
                <label>Título</label>
                <input type="text" value={config.products[cual].titulo} onChange={(e) => handleProductoCampo(cual, 'titulo', e.target.value)} />
              </div>
              <div className="crear-vortex__field">
                <label>Frase destacada</label>
                <input type="text" value={config.products[cual].destacado} onChange={(e) => handleProductoCampo(cual, 'destacado', e.target.value)} />
              </div>
              <div className="crear-vortex__field">
                <label>Descripción</label>
                <textarea value={config.products[cual].descripcion} onChange={(e) => handleProductoCampo(cual, 'descripcion', e.target.value)} />
              </div>
              {config.products[cual].tags.map((tag, i) => (
                <div className="crear-vortex__field" key={i}>
                  <label>Etiqueta {i + 1}</label>
                  <input type="text" value={tag} onChange={(e) => handleProductoTag(cual, i, e.target.value)} />
                </div>
              ))}
              <div className="crear-vortex__field">
                <label>Texto del botón</label>
                <input type="text" value={config.products[cual].ctaLabel} onChange={(e) => handleProductoCampo(cual, 'ctaLabel', e.target.value)} />
              </div>
            </div>
          ))}

          <p className="crear-vortex__tarjeta-titulo" style={{ marginTop: 8 }}>Funciones del asistente (Producto 2)</p>
          {config.products.agentes.map((agente, i) => (
            <div className="crear-vortex__tarjeta" key={i}>
              <div className="crear-vortex__field">
                <label>Título</label>
                <input type="text" value={agente.titulo} onChange={(e) => handleAgenteCampo(i, 'titulo', e.target.value)} />
              </div>
              <div className="crear-vortex__field">
                <label>Descripción</label>
                <textarea value={agente.descripcion} onChange={(e) => handleAgenteCampo(i, 'descripcion', e.target.value)} />
              </div>
            </div>
          ))}
        </details>

        <details className="crear-vortex__seccion">
          <summary>Servicios</summary>
          <Field label="Etiqueta" path="services.eyebrow" config={config} onChange={handleChange} />
          <Field label="Descripción" path="services.descripcion" config={config} onChange={handleChange} />
          {config.services.items.map((servicio, i) => (
            <div className="crear-vortex__tarjeta" key={i}>
              <p className="crear-vortex__tarjeta-titulo">Servicio {i + 1}</p>
              <div className="crear-vortex__field">
                <label>Título</label>
                <input type="text" value={servicio.titulo} onChange={(e) => handleServicioCampo(i, 'titulo', e.target.value)} />
              </div>
              <div className="crear-vortex__field">
                <label>Subtítulo</label>
                <input type="text" value={servicio.subtitulo} onChange={(e) => handleServicioCampo(i, 'subtitulo', e.target.value)} />
              </div>
              <div className="crear-vortex__field">
                <label>Descripción</label>
                <textarea value={servicio.descripcion} onChange={(e) => handleServicioCampo(i, 'descripcion', e.target.value)} />
              </div>
              <div className="crear-vortex__field">
                <label>Texto del botón</label>
                <input type="text" value={servicio.ctaLabel} onChange={(e) => handleServicioCampo(i, 'ctaLabel', e.target.value)} />
              </div>
              <div className="crear-vortex__field">
                <label>Video</label>
                <input type="file" accept="video/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleServicioVideo(i, f) }} />
              </div>
            </div>
          ))}
        </details>

        <details className="crear-vortex__seccion">
          <summary>Cómo empezar</summary>
          <Field label="Etiqueta" path="process.eyebrow" config={config} onChange={handleChange} />
          <Field label="Título (usá ==así== para resaltar)" path="process.titulo" config={config} onChange={handleChange} />
          <Field label="Descripción" path="process.descripcion" config={config} onChange={handleChange} textarea />
          <Field label="Texto del botón" path="process.ctaLabel" config={config} onChange={handleChange} />
          {config.process.items.map((paso, i) => (
            <div className="crear-vortex__tarjeta" key={i}>
              <p className="crear-vortex__tarjeta-titulo">Paso {paso.numero}</p>
              <div className="crear-vortex__field">
                <label>Ícono</label>
                <select value={paso.icono} onChange={(e) => handleProcesoCampo(i, 'icono', e.target.value)}>
                  {OPCIONES_ICONO.map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </div>
              <div className="crear-vortex__field">
                <label>Título</label>
                <input type="text" value={paso.titulo} onChange={(e) => handleProcesoCampo(i, 'titulo', e.target.value)} />
              </div>
              <div className="crear-vortex__field">
                <label>Descripción</label>
                <textarea value={paso.descripcion} onChange={(e) => handleProcesoCampo(i, 'descripcion', e.target.value)} />
              </div>
            </div>
          ))}
        </details>

        <details className="crear-vortex__seccion">
          <summary>Beneficios (segundo bloque)</summary>
          <Field label="Título línea 1" path="benefitsExtra.tituloLinea1" config={config} onChange={handleChange} />
          <Field label="Título línea 2 (usá ==así== para resaltar)" path="benefitsExtra.tituloLinea2" config={config} onChange={handleChange} />
          {config.benefitsExtra.items.map((b, i) => (
            <div className="crear-vortex__tarjeta" key={i}>
              <div className="crear-vortex__field">
                <label>Valor (ej: +75%)</label>
                <input type="text" value={b.valor} onChange={(e) => handleBeneficioExtraCampo(i, 'valor', e.target.value)} />
              </div>
              <div className="crear-vortex__field">
                <label>Título</label>
                <input type="text" value={b.titulo} onChange={(e) => handleBeneficioExtraCampo(i, 'titulo', e.target.value)} />
              </div>
              <div className="crear-vortex__field">
                <label>Subtítulo</label>
                <input type="text" value={b.subtitulo} onChange={(e) => handleBeneficioExtraCampo(i, 'subtitulo', e.target.value)} />
              </div>
            </div>
          ))}
        </details>

        <details className="crear-vortex__seccion">
          <summary>Casos de éxito</summary>
          <Field label="Etiqueta" path="testimonials.eyebrow" config={config} onChange={handleChange} />
          <Field label="Título (usá ==así== para resaltar)" path="testimonials.titulo" config={config} onChange={handleChange} />
          <Field label="Descripción" path="testimonials.descripcion" config={config} onChange={handleChange} textarea />
          <Field label="Texto del botón" path="testimonials.ctaLabel" config={config} onChange={handleChange} />
          {config.testimonials.items.map((c, i) => (
            <div className="crear-vortex__tarjeta" key={i}>
              <div className="crear-vortex__field">
                <label>Rubro</label>
                <input type="text" value={c.tag} onChange={(e) => handleCasoCampo(i, 'tag', e.target.value)} />
              </div>
              <div className="crear-vortex__field">
                <label>Título</label>
                <input type="text" value={c.titulo} onChange={(e) => handleCasoCampo(i, 'titulo', e.target.value)} />
              </div>
              <div className="crear-vortex__field">
                <label>Descripción</label>
                <textarea value={c.descripcion} onChange={(e) => handleCasoCampo(i, 'descripcion', e.target.value)} />
              </div>
              <CampoArchivo
                label="Logo del cliente (opcional — si no subís nada, se muestra un placeholder)"
                path={`testimonials.items.${i}.logoUrl`}
                onArchivoChange={(_, file) => handleCasoLogo(i, file)}
              />
              <button type="button" className="crear-vortex__btn-quitar" onClick={() => quitarCaso(i)}>Quitar caso</button>
            </div>
          ))}
          <button type="button" className="crear-vortex__btn-agregar" onClick={agregarCaso}>+ Agregar caso</button>
        </details>

        <details className="crear-vortex__seccion">
          <summary>Preguntas frecuentes</summary>
          <Field label="Etiqueta pequeña arriba del título" path="faq.eyebrow" config={config} onChange={handleChange} />
          <Field label="Título (usá ==así== para resaltar)" path="faq.titulo" config={config} onChange={handleChange} />
          <Field label="Pregunta de cierre (ej: ¿No encontraste tu pregunta?)" path="faq.ctaPregunta" config={config} onChange={handleChange} />
          <Field label="Texto del botón" path="faq.ctaLabel" config={config} onChange={handleChange} />
          {config.faq.items.map((item, i) => (
            <div className="crear-vortex__tarjeta" key={i}>
              <div className="crear-vortex__field">
                <label>Pregunta</label>
                <input type="text" value={item.pregunta} onChange={(e) => handleFaqCampo(i, 'pregunta', e.target.value)} />
              </div>
              <div className="crear-vortex__field">
                <label>Respuesta</label>
                <textarea value={item.respuesta} onChange={(e) => handleFaqCampo(i, 'respuesta', e.target.value)} />
              </div>
              <button type="button" className="crear-vortex__btn-quitar" onClick={() => quitarFaq(i)}>Quitar pregunta</button>
            </div>
          ))}
          <button type="button" className="crear-vortex__btn-agregar" onClick={agregarFaq}>+ Agregar pregunta</button>
        </details>

        <details className="crear-vortex__seccion">
          <summary>CTA final</summary>
          <Field label="Título (2 líneas, usá ==así== para resaltar)" path="finalCta.titulo" config={config} onChange={handleChange} textarea />
          <Field label="Descripción" path="finalCta.descripcion" config={config} onChange={handleChange} textarea />
          <Field label="Texto del botón" path="finalCta.ctaLabel" config={config} onChange={handleChange} />
        </details>

        <details className="crear-vortex__seccion">
          <summary>Pie de página</summary>
          <Field label="Descripción de tu empresa" path="footer.descripcion" config={config} onChange={handleChange} textarea />
          <Field label="Título de la columna de links" path="footer.tituloNavegacion" config={config} onChange={handleChange} />
          <Field label="Título de la columna de contacto" path="footer.tituloContacto" config={config} onChange={handleChange} />
          <Field label="Email de contacto" path="footer.contacto.email" config={config} onChange={handleChange} />
          <Field label="WhatsApp (con código de país, sin +)" path="footer.contacto.whatsappNumero" config={config} onChange={handleChange} />
          <Field label="WhatsApp (como se muestra)" path="footer.contacto.whatsappTexto" config={config} onChange={handleChange} />
          <Field label="Dirección" path="footer.contacto.direccion" config={config} onChange={handleChange} />
          <Field label="Texto de copyright" path="footer.copyrightTexto" config={config} onChange={handleChange} />
        </details>

        <div className="crear-vortex__subdominio">
          <Globe size={16} strokeWidth={2} />
          <p>
            Tu landing va a quedar en{' '}
            <strong>{config.identidad.nombreEmpresa.trim() ? slugify(config.identidad.nombreEmpresa) : 'tu-empresa'}.{DOMINIO_BASE}</strong>.
            {' '}¿Querés tu propio dominio (tuweb.com)?{' '}
            <a href={linkWhatsappSoporte('Hola! Quiero usar mi propio dominio para mi landing.')} target="_blank" rel="noreferrer">
              Escribinos por WhatsApp
            </a>.
          </p>
        </div>

        <p className="crear-vortex__precio-final">
          <span className="crear-vortex__precio-tachado">{formatoPrecio(PRECIOS['landing-vortex'])}</span>
          <strong>Gratis</strong> por tiempo limitado
        </p>
        {errorPublicar && <p className="crear-vortex__error">{errorPublicar}</p>}
        <button type="button" className="crear-vortex__btn-generar" onClick={handleGenerar} disabled={publicando}>
          {publicando ? 'Generando…' : 'Generar landing'}
        </button>

        {resultado && (
          <div className="crear-vortex__resultado">
            <p className="crear-vortex__resultado-titulo">
              <CheckCircle2 size={18} strokeWidth={2} />
              <strong>¡Listo, se guardó todo!</strong>
            </p>
            <p className="crear-vortex__resultado-label">Tu landing va a quedar en:</p>
            <p className="crear-vortex__resultado-url">{resultado.url}</p>
            <p className="crear-vortex__resultado-nota">
              Ese link se activa apenas conectemos el dominio. Hasta entonces, para volver a editar o generar de nuevo, usá este otro link — es tuyo, <strong>guardalo</strong>:
            </p>
            <div className="crear-vortex__resultado-editar-row">
              <p className="crear-vortex__resultado-url crear-vortex__resultado-url--editar">{linkEdicion}</p>
              <button type="button" onClick={handleCopiarLink}>
                {copiado ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2} />}
                {copiado ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="crear-vortex__preview">
        <VortexPage config={config} />
      </div>
    </div>
  )
}
