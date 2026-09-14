import { useState } from 'react'
import './styles/CrearLandingFleepix.css'
import LandingPage from './views/LandingPage'
import { fleepixBlankConfig, type LandingFleepixConfig } from './config'
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
  placeholder,
}: {
  label: string
  path: string
  config: LandingFleepixConfig
  onChange: (path: string, value: string) => void
  textarea?: boolean
  placeholder?: string
}) {
  const value = (getPath(config, path) as string) ?? ''
  return (
    <div className="crear-landing__field">
      <label htmlFor={path}>{label}</label>
      {textarea ? (
        <textarea id={path} value={value} placeholder={placeholder} onChange={(e) => onChange(path, e.target.value)} />
      ) : (
        <input id={path} type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(path, e.target.value)} />
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
  config: LandingFleepixConfig
  onChange: (path: string, value: string) => void
}) {
  const value = (getPath(config, path) as string) ?? '#000000'
  return (
    <div className="crear-landing__field crear-landing__field--color">
      <label htmlFor={path}>{label}</label>
      <div className="crear-landing__color-row">
        <input id={path} type="color" value={value} onChange={(e) => onChange(path, e.target.value)} />
        <input type="text" value={value} onChange={(e) => onChange(path, e.target.value)} />
      </div>
    </div>
  )
}

function CampoFoto({
  label,
  path,
  config,
  onFotoChange,
}: {
  label: string
  path: string
  config: LandingFleepixConfig
  onFotoChange: (path: string, file: File) => void
}) {
  return (
    <div className="crear-landing__field">
      <label>{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFotoChange(path, file)
        }}
      />
    </div>
  )
}

function SelectIcono({
  label,
  path,
  config,
  onChange,
}: {
  label: string
  path: string
  config: LandingFleepixConfig
  onChange: (path: string, value: string) => void
}) {
  const value = (getPath(config, path) as string) ?? OPCIONES_ICONO[0]
  return (
    <div className="crear-landing__field">
      <label htmlFor={path}>{label}</label>
      <select id={path} value={value} onChange={(e) => onChange(path, e.target.value)}>
        {OPCIONES_ICONO.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function CrearLandingFleepixPage() {
  const { config, setConfig, cargando, guardando, error, publicar } = usePaginaPersistida(
    'landing-fleepix',
    fleepixBlankConfig,
    '/crear/landing-fleepix',
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
        await publicar(slug, PRECIOS['landing-fleepix'])
      } catch {
        slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`
        await publicar(slug, PRECIOS['landing-fleepix'])
      }
      setResultado({ slug, url: urlPublicada(slug) })
    } catch {
      setErrorPublicar('No pudimos publicar tu landing. Probá de nuevo en un momento.')
    } finally {
      setPublicando(false)
    }
  }

  function handleChange(path: string, value: string) {
    setConfig((prev) => setPath(prev, path, value))
  }

  function handleFotoChange(path: string, file: File) {
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

  function handleCheck(path: string, value: boolean) {
    setConfig((prev) => setPath(prev, path, value))
  }

  // --- Bullets de una tarjeta de ParaQuien ---
  function handleBulletChange(tarjeta: 'tarjetaTexto1' | 'tarjetaTexto2', i: number, value: string) {
    setConfig((prev) => {
      const bullets = [...prev.paraQuien[tarjeta].bullets]
      bullets[i] = value
      return { ...prev, paraQuien: { ...prev.paraQuien, [tarjeta]: { ...prev.paraQuien[tarjeta], bullets } } }
    })
  }

  // --- Beneficios (array de 3) ---
  function handleBeneficioChange(i: number, campo: 'titulo' | 'cuerpo' | 'icono', value: string) {
    setConfig((prev) => {
      const items = [...prev.beneficios.items]
      items[i] = { ...items[i], [campo]: value }
      return { ...prev, beneficios: { ...prev.beneficios, items } }
    })
  }

  // --- Funcionalidades (array de 6) ---
  function handleFuncionalidadChange(
    i: number,
    campo: 'navLabel' | 'chipIcono' | 'chipLabel' | 'titulo' | 'descripcion',
    value: string,
  ) {
    setConfig((prev) => {
      const items = [...prev.funcionalidades.items]
      items[i] = { ...items[i], [campo]: value }
      return { ...prev, funcionalidades: { ...prev.funcionalidades, items } }
    })
  }

  function handleFuncionalidadFoto(i: number, file: File) {
    const anterior = config.funcionalidades.items[i]?.foto
    const aplicar = (url: string) =>
      setConfig((prev) => {
        const items = [...prev.funcionalidades.items]
        items[i] = { ...items[i], foto: url }
        return { ...prev, funcionalidades: { ...prev.funcionalidades, items } }
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

  // --- FAQ (array dinámico) ---
  function handleFaqChange(i: number, campo: 'pregunta' | 'respuesta', value: string) {
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

  // --- Bullets de la sección de contacto (array dinámico) ---
  function handleContactoBulletChange(i: number, value: string) {
    setConfig((prev) => {
      const bullets = [...prev.contactoSeccion.bullets]
      bullets[i] = value
      return { ...prev, contactoSeccion: { ...prev.contactoSeccion, bullets } }
    })
  }
  function agregarContactoBullet() {
    setConfig((prev) => ({ ...prev, contactoSeccion: { ...prev.contactoSeccion, bullets: [...prev.contactoSeccion.bullets, ''] } }))
  }
  function quitarContactoBullet(i: number) {
    setConfig((prev) => ({
      ...prev,
      contactoSeccion: { ...prev.contactoSeccion, bullets: prev.contactoSeccion.bullets.filter((_, idx) => idx !== i) },
    }))
  }

  // --- Etiquetas del menú (cantidad fija, atadas a las secciones de la página) ---
  function handleNavLinkLabel(i: number, value: string) {
    setConfig((prev) => {
      const navLinks = [...prev.navLinks]
      navLinks[i] = { ...navLinks[i], label: value }
      return { ...prev, navLinks }
    })
  }

  if (error) {
    return (
      <div className="crear-landing__error-pantalla">
        <AlertCircle size={32} strokeWidth={1.5} />
        <p>{error}</p>
        <a href="/">Volver al inicio</a>
      </div>
    )
  }

  return (
    <div className="crear-landing">
      <div className="crear-landing__form">
        <h1>Armá tu landing</h1>
        <p>
          Vas viendo el resultado a la derecha, en tiempo real.
          {cargando ? ' Cargando tu página…' : guardando ? ' Guardando…' : ' Guardado.'}
        </p>
        {!cargando && (
          <p className="crear-landing__aviso-link">
            <Bookmark size={15} strokeWidth={2} />
            <span>Guardá esta URL (o marcala como favorita) — es tu único acceso para seguir editando más tarde.</span>
          </p>
        )}

        <details className="crear-landing__seccion" open>
          <summary>Identidad</summary>
          <Field label="Nombre de tu empresa" path="identidad.nombreEmpresa" config={config} onChange={handleChange} />
          <CampoFoto label="Logo" path="identidad.logoUrl" config={config} onFotoChange={handleFotoChange} />
          <Field label="WhatsApp (con código de país, sin +)" path="whatsappNumero" config={config} onChange={handleChange} />
          <Field label="Mensaje predefinido del botón de WhatsApp" path="whatsappMensajeDemo" config={config} onChange={handleChange} />
        </details>

        <details className="crear-landing__seccion" open>
          <summary>Apariencia</summary>
          <CampoColor label="Color de fondo" path="apariencia.colorFondo" config={config} onChange={handleChange} />
          <CampoColor label="Color de texto" path="apariencia.colorTexto" config={config} onChange={handleChange} />
          <CampoColor label="Color de acento (botones, links, destacados)" path="apariencia.colorAcento" config={config} onChange={handleChange} />
        </details>

        <details className="crear-landing__seccion">
          <summary>Menú</summary>
          {config.navLinks.map((link, i) => (
            <div className="crear-landing__field" key={link.href}>
              <label>Texto del link "{link.href}"</label>
              <input type="text" value={link.label} onChange={(e) => handleNavLinkLabel(i, e.target.value)} />
            </div>
          ))}
          <Field label="Texto del botón principal" path="navCtaLabel" config={config} onChange={handleChange} />
        </details>

        <details className="crear-landing__seccion" open>
          <summary>Portada (Hero)</summary>
          <Field label="Frase corta arriba del título" path="hero.eyebrow" config={config} onChange={handleChange} />
          <Field
            label="Título (usá ==así== para resaltar una parte)"
            path="hero.titulo"
            config={config}
            onChange={handleChange}
            textarea
          />
          <Field label="Párrafo debajo del título" path="hero.descripcion" config={config} onChange={handleChange} textarea />
          <Field label="Texto botón 1" path="hero.cta1Label" config={config} onChange={handleChange} />
          <Field label="Texto botón 2" path="hero.cta2Label" config={config} onChange={handleChange} />
          <CampoFoto label="Foto principal" path="hero.fotoPrincipal" config={config} onFotoChange={handleFotoChange} />
          <CampoFoto label="Foto secundaria (aparece al pasar el mouse)" path="hero.fotoSecundaria" config={config} onFotoChange={handleFotoChange} />
        </details>

        <details className="crear-landing__seccion">
          <summary>¿Para quién?</summary>
          <Field label="Etiqueta" path="paraQuien.eyebrow" config={config} onChange={handleChange} />
          <Field label="Título" path="paraQuien.titulo" config={config} onChange={handleChange} />
          <Field label="Descripción" path="paraQuien.descripcion" config={config} onChange={handleChange} textarea />

          <div className="crear-landing__tarjeta">
            <p className="crear-landing__tarjeta-titulo">Tarjeta 1 (texto)</p>
            <Field label="Título" path="paraQuien.tarjetaTexto1.titulo" config={config} onChange={handleChange} />
            <Field label="Descripción" path="paraQuien.tarjetaTexto1.descripcion" config={config} onChange={handleChange} textarea />
            {config.paraQuien.tarjetaTexto1.bullets.map((b, i) => (
              <div className="crear-landing__bullet-row" key={i}>
                <input type="text" value={b} onChange={(e) => handleBulletChange('tarjetaTexto1', i, e.target.value)} />
              </div>
            ))}
          </div>

          <div className="crear-landing__tarjeta">
            <p className="crear-landing__tarjeta-titulo">Tarjeta 2 (foto)</p>
            <Field label="Etiqueta sobre la foto" path="paraQuien.tarjetaFoto1.badge" config={config} onChange={handleChange} />
            <CampoFoto label="Foto" path="paraQuien.tarjetaFoto1.foto" config={config} onFotoChange={handleFotoChange} />
          </div>

          <div className="crear-landing__tarjeta">
            <p className="crear-landing__tarjeta-titulo">Tarjeta 3 (foto)</p>
            <Field label="Etiqueta sobre la foto" path="paraQuien.tarjetaFoto2.badge" config={config} onChange={handleChange} />
            <CampoFoto label="Foto" path="paraQuien.tarjetaFoto2.foto" config={config} onFotoChange={handleFotoChange} />
          </div>

          <div className="crear-landing__tarjeta">
            <p className="crear-landing__tarjeta-titulo">Tarjeta 4 (texto)</p>
            <Field label="Título" path="paraQuien.tarjetaTexto2.titulo" config={config} onChange={handleChange} />
            <Field label="Descripción" path="paraQuien.tarjetaTexto2.descripcion" config={config} onChange={handleChange} textarea />
            {config.paraQuien.tarjetaTexto2.bullets.map((b, i) => (
              <div className="crear-landing__bullet-row" key={i}>
                <input type="text" value={b} onChange={(e) => handleBulletChange('tarjetaTexto2', i, e.target.value)} />
              </div>
            ))}
          </div>
        </details>

        <details className="crear-landing__seccion">
          <summary>Beneficios</summary>
          <Field label="Etiqueta" path="beneficios.eyebrow" config={config} onChange={handleChange} />
          <Field label="Título (usá ==así== para resaltar una parte)" path="beneficios.titulo" config={config} onChange={handleChange} />
          <Field label="Descripción" path="beneficios.descripcion" config={config} onChange={handleChange} textarea />
          {config.beneficios.items.map((item, i) => (
            <div className="crear-landing__tarjeta" key={i}>
              <p className="crear-landing__tarjeta-titulo">Beneficio {i + 1}</p>
              <div className="crear-landing__field">
                <label>Ícono</label>
                <select value={item.icono} onChange={(e) => handleBeneficioChange(i, 'icono', e.target.value)}>
                  {OPCIONES_ICONO.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>
              <div className="crear-landing__field">
                <label>Título</label>
                <input type="text" value={item.titulo} onChange={(e) => handleBeneficioChange(i, 'titulo', e.target.value)} />
              </div>
              <div className="crear-landing__field">
                <label>Texto (usá **así** para resaltar)</label>
                <textarea value={item.cuerpo} onChange={(e) => handleBeneficioChange(i, 'cuerpo', e.target.value)} />
              </div>
            </div>
          ))}
        </details>

        <details className="crear-landing__seccion">
          <summary>Funcionalidades</summary>
          <Field label="Etiqueta" path="funcionalidades.eyebrow" config={config} onChange={handleChange} />
          <Field label="Título" path="funcionalidades.titulo" config={config} onChange={handleChange} />
          <Field label="Descripción" path="funcionalidades.descripcion" config={config} onChange={handleChange} textarea />
          {config.funcionalidades.items.map((item, i) => (
            <div className="crear-landing__tarjeta" key={i}>
              <p className="crear-landing__tarjeta-titulo">Funcionalidad {i + 1}</p>
              <div className="crear-landing__field">
                <label>Nombre en el menú lateral</label>
                <input type="text" value={item.navLabel} onChange={(e) => handleFuncionalidadChange(i, 'navLabel', e.target.value)} />
              </div>
              <div className="crear-landing__field">
                <label>Ícono de la etiqueta</label>
                <select value={item.chipIcono} onChange={(e) => handleFuncionalidadChange(i, 'chipIcono', e.target.value)}>
                  {OPCIONES_ICONO.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>
              <div className="crear-landing__field">
                <label>Texto de la etiqueta</label>
                <input type="text" value={item.chipLabel} onChange={(e) => handleFuncionalidadChange(i, 'chipLabel', e.target.value)} />
              </div>
              <div className="crear-landing__field">
                <label>Título</label>
                <input type="text" value={item.titulo} onChange={(e) => handleFuncionalidadChange(i, 'titulo', e.target.value)} />
              </div>
              <div className="crear-landing__field">
                <label>Descripción</label>
                <textarea value={item.descripcion} onChange={(e) => handleFuncionalidadChange(i, 'descripcion', e.target.value)} />
              </div>
              <div className="crear-landing__field">
                <label>Foto</label>
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFuncionalidadFoto(i, file)
                }} />
              </div>
            </div>
          ))}
        </details>

        <details className="crear-landing__seccion">
          <summary>Preguntas frecuentes</summary>
          <Field label="Etiqueta" path="faq.eyebrow" config={config} onChange={handleChange} />
          <Field label="Título" path="faq.titulo" config={config} onChange={handleChange} />
          <Field label="Descripción" path="faq.descripcion" config={config} onChange={handleChange} textarea />
          <Field label="Texto del botón" path="faq.ctaLabel" config={config} onChange={handleChange} />
          {config.faq.items.map((item, i) => (
            <div className="crear-landing__tarjeta" key={i}>
              <div className="crear-landing__field">
                <label>Pregunta</label>
                <input type="text" value={item.pregunta} onChange={(e) => handleFaqChange(i, 'pregunta', e.target.value)} />
              </div>
              <div className="crear-landing__field">
                <label>Respuesta</label>
                <textarea value={item.respuesta} onChange={(e) => handleFaqChange(i, 'respuesta', e.target.value)} />
              </div>
              <button type="button" className="crear-landing__btn-quitar" onClick={() => quitarFaq(i)}>
                Quitar pregunta
              </button>
            </div>
          ))}
          <button type="button" className="crear-landing__btn-agregar" onClick={agregarFaq}>
            + Agregar pregunta
          </button>
        </details>

        <details className="crear-landing__seccion">
          <summary>Sección de contacto</summary>
          <Field label="Etiqueta" path="contactoSeccion.eyebrow" config={config} onChange={handleChange} />
          <Field label="Título" path="contactoSeccion.titulo" config={config} onChange={handleChange} />
          <Field label="Descripción" path="contactoSeccion.descripcion" config={config} onChange={handleChange} textarea />
          {config.contactoSeccion.bullets.map((b, i) => (
            <div className="crear-landing__bullet-row" key={i}>
              <input type="text" value={b} onChange={(e) => handleContactoBulletChange(i, e.target.value)} />
              <button type="button" className="crear-landing__btn-quitar" onClick={() => quitarContactoBullet(i)} aria-label="Quitar punto">
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="crear-landing__btn-agregar" onClick={agregarContactoBullet}>
            + Agregar punto
          </button>
          <Field label="Texto del botón de envío" path="contactoSeccion.botonEnviar" config={config} onChange={handleChange} />
          <Field label="Mensaje tras enviar el formulario" path="contactoSeccion.mensajeExito" config={config} onChange={handleChange} />
        </details>

        <details className="crear-landing__seccion">
          <summary>Pie de página</summary>
          <Field label="Descripción de tu empresa" path="footer.descripcion" config={config} onChange={handleChange} textarea />
          <Field label="Email de contacto" path="footer.contacto.email" config={config} onChange={handleChange} />
          <Field label="WhatsApp (con código de país, sin +)" path="footer.contacto.whatsappNumero" config={config} onChange={handleChange} />
          <Field label="WhatsApp (como se muestra)" path="footer.contacto.whatsappTexto" config={config} onChange={handleChange} />
          <Field label="Dirección" path="footer.contacto.direccion" config={config} onChange={handleChange} />
          <Field label="Texto de copyright" path="footer.copyrightTexto" config={config} onChange={handleChange} />
          <Field label="Instagram (URL, opcional)" path="footer.redes.instagram" config={config} onChange={handleChange} />
          <Field label="LinkedIn (URL, opcional)" path="footer.redes.linkedin" config={config} onChange={handleChange} />
          <Field label="Facebook (URL, opcional)" path="footer.redes.facebook" config={config} onChange={handleChange} />

          <label className="crear-landing__check">
            <input
              type="checkbox"
              checked={config.footer.mostrarBloqueDesarrolloAMedida}
              onChange={(e) => handleCheck('footer.mostrarBloqueDesarrolloAMedida', e.target.checked)}
            />
            Mostrar bloque "¿Tenés un requerimiento especial?"
          </label>
          {config.footer.mostrarBloqueDesarrolloAMedida && (
            <Field
              label="Mensaje de WhatsApp de ese botón"
              path="footer.mensajeWhatsappDesarrolloAMedida"
              config={config}
              onChange={handleChange}
            />
          )}
        </details>

        <div className="crear-landing__subdominio">
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

        <p className="crear-landing__precio-final">
          <span className="crear-landing__precio-tachado">{formatoPrecio(PRECIOS['landing-fleepix'])}</span>
          <strong>Gratis</strong> por tiempo limitado
        </p>
        {errorPublicar && <p className="crear-landing__error">{errorPublicar}</p>}
        <button type="button" className="crear-landing__btn-generar" onClick={handleGenerar} disabled={publicando}>
          {publicando ? 'Generando…' : 'Generar landing'}
        </button>

        {resultado && (
          <div className="crear-landing__resultado">
            <p className="crear-landing__resultado-titulo">
              <CheckCircle2 size={18} strokeWidth={2} />
              <strong>¡Listo, se guardó todo!</strong>
            </p>
            <p className="crear-landing__resultado-label">Tu landing va a quedar en:</p>
            <p className="crear-landing__resultado-url">{resultado.url}</p>
            <p className="crear-landing__resultado-nota">
              Ese link se activa apenas conectemos el dominio. Hasta entonces, para volver a editar o generar de nuevo, usá este otro link — es tuyo, <strong>guardalo</strong>:
            </p>
            <div className="crear-landing__resultado-editar-row">
              <input type="text" readOnly value={linkEdicion} onFocus={(e) => e.target.select()} />
              <button type="button" onClick={handleCopiarLink}>
                {copiado ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2} />}
                {copiado ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="crear-landing__preview">
        <LandingPage config={config} />
      </div>
    </div>
  )
}
