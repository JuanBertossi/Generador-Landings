# Edición inline en el preview — piloto en landing-fleepix

## Contexto

Hoy, `/crear/landing-fleepix` edita todo desde una sidebar larga con un `<Field>` por
cada texto/color/foto, mientras el preview a la derecha solo muestra el resultado
(no es clickeable). El pedido: que el usuario pueda hacer click directo sobre un
elemento del preview y editarlo ahí mismo, para que se sienta más profesional.

Se evaluaron 3 patrones (salto a la sidebar / edición inline / mini-panel flotante).
Se eligió **edición inline directa**: click en un texto lo vuelve editable en el
lugar; click en una foto abre el selector de archivo directo.

Este documento cubre el **piloto en landing-fleepix únicamente**. Invitación y
landing-vortex se replican después de validar esto en vivo, reusando los mismos
componentes.

## Arquitectura

`LandingPage.tsx` (fleepix) acepta un prop nuevo:

```ts
editable?: boolean // default false
```

Se usa en 3 lugares:
- `/ejemplos/landing-fleepix` → `editable` no se pasa (false) — sin cambios.
- `/p/:slug` (página publicada) → `editable` no se pasa (false) — sin cambios.
- `CrearLandingFleepixPage.tsx` → `editable={true}`.

El mismo componente sirve para los 3 casos. En modo no-editable el comportamiento
es idéntico al actual — cero riesgo para las páginas públicas.

### Componentes nuevos (`src/shared/components/`)

**`EditableText`**
- Props: `value: string`, `path: string`, `onChange: (path, value) => void`,
  `editable: boolean`, `multiline?: boolean`, `as?: 'span' | 'h1' | 'h2' | ...`.
- `editable=false` → renderiza el texto tal cual (mismo output que hoy).
- `editable=true` → al hacer click se vuelve `contentEditable`. Mientras está en
  foco, muestra el texto crudo (con `==destacado==`/`**negrita**` sin parsear).
  Al perder foco (`onBlur`), llama `onChange(path, textoActual)` — mismo
  autoguardado de siempre vía `usePaginaPersistida`, sin tocar ese hook.
- Intercepta `onPaste` y fuerza texto plano (`clipboardData.getData('text/plain')`
  + `insertText`) — sin esto, pegar contenido con formato (Word, Google Docs)
  mete HTML suelto en el config.
- `multiline=false` (default): Enter confirma y saca el foco (`blur()`).
- `multiline=true`: Enter inserta salto de línea, como un textarea.

**`EditableImagen`**
- Props: `src: string`, `path: string`, `onArchivoChange: (path, file) => void`,
  `editable: boolean`, más lo necesario para mostrar la imagen (alt, className,
  estilos de tamaño ya existentes en cada uso).
- `editable=false` → `<img>` normal, igual que hoy.
- `editable=true` → click abre un `<input type=file>` oculto. Reusa
  `subirArchivo`/`eliminarArchivo` y el fix de "revertir a la anterior si falla
  la subida" ya aplicado esta sesión — no se reescribe esa lógica, solo cambia
  el disparador (antes: input visible en sidebar; ahora: click en la imagen).

### Affordance visual

En modo `editable`, hover sobre un elemento editable muestra un borde punteado
sutil + un ícono de lápiz en la esquina. Al hacer click, el borde pasa a sólido.
Mismo lenguaje visual pensado para reusar en los 3 temas más adelante.

## Qué se mueve de la sidebar al preview

**Pasa a editarse por click en el preview** (todo lo que ya es texto/foto visible
en la página):
- `identidad.logoUrl`
- `hero.eyebrow`, `hero.titulo`, `hero.descripcion`, `hero.cta1Label`,
  `hero.cta2Label`, `hero.fotoPrincipal`, `hero.fotoSecundaria`
- `navLinks[].label`, `navCtaLabel`
- Todo el contenido de `paraQuien`, `beneficios.items[]`,
  `funcionalidades.items[]`, `faq.items[]`, `contactoSeccion.*`, `footer.*`
  (excepto el checkbox de abajo)
- `footer.contacto.whatsappTexto` (el texto visible, no el número crudo)

**Queda en la sidebar** (no tiene representación visual directa, o es
estructural):
- `apariencia.colorFondo/colorTexto/colorAcento` (color pickers)
- `whatsappNumero`, `whatsappMensajeDemo` (solo arman el link, no se ven)
- `footer.contacto.whatsappNumero` (ídem)
- `footer.mostrarBloqueDesarrolloAMedida` (checkbox de visibilidad, no contenido)
- El bloque de subdominio/precio/botón "Generar landing"
- El aviso de guardar link

## Manejo de listas (FAQ, bullets de contacto)

El "+ Agregar" pasa a vivir debajo del último ítem, directo en el preview. Cada
ítem muestra una "×" al pasar el mouse para sacarlo. La sidebar deja de tener
estos botones para fleepix — la lista se maneja enteramente desde el preview.

## Errores y validación

- Pegado con formato → forzado a texto plano (ver arriba).
- Campo vacío al perder foco → se guarda vacío, igual que hoy con los `<Field>`
  actuales. No se agrega validación nueva.
- Falla de subida de foto → revierte a la anterior + mensaje de error (fix ya
  aplicado, reusado tal cual).
- Las validaciones existentes antes de publicar (`handleGenerar`: nombre de
  empresa, etc.) no cambian.

## Fuera de alcance de este piloto

- react-hook-form/Zod no aplica acá: esto no es un formulario de envío de datos
  (como `ContactForm`, que ya usa RHF+Zod correctamente) sino un editor de
  contenido en vivo — la validación relevante sigue viviendo en `handleGenerar`.
- Invitación y landing-vortex: se replica el patrón después de validar este
  piloto en vivo. Los componentes `EditableText`/`EditableImagen` quedan en
  `shared/` listos para reusar ahí, lo que resta por tema es solo reemplazar el
  JSX de cada vista + achicar su sidebar.

## Testing

Sin verificación automatizada de browser en este pilot (por política del
proyecto, no se levanta Playwright salvo pedido explícito). Se prueba a mano en
`pnpm dev` contra `/crear/landing-fleepix`. `/ejemplos/landing-fleepix` y
`/p/:slug` sirven como chequeo de que el modo no-editable no cambió.
