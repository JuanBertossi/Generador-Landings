import { useState } from 'react'
import './styles/CrearInvitacion.css'
import InvitacionPage from './InvitacionPage.jsx'
import { invitacionBlankConfig } from './config.js'
import { setPath, getPath } from '@/shared/lib/objectPath'
import { slugify } from '@/shared/lib/slugify'
import { PRECIOS, formatoPrecio } from '@/shared/lib/precios'
import { usePaginaPersistida } from '@/shared/hooks/usePaginaPersistida'
import { subirArchivo, eliminarArchivo } from '@/shared/lib/subirArchivo'
import { linkWhatsappSoporte } from '@/shared/lib/contacto'
import { urlPublicada, DOMINIO_BASE } from '@/shared/lib/dominio'
import { MobilePreviewFrame } from '@/shared/components/MobilePreviewFrame'
import { Bookmark, CheckCircle2, Copy, Check, AlertCircle, Globe, Monitor, Smartphone } from 'lucide-react'

function Field({ label, path, config, onChange, type = 'text', textarea = false }) {
  const value = getPath(config, path) ?? ''
  const handleChange = (e) => onChange(path, e.target.value)

  return (
    <div className="crear-invitacion__field">
      <label htmlFor={path}>{label}</label>
      {textarea ? (
        <textarea id={path} value={value} onChange={handleChange} />
      ) : (
        <input id={path} type={type} value={value} onChange={handleChange} />
      )}
    </div>
  )
}

function CampoColor({ label, path, config, onChange }) {
  const value = getPath(config, path) ?? '#000000'
  return (
    <div className="crear-invitacion__field crear-invitacion__field--color">
      <label htmlFor={path}>{label}</label>
      <div className="crear-invitacion__color-row">
        <input id={path} type="color" value={value} onChange={(e) => onChange(path, e.target.value)} />
        <input type="text" value={value} onChange={(e) => onChange(path, e.target.value)} />
      </div>
    </div>
  )
}

export default function CrearInvitacionPage() {
  const { config, setConfig, cargando, guardando, error, publicar } = usePaginaPersistida(
    'invitacion',
    invitacionBlankConfig,
    '/crear/invitacion',
  )
  const [resultado, setResultado] = useState(null)
  const [publicando, setPublicando] = useState(false)
  const [errorPublicar, setErrorPublicar] = useState(null)
  const [copiado, setCopiado] = useState(false)
  const [vistaMobile, setVistaMobile] = useState(false)
  const linkEdicion = typeof window !== 'undefined' ? window.location.href : ''

  function handleCopiarLink() {
    navigator.clipboard.writeText(linkEdicion).then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    })
  }

  async function handleGenerar() {
    if (!config.anfitrion.nombre.trim()) {
      setErrorPublicar('Falta el nombre de quién festeja.')
      return
    }
    if (!config.evento.fechaHoraISO) {
      setErrorPublicar('Falta la fecha y hora del evento.')
      return
    }
    if (!config.rsvp.fechaLimiteISO) {
      setErrorPublicar('Falta la fecha límite para confirmar asistencia.')
      return
    }
    setPublicando(true)
    setErrorPublicar(null)
    let slug = slugify(config.anfitrion.nombre)
    try {
      try {
        await publicar(slug, PRECIOS.invitacion)
      } catch {
        slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`
        await publicar(slug, PRECIOS.invitacion)
      }
      setResultado({ slug, url: urlPublicada(slug) })
    } catch {
      setErrorPublicar('No pudimos publicar tu invitación. Probá de nuevo en un momento.')
    } finally {
      setPublicando(false)
    }
  }

  function handleChange(path, value) {
    setConfig((prev) => setPath(prev, path, value))
  }

  function handleArchivoGenerico(path, file) {
    const anterior = getPath(config, path)
    setConfig((prev) => setPath(prev, path, URL.createObjectURL(file)))
    subirArchivo(file)
      .then((url) => {
        setConfig((prev) => setPath(prev, path, url))
        eliminarArchivo(anterior)
      })
      .catch(() => {
        setConfig((prev) => setPath(prev, path, anterior ?? ''))
        setErrorPublicar('No pudimos subir la foto. Probá de nuevo.')
      })
  }

  function handlePrecioChange(index, campo, value) {
    setConfig((prev) => {
      const precios = [...prev.precios]
      precios[index] = { ...precios[index], [campo]: value }
      return { ...prev, precios }
    })
  }

  function agregarPrecio() {
    setConfig((prev) => ({
      ...prev,
      precios: [...prev.precios, { categoria: '', precio: '' }],
    }))
  }

  function quitarPrecio(index) {
    setConfig((prev) => ({
      ...prev,
      precios: prev.precios.filter((_, i) => i !== index),
    }))
  }

  if (error) {
    return (
      <div className="crear-invitacion__error-pantalla">
        <AlertCircle size={32} strokeWidth={1.5} />
        <p>{error}</p>
        <a href="/">Volver al inicio</a>
      </div>
    )
  }

  return (
    <div className="crear-invitacion">
      <div className="crear-invitacion__form">
        <div className="crear-invitacion__vista-toggle">
          <button type="button" className={vistaMobile ? '' : 'activo'} onClick={() => setVistaMobile(false)}>
            <Monitor size={15} strokeWidth={2} /> Desktop
          </button>
          <button type="button" className={vistaMobile ? 'activo' : ''} onClick={() => setVistaMobile(true)}>
            <Smartphone size={15} strokeWidth={2} /> Mobile
          </button>
        </div>

        <h1>Armá tu invitación</h1>
        <p>
          Vas viendo el resultado a la derecha, en tiempo real. Hacé clic sobre cualquier texto o foto de la vista previa para editarlo directamente.
          {cargando ? ' Cargando tu página…' : guardando ? ' Guardando…' : ' Guardado.'}
        </p>
        {!cargando && (
          <p className="crear-invitacion__aviso-link">
            <Bookmark size={15} strokeWidth={2} />
            <span><strong>No hay usuario ni contraseña</strong> — este link ES tu forma de entrar. Guardalo como favorito o mandátelo por WhatsApp a vos mismo, si no lo perdés el acceso a tu invitación.</span>
          </p>
        )}

        <fieldset className="crear-invitacion__fieldset">
          <legend>Quién festeja</legend>
          <Field label="Nombre" path="anfitrion.nombre" config={config} onChange={handleChange} />
        </fieldset>

        <fieldset className="crear-invitacion__fieldset">
          <legend>Bienvenida</legend>
          <Field label="Frase de bienvenida" path="bienvenida.subtitulo" config={config} onChange={handleChange} textarea />
          <Field label="ID de video de YouTube (opcional)" path="bienvenida.youtubeVideoId" config={config} onChange={handleChange} />
        </fieldset>

        <fieldset className="crear-invitacion__fieldset">
          <legend>Evento</legend>
          <div className="crear-invitacion__field">
            <label htmlFor="evento.fechaHoraISO">Fecha y hora</label>
            <input
              id="evento.fechaHoraISO"
              type="datetime-local"
              value={config.evento.fechaHoraISO}
              onChange={(e) => handleChange('evento.fechaHoraISO', e.target.value)}
            />
          </div>
          <Field label="Link de Google Maps" path="evento.lugarMapsLink" config={config} onChange={handleChange} />
        </fieldset>

        <fieldset className="crear-invitacion__fieldset">
          <legend>Apariencia</legend>
          <CampoColor label="Color de fondo (secciones claras)" path="apariencia.colorFondo" config={config} onChange={handleChange} />
          <CampoColor label="Color de texto (secciones claras)" path="apariencia.colorTexto" config={config} onChange={handleChange} />
          <CampoColor label="Color de acento (botones, líneas)" path="apariencia.colorAcento" config={config} onChange={handleChange} />
        </fieldset>

        <fieldset className="crear-invitacion__fieldset">
          <legend>Confirmación por WhatsApp</legend>
          <Field label="Tu WhatsApp (con código de país, sin +)" path="rsvp.telefonoWhatsapp" config={config} onChange={handleChange} />
          <Field label="Mensaje pre-cargado (usá {nombre} para el nombre del festejado)" path="rsvp.mensajePlantilla" config={config} onChange={handleChange} textarea />
          <div className="crear-invitacion__field">
            <label htmlFor="rsvp.fechaLimiteISO">Confirmar antes de</label>
            <input
              id="rsvp.fechaLimiteISO"
              type="date"
              value={config.rsvp.fechaLimiteISO}
              onChange={(e) => handleChange('rsvp.fechaLimiteISO', e.target.value)}
            />
          </div>
        </fieldset>

        <fieldset className="crear-invitacion__fieldset">
          <legend>Textos que no se ven en la vista previa</legend>
          <Field label="Botón para entrar a la invitación" path="textos.botonIngresar" config={config} onChange={handleChange} />
          <Field label="Título del cuadro de precios" path="textos.tituloValorTarjeta" config={config} onChange={handleChange} />
          <Field label="Nota sobre la forma de pago" path="textos.notaPago" config={config} onChange={handleChange} textarea />
        </fieldset>

        <fieldset className="crear-invitacion__fieldset">
          <legend>Precio de entrada</legend>
          {config.precios.map((p, i) => (
            <div className="crear-invitacion__precio-row" key={i}>
              <input
                placeholder="Categoría"
                value={p.categoria}
                onChange={(e) => handlePrecioChange(i, 'categoria', e.target.value)}
              />
              <input
                placeholder="Precio"
                value={p.precio}
                onChange={(e) => handlePrecioChange(i, 'precio', e.target.value)}
              />
              <button type="button" className="crear-invitacion__btn-quitar" onClick={() => quitarPrecio(i)} aria-label="Quitar categoría de precio">
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="crear-invitacion__btn-agregar" onClick={agregarPrecio}>
            + Agregar categoría
          </button>
        </fieldset>

        <div className="crear-invitacion__subdominio">
          <Globe size={16} strokeWidth={2} />
          <p>
            Tu invitación va a quedar en{' '}
            <strong>{config.anfitrion.nombre.trim() ? slugify(config.anfitrion.nombre) : 'tu-nombre'}.{DOMINIO_BASE}</strong>.
            {' '}¿Querés tu propio dominio (tuweb.com)?{' '}
            <a href={linkWhatsappSoporte('Hola! Quiero usar mi propio dominio para mi invitación.')} target="_blank" rel="noreferrer">
              Escribinos por WhatsApp
            </a>.
          </p>
        </div>

        <p className="crear-invitacion__precio-final">
          <span className="crear-invitacion__precio-tachado">{formatoPrecio(PRECIOS.invitacion)}</span>
          <strong>Gratis</strong> por tiempo limitado
        </p>
        {errorPublicar && <p className="crear-invitacion__error">{errorPublicar}</p>}
        <button type="button" className="crear-invitacion__btn-generar" onClick={handleGenerar} disabled={publicando}>
          {publicando ? 'Generando…' : 'Generar invitación'}
        </button>

        {resultado && (
          <div className="crear-invitacion__resultado">
            <p className="crear-invitacion__resultado-titulo">
              <CheckCircle2 size={18} strokeWidth={2} />
              <strong>¡Listo, se guardó todo!</strong>
            </p>
            <p className="crear-invitacion__resultado-label">Tu invitación va a quedar en:</p>
            <p className="crear-invitacion__resultado-url">{resultado.url}</p>
            <p className="crear-invitacion__resultado-nota">
              Ese link se activa apenas conectemos el dominio. Hasta entonces, para volver a editar o generar de nuevo, usá este otro link — es tuyo, <strong>guardalo</strong>:
            </p>
            <div className="crear-invitacion__resultado-editar-row">
              <input type="text" readOnly value={linkEdicion} onFocus={(e) => e.target.select()} />
              <button type="button" onClick={handleCopiarLink}>
                {copiado ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2} />}
                {copiado ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="crear-invitacion__preview">
        {vistaMobile ? (
          <div className="crear-invitacion__preview-mobile-wrap">
            <MobilePreviewFrame>
              <InvitacionPage config={config} saltarBienvenida />
            </MobilePreviewFrame>
          </div>
        ) : (
          <div className="crear-invitacion__preview-frame">
            <InvitacionPage
              config={config}
              saltarBienvenida
              editable
              onFieldChange={handleChange}
              onArchivoChange={handleArchivoGenerico}
            />
          </div>
        )}
      </div>
    </div>
  )
}
