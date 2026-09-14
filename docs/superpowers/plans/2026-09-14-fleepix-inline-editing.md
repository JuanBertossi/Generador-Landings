# Fleepix Inline Editing (Preview Click-to-Edit) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the user edit landing-fleepix content by clicking directly on the
live preview (text becomes editable in place, photos open a file picker on
click), instead of the long sidebar form — piloted on this one theme first.

**Architecture:** Two new reusable components (`EditableText`, `EditableImagen`)
read an `EditableContext` (`{editable, onChange, onArchivoChange, ...}`) provided
by `LandingPage.tsx`. When `editable=false` (public/example pages) they render
exactly what they render today — zero behavior change there. When `editable=true`
(the creator page), they become click-to-edit. The sidebar in
`CrearLandingFleepixPage.tsx` shrinks to only what has no on-page visual
representation: colors, raw WhatsApp numbers, icon pickers, checkboxes, and the
publish/domain block.

**Tech Stack:** React 19, TypeScript, native `contentEditable` (no rich-text
library — we want plain text only), existing `subirArchivo`/`eliminarArchivo`
for uploads, existing `usePaginaPersistida` autosave (untouched).

**No automated tests:** this project has no test runner configured (`package.json`
has no `test` script, no Vitest/Jest/RTL installed) and this is UI/interaction
work (`contentEditable` behavior is notoriously unreliable in jsdom anyway).
Verification is manual, in the browser, against `pnpm dev` — steps say exactly
what to click and what you should see. Per project rules, no Playwright/browser
automation is used unless the user explicitly asks for it.

---

## Task 1: Shared editable primitives

**Files:**
- Create: `src/shared/components/EditableContext.tsx`
- Create: `src/shared/components/EditableText.tsx`
- Create: `src/shared/components/EditableImagen.tsx`
- Create: `src/shared/styles/editable.css`
- Modify: `src/app/main.tsx`

- [ ] **Step 1: Create the context**

`src/shared/components/EditableContext.tsx`:

```tsx
import { createContext, useContext } from 'react'

export type EditableCtx = {
  editable: boolean
  onChange: (path: string, value: string) => void
  onArchivoChange: (path: string, file: File) => void
  onAgregarFaq: () => void
  onQuitarFaq: (i: number) => void
  onAgregarContactoBullet: () => void
  onQuitarContactoBullet: (i: number) => void
}

const noop = () => {}
const noopIdx = (_i: number) => {}

const defaultCtx: EditableCtx = {
  editable: false,
  onChange: noop,
  onArchivoChange: noop,
  onAgregarFaq: noop,
  onQuitarFaq: noopIdx,
  onAgregarContactoBullet: noop,
  onQuitarContactoBullet: noopIdx,
}

const EditableContext = createContext<EditableCtx>(defaultCtx)

export const EditableProvider = EditableContext.Provider

export function useEditable() {
  return useContext(EditableContext)
}
```

- [ ] **Step 2: Create `EditableText`**

`src/shared/components/EditableText.tsx`:

```tsx
import { useState, type CSSProperties, type ReactNode, type KeyboardEvent, type ClipboardEvent, type FocusEvent } from 'react'
import { useEditable } from './EditableContext'

type Tag = 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div'

type EditableTextProps = {
  path: string
  value: string
  as?: Tag
  multiline?: boolean
  className?: string
  style?: CSSProperties
  placeholder?: string
  /** Cómo se ve el valor cuando NO se está editando (ej: textoConEnfasis del tema). */
  render?: (value: string) => ReactNode
}

/**
 * Texto clickeable-para-editar dentro del preview de un formulario de
 * creación. Con editable=false (páginas públicas/ejemplo) es un <Tag> normal,
 * sin ningún cambio de comportamiento respecto a antes de este componente.
 */
export function EditableText({
  path,
  value,
  as = 'span',
  multiline = false,
  className,
  style,
  placeholder,
  render,
}: EditableTextProps) {
  const { editable, onChange } = useEditable()
  const [editando, setEditando] = useState(false)
  const Tag = as

  if (!editable) {
    return <Tag className={className} style={style}>{render ? render(value) : value}</Tag>
  }

  function handlePaste(e: ClipboardEvent<HTMLElement>) {
    e.preventDefault()
    const texto = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, texto)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault()
      e.currentTarget.blur()
    }
  }

  function handleBlur(e: FocusEvent<HTMLElement>) {
    setEditando(false)
    onChange(path, e.currentTarget.textContent ?? '')
  }

  return (
    <Tag
      className={`${className ?? ''} editable-text`.trim()}
      style={style}
      data-placeholder={placeholder}
      contentEditable
      suppressContentEditableWarning
      onFocus={() => setEditando(true)}
      onBlur={handleBlur}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
    >
      {editando ? value : render ? render(value) : value}
    </Tag>
  )
}
```

- [ ] **Step 3: Create `EditableImagen`**

`src/shared/components/EditableImagen.tsx`:

```tsx
import { useRef, type CSSProperties } from 'react'
import { useEditable } from './EditableContext'

type EditableImagenProps = {
  path: string
  src: string
  alt?: string
  className?: string
  style?: CSSProperties
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
}

/**
 * Foto clickeable-para-reemplazar dentro del preview de un formulario de
 * creación. Con editable=false es un <img> normal. El wrapper usa
 * display:contents para no crear una caja propia — muchas de estas fotos
 * dependen de que su padre DIRECTO tenga position:relative (className
 * "absolute inset-0 ..."), y una caja intermedia rompería ese layout.
 */
export function EditableImagen({
  path,
  src,
  alt = '',
  className,
  style,
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
}: EditableImagenProps) {
  const { editable, onArchivoChange } = useEditable()
  const inputRef = useRef<HTMLInputElement>(null)

  const img = (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
    />
  )

  if (!editable) return img

  return (
    <div
      className="editable-imagen"
      style={{ display: 'contents' }}
      onClick={() => inputRef.current?.click()}
    >
      {img}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onArchivoChange(path, file)
        }}
      />
    </div>
  )
}
```

- [ ] **Step 4: Affordance styles**

`src/shared/styles/editable.css` (plain CSS, no `@import "tailwindcss"` — this
file is loaded once globally from `main.tsx`, same pattern as
`shared/styles/global.css`; it must stay Tailwind-free so it can never repeat
the duplicate-Tailwind-layer bug fixed earlier this session):

```css
.editable-text {
  position: relative;
  cursor: text;
  outline: 1px dashed transparent;
  outline-offset: 3px;
  border-radius: 2px;
  transition: outline-color 0.15s ease;
}
.editable-text:hover {
  outline-color: color-mix(in srgb, currentColor 40%, transparent);
}
.editable-text:hover::after {
  content: "✎";
  position: absolute;
  top: -8px;
  right: -14px;
  font-size: 11px;
  opacity: 0.7;
}
.editable-text:focus {
  outline: 1px solid #16a37e;
  outline-offset: 3px;
}
.editable-text:focus::after {
  content: none;
}
.editable-text:empty::before {
  content: attr(data-placeholder);
  opacity: 0.45;
}

.editable-imagen {
  cursor: pointer;
}
.editable-imagen:hover img {
  outline: 2px dashed #16a37e;
  outline-offset: -2px;
}
```

The pencil icon (`::after`) only applies to `EditableText` — `EditableImagen`
uses a `display:contents` wrapper (Step 3) specifically so it never becomes a
positioning context, since several photos rely on their DIRECT parent being
`position:relative` for `className="absolute inset-0 ..."` to work. Adding a
pencil there would require an extra positioned box and risk that exact
layout, so images get the dashed hover outline only — the cursor already
becoming a pointer plus that outline is enough of a "this is clickable" cue
for something as unambiguous as a full-bleed photo.

- [ ] **Step 5: Import the stylesheet once, globally**

Modify `src/app/main.tsx`:

```diff
 import { StrictMode } from "react";
 import { createRoot } from "react-dom/client";
 import { AppRoutes } from "./routes";
 import "@/shared/styles/global.css";
+import "@/shared/styles/editable.css";
```

- [ ] **Step 6: Manual check**

Run `pnpm dev`, open `/`. Nothing should look different (these files aren't
wired into any page yet). Confirm the dev server compiles with no errors in
the terminal.

- [ ] **Step 7: Commit**

```bash
git add src/shared/components/EditableContext.tsx src/shared/components/EditableText.tsx src/shared/components/EditableImagen.tsx src/shared/styles/editable.css src/app/main.tsx
git commit -m "feat: add EditableText/EditableImagen inline-editing primitives"
```

(Skip this step if the project isn't a git repo — it currently isn't. Just
move on to Task 2.)

---

## Task 2: Wire `LandingPage.tsx` to provide the context

**Files:**
- Modify: `src/features/tema-landing-fleepix/views/LandingPage.tsx`

- [ ] **Step 1: Add the new props and wrap the tree in the provider**

Current file (for reference, unchanged parts omitted):

```tsx
export default function LandingPage({
  config = fleepixDefaultConfig,
  paginaId = null,
}: {
  config?: LandingFleepixConfig
  paginaId?: string | null
}) {
  ...
  return (
    <div id="site" ref={proteccionRef} style={coloresPersonalizados}>
      <Navbar config={config} />
      <Hero config={config} />
      <ParaQuien config={config} />
      <Beneficios config={config} />
      <Funcionalidades config={config} />
      <Faq config={config} />
      <ContactForm config={config} paginaId={paginaId} />
      <Footer config={config} />
    </div>
  )
}
```

Replace with:

```tsx
import { useEffect } from 'react'
import '../shared/styles/global.css'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { ParaQuien } from '../components/ParaQuien'
import { Beneficios } from '../components/Beneficios'
import { Funcionalidades } from '../components/Funcionalidades'
import { Faq } from '../components/Faq'
import { ContactForm } from '../components/ContactForm'
import { Footer } from '../components/Footer'
import { fleepixDefaultConfig, type LandingFleepixConfig } from '../config'
import { useProteccionBasica } from '@/shared/hooks/useProteccionBasica'
import { derivarPaleta } from '../lib/paletaDerivada'
import { EditableProvider } from '@/shared/components/EditableContext'

type LandingPageProps = {
  config?: LandingFleepixConfig
  paginaId?: string | null
  editable?: boolean
  onFieldChange?: (path: string, value: string) => void
  onArchivoChange?: (path: string, file: File) => void
  onAgregarFaq?: () => void
  onQuitarFaq?: (i: number) => void
  onAgregarContactoBullet?: () => void
  onQuitarContactoBullet?: (i: number) => void
}

export default function LandingPage({
  config = fleepixDefaultConfig,
  paginaId = null,
  editable = false,
  onFieldChange,
  onArchivoChange,
  onAgregarFaq,
  onQuitarFaq,
  onAgregarContactoBullet,
  onQuitarContactoBullet,
}: LandingPageProps) {
  const proteccionRef = useProteccionBasica()
  useEffect(() => {
    const previo = document.documentElement.getAttribute('data-theme')
    document.documentElement.setAttribute('data-theme', 'light')
    return () => {
      if (previo === null) document.documentElement.removeAttribute('data-theme')
      else document.documentElement.setAttribute('data-theme', previo)
    }
  }, [])

  const coloresPersonalizados = derivarPaleta(config.apariencia)

  return (
    <EditableProvider
      value={{
        editable,
        onChange: onFieldChange ?? (() => {}),
        onArchivoChange: onArchivoChange ?? (() => {}),
        onAgregarFaq: onAgregarFaq ?? (() => {}),
        onQuitarFaq: onQuitarFaq ?? (() => {}),
        onAgregarContactoBullet: onAgregarContactoBullet ?? (() => {}),
        onQuitarContactoBullet: onQuitarContactoBullet ?? (() => {}),
      }}
    >
      <div id="site" ref={proteccionRef} style={coloresPersonalizados}>
        <Navbar config={config} />
        <Hero config={config} />
        <ParaQuien config={config} />
        <Beneficios config={config} />
        <Funcionalidades config={config} />
        <Faq config={config} />
        <ContactForm config={config} paginaId={paginaId} />
        <Footer config={config} />
      </div>
    </EditableProvider>
  )
}
```

- [ ] **Step 2: Manual check**

`pnpm dev`, open `/ejemplos/landing-fleepix` and `/crear/landing-fleepix`. Both
must render exactly as before (no visible change yet — components don't read
the context until later tasks). No console errors.

- [ ] **Step 3: Commit**

```bash
git add "src/features/tema-landing-fleepix/views/LandingPage.tsx"
git commit -m "feat: thread EditableProvider through fleepix LandingPage"
```

---

## Task 3: Navbar + Footer (shared fields: logo, navLinks)

**Files:**
- Modify: `src/features/tema-landing-fleepix/components/Navbar.tsx`
- Modify: `src/features/tema-landing-fleepix/components/Footer.tsx`

`identidad.logoUrl` and `navLinks[].label` render in BOTH components (same
config path) — editing either instance updates the same underlying field.

- [ ] **Step 1: Navbar — logo, nav links, nav CTA**

Modify `src/features/tema-landing-fleepix/components/Navbar.tsx`:

```diff
 import { useState } from 'react'
 import { FleepixLogo } from '@/features/tema-landing-fleepix/shared/components/icons/FleepixLogo'
 import { buildWhatsappUrl } from '@/features/tema-landing-fleepix/shared/lib/whatsapp'
 import type { LandingFleepixConfig } from '../config'
+import { EditableText } from '@/shared/components/EditableText'
+import { EditableImagen } from '@/shared/components/EditableImagen'

 export function Navbar({ config }: { config: LandingFleepixConfig }) {
   const [open, setOpen] = useState(false)
   const ctaUrl = buildWhatsappUrl(config.whatsappNumero, config.whatsappMensajeDemo)

   return (
     <nav className="fixed top-[14px] inset-x-0 z-[100] px-4 max-[480px]:px-3">
       <div className="max-w-[var(--maxw)] mx-auto pl-[22px] pr-4 h-16 flex items-center justify-between gap-6 bg-[var(--navy-500)] border border-[var(--navy-600)] rounded-[14px] shadow-[0_10px_28px_rgba(0,17,23,0.2),0_2px_8px_rgba(0,17,23,0.14)]">
         <a className="flex items-center" href="#inicio" aria-label={config.identidad.nombreEmpresa}>
           {config.identidad.logoUrl ? (
-            <img src={config.identidad.logoUrl} alt={config.identidad.nombreEmpresa} className="h-6 w-auto block" />
+            <EditableImagen
+              path="identidad.logoUrl"
+              src={config.identidad.logoUrl}
+              alt={config.identidad.nombreEmpresa}
+              className="h-6 w-auto block"
+            />
           ) : (
             <FleepixLogo variant="light" className="h-6 w-auto block" />
           )}
         </a>
         <div className="flex items-center gap-[30px] max-[900px]:hidden">
           {config.navLinks.map((link, i) => (
             <a
               key={link.href}
               href={link.href}
               className="text-[var(--navy-200)] text-sm font-medium transition-colors duration-150 hover:text-[var(--azul-300)]"
             >
-              {link.label}
+              <EditableText path={`navLinks.${i}.label`} value={link.label} as="span" />
             </a>
           ))}
         </div>
         <div className="flex items-center gap-3">
           <a
             className="inline-flex items-center justify-center gap-[9px] font-['Inter'] font-semibold text-[14.5px] cursor-pointer rounded-xl px-[22px] py-[10px] border border-transparent transition-[transform,background,border-color,box-shadow] duration-150 whitespace-nowrap bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_6px_22px_color-mix(in_srgb,var(--accent)_28%,transparent)] hover:-translate-y-px hover:bg-[var(--azul-400)] hover:shadow-[0_8px_26px_color-mix(in_srgb,var(--accent)_38%,transparent)] max-[480px]:hidden"
             href={ctaUrl}
             target="_blank"
             rel="noopener noreferrer"
           >
-            {config.navCtaLabel}
+            <EditableText path="navCtaLabel" value={config.navCtaLabel} as="span" />
           </a>
```

The mobile menu (below the desktop nav in the same file) repeats the same 2
fields — apply here too:

```diff
       <div
         className={`max-w-[var(--maxw)] mt-[10px] mx-auto p-3 flex-col gap-1 bg-[var(--navy-500)] border border-[var(--navy-600)] rounded-[14px] shadow-[0_18px_44px_rgba(0,17,23,0.4)] ${open ? 'flex' : 'hidden'}`}
         id="navMobile"
       >
-        {config.navLinks.map((link) => (
+        {config.navLinks.map((link, i) => (
           <a
             key={link.href}
             href={link.href}
             onClick={() => setOpen(false)}
             className="text-[var(--neutro-100)] font-['Sora'] text-[15px] font-medium px-[14px] py-3 rounded-lg transition-colors duration-150 hover:bg-[var(--navy-600)] hover:text-[var(--azul-300)]"
           >
-            {link.label}
+            <EditableText path={`navLinks.${i}.label`} value={link.label} as="span" />
           </a>
         ))}
         <a
           className="inline-flex items-center justify-center gap-[9px] font-['Sora'] font-medium text-[15px] cursor-pointer rounded-lg px-[14px] py-3 border border-transparent transition-[transform,background,border-color,box-shadow] duration-150 whitespace-nowrap bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_6px_22px_color-mix(in_srgb,var(--accent)_28%,transparent)] hover:-translate-y-px hover:bg-[var(--azul-400)] hover:shadow-[0_8px_26px_color-mix(in_srgb,var(--accent)_38%,transparent)] mt-[6px]"
           href={ctaUrl}
           target="_blank"
           rel="noopener noreferrer"
           onClick={() => setOpen(false)}
         >
-          {config.navCtaLabel}
+          <EditableText path="navCtaLabel" value={config.navCtaLabel} as="span" />
         </a>
       </div>
```

- [ ] **Step 2: Footer — logo, description, navLinks, contact text**

Modify `src/features/tema-landing-fleepix/components/Footer.tsx`:

```diff
 import { Mail, Phone, MapPin, Code2 } from 'lucide-react'
 import { Reveal } from '@/features/tema-landing-fleepix/shared/components/Reveal'
 import { FleepixLogo } from '@/features/tema-landing-fleepix/shared/components/icons/FleepixLogo'
 import goodAppsLogo from '@/features/tema-landing-fleepix/shared/assets/footer/logo-goodapps.svg'
 import { buildWhatsappUrl } from '@/features/tema-landing-fleepix/shared/lib/whatsapp'
 import type { LandingFleepixConfig } from '../config'
+import { EditableText } from '@/shared/components/EditableText'
+import { EditableImagen } from '@/shared/components/EditableImagen'
+import { useEditable } from '@/shared/components/EditableContext'

 export function Footer({ config }: { config: LandingFleepixConfig }) {
   const { identidad, navLinks, footer } = config
+  const { editable } = useEditable()
   const whatsappDesarrolloUrl = buildWhatsappUrl(
     footer.contacto.whatsappNumero,
     footer.mensajeWhatsappDesarrolloAMedida,
   )
```

Logo (same field as Navbar):

```diff
             {identidad.logoUrl ? (
-              <img
-                src={identidad.logoUrl}
+              <EditableImagen
+                path="identidad.logoUrl"
+                src={identidad.logoUrl}
                 alt={identidad.nombreEmpresa}
                 className="block h-10 w-auto mb-[22px] -ml-3.5 origin-left transition-transform duration-[250ms] hover:scale-[1.08]"
               />
             ) : (
               <FleepixLogo
                 variant="light"
                 className="block h-10 w-auto mb-[22px] -ml-3.5 origin-left transition-transform duration-[250ms] hover:scale-[1.08]"
               />
             )}
             <p className="text-[13.5px] leading-[1.6] text-[var(--navy-200)] max-w-[34ch] m-0">
-              {footer.descripcion}
+              <EditableText path="footer.descripcion" value={footer.descripcion} as="span" multiline />
             </p>
```

Nav links list (`navLinks.map`):

```diff
             <ul className="list-none m-0 p-0 flex flex-col gap-3">
-              {navLinks.map((link) => (
+              {navLinks.map((link, i) => (
                 <li key={link.href}>
                   <a
                     href={link.href}
                     className="inline-flex items-center gap-[9px] text-[var(--navy-200)] text-sm font-medium transition-colors duration-150 hover:text-[var(--azul-300)]"
                   >
-                    {link.label}
+                    <EditableText path={`navLinks.${i}.label`} value={link.label} as="span" />
                   </a>
                 </li>
               ))}
             </ul>
```

Contact block — email/whatsappTexto/direccion are each guarded by
`footer.contacto.X && (...)`, so when empty and `editable`, nothing renders and
there'd be no way to fill them in by clicking. Force the row to render while
editing:

```diff
             <ul className="list-none m-0 p-0 flex flex-col gap-3">
-              {footer.contacto.email && (
+              {(footer.contacto.email || editable) && (
                 <li className="flex items-center gap-2.5 text-[var(--navy-200)] text-sm">
                   <span className="w-4 h-4 flex-none inline-flex text-[var(--azul-300)]">
                     <Mail size={16} strokeWidth={1.8} />
                   </span>
                   <a
                     href={`mailto:${footer.contacto.email}`}
                     className="inline-flex items-center gap-[9px] font-medium transition-colors duration-150 hover:text-[var(--azul-300)]"
                   >
-                    {footer.contacto.email}
+                    <EditableText
+                      path="footer.contacto.email"
+                      value={footer.contacto.email}
+                      as="span"
+                      placeholder="tu@email.com"
+                    />
                   </a>
                 </li>
               )}
-              {footer.contacto.whatsappNumero && (
+              {(footer.contacto.whatsappNumero || editable) && (
                 <li className="flex items-center gap-2.5 text-[var(--navy-200)] text-sm">
                   <span className="w-4 h-4 flex-none inline-flex text-[var(--azul-300)]">
                     <Phone size={16} strokeWidth={1.8} />
                   </span>
                   <a
                     href={`https://wa.me/${footer.contacto.whatsappNumero}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="inline-flex items-center gap-[9px] font-medium transition-colors duration-150 hover:text-[var(--azul-300)]"
                   >
-                    {footer.contacto.whatsappTexto}
+                    <EditableText
+                      path="footer.contacto.whatsappTexto"
+                      value={footer.contacto.whatsappTexto}
+                      as="span"
+                      placeholder="+54 9 11 ..."
+                    />
                   </a>
                 </li>
               )}
-              {footer.contacto.direccion && (
+              {(footer.contacto.direccion || editable) && (
                 <li className="flex items-center gap-2.5 text-[var(--navy-200)] text-sm">
                   <span className="w-4 h-4 flex-none inline-flex text-[var(--azul-300)]">
                     <MapPin size={16} strokeWidth={1.8} />
                   </span>
-                  <span className="text-[var(--navy-200)] text-sm">{footer.contacto.direccion}</span>
+                  <EditableText
+                    path="footer.contacto.direccion"
+                    value={footer.contacto.direccion}
+                    as="span"
+                    className="text-[var(--navy-200)] text-sm"
+                    placeholder="Tu dirección"
+                  />
                 </li>
               )}
             </ul>
```

`whatsappNumero` itself (the raw digits used to build the link) is NOT wrapped
in `EditableText` here — it has no visible representation, it stays a sidebar
field (Task 8). Note `whatsappNumero="" ` would make `href="https://wa.me/"` a
dead link while empty; that already happens today with the sidebar-only flow,
so it's not a regression.

Copyright line:

```diff
             <span className="text-[var(--navy-300)] text-xs font-semibold min-w-0 overflow-hidden text-ellipsis whitespace-nowrap max-[480px]:whitespace-normal max-[480px]:overflow-visible max-[480px]:text-clip max-[480px]:text-left">
-              {footer.copyrightTexto}
+              <EditableText path="footer.copyrightTexto" value={footer.copyrightTexto} as="span" />
             </span>
```

`footer.redes.*` (social URLs) and the "desarrollo a medida" block stay
untouched here — they're not visible text, they're handled in Task 8
(sidebar).

- [ ] **Step 2: Manual check**

`pnpm dev`, open `/crear/landing-fleepix`. Hover the logo/nav links/footer
text in the preview — dashed outline should appear (from `editable.css`).
Nothing is clickable in a way that changes the config yet on the sidebar side
(Task 8 hasn't shrunk it), so for now confirm: (a) preview still looks
identical to before, (b) hover outlines show up, (c) clicking a nav link text
and typing updates it live in the preview, (d) the OLD sidebar field for the
same value still works too and doesn't fight with it (both write to the same
`config` state; last edit wins, expected until Task 8 removes the sidebar
duplicate).

- [ ] **Step 3: Commit**

```bash
git add "src/features/tema-landing-fleepix/components/Navbar.tsx" "src/features/tema-landing-fleepix/components/Footer.tsx"
git commit -m "feat: inline-editable logo, nav links, footer contact text"
```

---

## Task 4: Hero

**Files:**
- Modify: `src/features/tema-landing-fleepix/components/Hero.tsx`

- [ ] **Step 1: Wrap eyebrow, title, description, both CTAs, both photos**

```diff
-import { ArrowRight, PlayCircle } from "lucide-react";
+import { ArrowRight, PlayCircle } from "lucide-react";
 import { buildWhatsappUrl } from "@/features/tema-landing-fleepix/shared/lib/whatsapp";
 import { textoConEnfasis } from "../lib/textoConEnfasis";
 import type { LandingFleepixConfig } from "../config";
+import { EditableText } from "@/shared/components/EditableText";
+import { EditableImagen } from "@/shared/components/EditableImagen";
```

```diff
               <img
                 className="absolute inset-0 w-full h-full object-cover object-center [backface-visibility:hidden] [-webkit-backface-visibility:hidden] rounded-[var(--r-block)]"
                 src={config.hero.fotoPrincipal}
                 alt=""
                 width={1024}
                 height={1204}
                 fetchPriority="high"
                 loading="eager"
                 decoding="async"
               />
               <img
                 className="absolute inset-0 w-full h-full object-cover object-center [backface-visibility:hidden] [-webkit-backface-visibility:hidden] rounded-[var(--r-block)] [transform:rotateY(180deg)]"
                 src={config.hero.fotoSecundaria}
                 alt=""
                 width={1024}
                 height={1204}
                 loading="lazy"
                 decoding="async"
               />
```

becomes:

```tsx
              <EditableImagen
                path="hero.fotoPrincipal"
                src={config.hero.fotoPrincipal}
                className="absolute inset-0 w-full h-full object-cover object-center [backface-visibility:hidden] [-webkit-backface-visibility:hidden] rounded-[var(--r-block)]"
                width={1024}
                height={1204}
                loading="eager"
              />
              <EditableImagen
                path="hero.fotoSecundaria"
                src={config.hero.fotoSecundaria}
                className="absolute inset-0 w-full h-full object-cover object-center [backface-visibility:hidden] [-webkit-backface-visibility:hidden] rounded-[var(--r-block)] [transform:rotateY(180deg)]"
                width={1024}
                height={1204}
              />
```

(`fetchPriority="high"` drops off the first image — `EditableImagen` doesn't
expose that prop, it's a minor perf hint only used in production, not worth
widening the component's API for. Not a functional change.)

Eyebrow badge:

```diff
           <span className="inline-flex items-center gap-[9px] border rounded-[var(--r-sm)] px-[13px] py-[6px] font-['Sora'] font-semibold text-[11px] tracking-[0.14em] uppercase relative z-[1] bg-[color-mix(in_srgb,var(--navy-900)_45%,transparent)] border-[color-mix(in_srgb,var(--neutro-100)_22%,transparent)] text-[var(--navy-100)] backdrop-blur-[4px]">
-            <span className="w-[7px] h-[7px] rounded-[r-pixel] bg-[var(--azul-400)]"></span>{config.hero.eyebrow}
+            <span className="w-[7px] h-[7px] rounded-[var(--r-pixel)] bg-[var(--azul-400)]"></span>
+            <EditableText path="hero.eyebrow" value={config.hero.eyebrow} as="span" />
           </span>
```

Title, description, buttons:

```diff
             <h1 className="font-['Sora'] font-bold text-[clamp(34px,4vw,60px)] max-[768px]:text-[clamp(30px,7vw,42px)] leading-[1.03] max-[768px]:leading-[1.18] tracking-[-0.03em] m-0 text-balance">
-              {textoConEnfasis(config.hero.titulo)}
+              <EditableText path="hero.titulo" value={config.hero.titulo} as="span" multiline render={textoConEnfasis} />
             </h1>
             <div className="flex flex-col gap-[26px]">
               <p className="text-[16.5px] text-[var(--text-soft)] m-0 leading-[1.62] max-w-[50ch]">
-                {config.hero.descripcion}
+                <EditableText path="hero.descripcion" value={config.hero.descripcion} as="span" multiline />
               </p>
```

```diff
                 >
-                  {config.hero.cta1Label}
+                  <EditableText path="hero.cta1Label" value={config.hero.cta1Label} as="span" />
                   <ArrowRight className="w-[17px] h-[17px] flex-none" strokeWidth={2.4} />
```

```diff
                   <PlayCircle className="w-auto h-auto text-[20px] flex-none" strokeWidth={2} />
-                  {config.hero.cta2Label}
+                  <EditableText path="hero.cta2Label" value={config.hero.cta2Label} as="span" />
```

`h1` wrapping an inline `<span>` from `EditableText` is fine — `as="span"`
default renders a `<span>` inside the real `<h1>`, matching how
`textoConEnfasis` already returns inline nodes today.

- [ ] **Step 2: Manual check**

`/crear/landing-fleepix`: click the hero title — see the raw `==...==` text,
type, click away — see it re-render highlighted. Click the hero photo — file
picker opens; pick an image — preview updates, then swaps to the uploaded URL
a moment later (same as before, just triggered by click instead of the
sidebar's file input).

- [ ] **Step 3: Commit**

```bash
git add "src/features/tema-landing-fleepix/components/Hero.tsx"
git commit -m "feat: inline-editable hero copy and photos"
```

---

## Task 5: ParaQuien

**Files:**
- Modify: `src/features/tema-landing-fleepix/components/ParaQuien.tsx`

- [ ] **Step 1: Wrap eyebrow/title/description, both text cards, both photo cards**

```diff
 import { Check } from "lucide-react";
 import { Reveal } from "@/features/tema-landing-fleepix/shared/components/Reveal";
 import type { LandingFleepixConfig } from "../config";
+import { EditableText } from "@/shared/components/EditableText";
+import { EditableImagen } from "@/shared/components/EditableImagen";
```

```diff
           <span className="inline-block font-['Sora'] font-bold text-[12.5px] text-[var(--verde-600)] tracking-[0.14em] mb-4">
-            {paraQuien.eyebrow}
+            <EditableText path="paraQuien.eyebrow" value={paraQuien.eyebrow} as="span" />
           </span>
           <h2 className="font-['Sora'] font-bold text-[clamp(30px,3.4vw,46px)] leading-[1.05] tracking-[-0.03em] mb-5 text-[var(--navy-500)] text-balance max-[768px]:text-[clamp(26px,6vw,36px)] max-[480px]:text-[clamp(23px,7.5vw,30px)]">
-            {paraQuien.titulo}
+            <EditableText path="paraQuien.titulo" value={paraQuien.titulo} as="span" />
           </h2>
           <p className="text-[var(--text-soft)] text-base leading-[1.62] max-w-[34ch] max-[768px]:max-w-none">
-            {paraQuien.descripcion}
+            <EditableText path="paraQuien.descripcion" value={paraQuien.descripcion} as="span" multiline />
           </p>
```

Text card 1 (`tarjetaTexto1`) — title, description, and each bullet:

```diff
             <h3 className="font-['Sora'] text-[clamp(18px,1.7vw,22px)] font-semibold mb-2 tracking-[-0.01em] text-[var(--navy-900)]">
-              {paraQuien.tarjetaTexto1.titulo}
+              <EditableText path="paraQuien.tarjetaTexto1.titulo" value={paraQuien.tarjetaTexto1.titulo} as="span" />
             </h3>
             <p className="text-[clamp(13px,1.05vw,14px)] leading-[1.5] mb-4 text-[var(--navy-900)]">
-              {paraQuien.tarjetaTexto1.descripcion}
+              <EditableText path="paraQuien.tarjetaTexto1.descripcion" value={paraQuien.tarjetaTexto1.descripcion} as="span" multiline />
             </p>
             <ul className="list-none flex flex-col gap-2 m-0 text-[clamp(12.5px,1vw,13.5px)]">
-              {paraQuien.tarjetaTexto1.bullets.map((bullet) => (
-                <li key={bullet} className="flex items-center gap-3 text-sm text-[var(--navy-900)] font-medium">
+              {paraQuien.tarjetaTexto1.bullets.map((bullet, i) => (
+                <li key={i} className="flex items-center gap-3 text-sm text-[var(--navy-900)] font-medium">
                   <span className="w-[23px] h-[23px] flex-none rounded-[var(--r-sm)] bg-[color-mix(in_srgb,var(--navy-900)_12%,transparent)] flex items-center justify-center">
                     <Check size={13} strokeWidth={3.2} color="var(--navy-900)" />
                   </span>
-                  {bullet}
+                  <EditableText path={`paraQuien.tarjetaTexto1.bullets.${i}`} value={bullet} as="span" />
                 </li>
               ))}
             </ul>
```

(`key={bullet}` → `key={i}`: needed because two bullets could have identical
text while one is mid-edit; keying by index avoids a React remount that would
kick you out of the field you're typing in.)

Photo card 1 (`tarjetaFoto1`) — badge text + photo:

```diff
             <span className="inline-block font-['Sora'] bg-[var(--navy-500)] text-white border border-[var(--navy-500)] text-[11.5px] font-semibold tracking-[0.08em] uppercase px-3 py-1.5 rounded-[var(--r-sm)] mb-0 relative z-[1] shadow-[0_6px_18px_rgba(0,37,52,0.35)]">
-              {paraQuien.tarjetaFoto1.badge}
+              <EditableText path="paraQuien.tarjetaFoto1.badge" value={paraQuien.tarjetaFoto1.badge} as="span" />
             </span>
-            <img
-              src={paraQuien.tarjetaFoto1.foto}
+            <EditableImagen
+              path="paraQuien.tarjetaFoto1.foto"
+              src={paraQuien.tarjetaFoto1.foto}
               alt={paraQuien.tarjetaFoto1.badge}
               className="absolute inset-0 w-full h-full object-cover object-[60%_25%]"
               width={1024}
               height={1204}
-              loading="lazy"
-              decoding="async"
             />
```

Photo card 2 (`tarjetaFoto2`) — badge text + photo:

```diff
             <span className="inline-block font-['Sora'] bg-[var(--navy-500)] text-white border border-[var(--navy-500)] text-[11.5px] font-semibold tracking-[0.08em] uppercase px-3 py-1.5 rounded-[var(--r-sm)] mb-0 relative z-[1] shadow-[0_6px_18px_rgba(0,37,52,0.35)]">
-              {paraQuien.tarjetaFoto2.badge}
+              <EditableText path="paraQuien.tarjetaFoto2.badge" value={paraQuien.tarjetaFoto2.badge} as="span" />
             </span>
-            <img
-              src={paraQuien.tarjetaFoto2.foto}
+            <EditableImagen
+              path="paraQuien.tarjetaFoto2.foto"
+              src={paraQuien.tarjetaFoto2.foto}
               alt={paraQuien.tarjetaFoto2.badge}
               className="absolute inset-0 w-full h-full object-cover object-center"
               width={1024}
               height={1204}
-              loading="lazy"
-              decoding="async"
             />
```

Text card 2 (`tarjetaTexto2`) — title, description, bullets:

```diff
             <h3 className="font-['Sora'] text-[clamp(18px,1.7vw,22px)] font-semibold mb-2 tracking-[-0.01em] text-[var(--navy-900)]">
-              {paraQuien.tarjetaTexto2.titulo}
+              <EditableText path="paraQuien.tarjetaTexto2.titulo" value={paraQuien.tarjetaTexto2.titulo} as="span" />
             </h3>
             <p className="text-[clamp(13px,1.05vw,14px)] leading-[1.5] mb-4 text-[var(--navy-900)]">
-              {paraQuien.tarjetaTexto2.descripcion}
+              <EditableText path="paraQuien.tarjetaTexto2.descripcion" value={paraQuien.tarjetaTexto2.descripcion} as="span" multiline />
             </p>
             <ul className="list-none flex flex-col gap-2 m-0 text-[clamp(12.5px,1vw,13.5px)]">
-              {paraQuien.tarjetaTexto2.bullets.map((bullet) => (
-                <li key={bullet} className="flex items-center gap-3 text-sm text-[var(--navy-900)] font-medium">
+              {paraQuien.tarjetaTexto2.bullets.map((bullet, i) => (
+                <li key={i} className="flex items-center gap-3 text-sm text-[var(--navy-900)] font-medium">
                   <span className="w-[23px] h-[23px] flex-none rounded-[var(--r-sm)] bg-[color-mix(in_srgb,var(--navy-900)_12%,transparent)] flex items-center justify-center">
                     <Check size={13} strokeWidth={3.2} color="var(--navy-900)" />
                   </span>
-                  {bullet}
+                  <EditableText path={`paraQuien.tarjetaTexto2.bullets.${i}`} value={bullet} as="span" />
                 </li>
               ))}
             </ul>
```

- [ ] **Step 2: Manual check**

`/crear/landing-fleepix`, scroll preview to "¿Para quién?" — click each
title/description/bullet/badge and confirm it edits in place; click both
photos and confirm the file picker opens.

- [ ] **Step 3: Commit**

```bash
git add "src/features/tema-landing-fleepix/components/ParaQuien.tsx"
git commit -m "feat: inline-editable ParaQuien section"
```

---

## Task 6: Beneficios

**Files:**
- Modify: `src/features/tema-landing-fleepix/components/Beneficios.tsx`

Icon choice per item stays in the sidebar (Task 8) — it's a preset picker, not
free text/photo, so it's out of scope for click-to-edit in this pilot.

- [ ] **Step 1: Wrap eyebrow/title/description and each item's title/body**

```diff
 import { Reveal } from "@/features/tema-landing-fleepix/shared/components/Reveal";
 import { getIcono } from "../lib/iconos";
 import { textoConEnfasis } from "../lib/textoConEnfasis";
 import type { LandingFleepixConfig } from "../config";
+import { EditableText } from "@/shared/components/EditableText";
```

```diff
           <span className="inline-block font-['Sora'] font-bold text-[12.5px] text-[var(--accent)] tracking-[0.14em] mb-[14px]">
-            {beneficios.eyebrow}
+            <EditableText path="beneficios.eyebrow" value={beneficios.eyebrow} as="span" />
           </span>
           <h2 className="font-['Sora'] font-bold text-[clamp(28px,3.4vw,44px)] max-[768px]:text-[clamp(26px,6vw,36px)] max-[480px]:text-[clamp(23px,7.5vw,30px)] tracking-[-0.02em] mb-4 leading-[1.1] text-balance">
-            {textoConEnfasis(beneficios.titulo)}
+            <EditableText path="beneficios.titulo" value={beneficios.titulo} as="span" render={textoConEnfasis} />
           </h2>
-          <p className="text-[var(--text-soft)] text-[16.5px] leading-[1.6]">{beneficios.descripcion}</p>
+          <p className="text-[var(--text-soft)] text-[16.5px] leading-[1.6]">
+            <EditableText path="beneficios.descripcion" value={beneficios.descripcion} as="span" multiline />
+          </p>
```

```diff
           {beneficios.items.map((b, i) => {
             const Icono = getIcono(b.icono);
             return (
               <Reveal
                 as="article"
                 index={i}
-                key={b.titulo}
+                key={i}
                 className="..."
               >
                 <div className="w-[52px] h-[52px] flex-none rounded-[var(--r-md)] mb-[22px] flex items-center justify-center bg-[var(--verde-100)] border border-[var(--verde-500)] text-[var(--verde-500)]">
                   <Icono size={26} />
                 </div>
                 <div className="p-0">
                   <h3 className="font-['Sora'] text-[20px] font-semibold m-0 mb-[11px] tracking-[-0.01em]">
-                    {b.titulo}
+                    <EditableText path={`beneficios.items.${i}.titulo`} value={b.titulo} as="span" />
                   </h3>
                   <p className="text-[var(--text-soft)] text-[14px] leading-[1.65] m-0 [&_strong]:text-[var(--navy-500)] [&_strong]:font-semibold">
-                    {textoConEnfasis(b.cuerpo)}
+                    <EditableText path={`beneficios.items.${i}.cuerpo`} value={b.cuerpo} as="span" multiline render={textoConEnfasis} />
                   </p>
                 </div>
               </Reveal>
             );
           })}
```

(`key={b.titulo}` → `key={i}` for the same reason as Task 5's bullets.)

- [ ] **Step 2: Manual check**

`/crear/landing-fleepix`, "Beneficios" section — click each of the 3 cards'
title/body and confirm inline edit works; confirm the icon still shows
correctly (untouched, still driven by the sidebar select for now).

- [ ] **Step 3: Commit**

```bash
git add "src/features/tema-landing-fleepix/components/Beneficios.tsx"
git commit -m "feat: inline-editable Beneficios section"
```

---

## Task 7: Funcionalidades

**Files:**
- Modify: `src/features/tema-landing-fleepix/components/Funcionalidades.tsx`

`chipIcono` stays sidebar-only (same reasoning as Beneficios' icon).

- [ ] **Step 1: Wrap eyebrow/title/description, nav labels, and each card**

```diff
 import { ArrowRight } from "lucide-react";
 import "@/features/tema-landing-fleepix/styles/funcionalidades/funcionalidades.css";
 import { useFuncionalidadesStack } from "../hooks/useFuncionalidadesStack";
 import { getIcono } from "../lib/iconos";
 import type { LandingFleepixConfig } from "../config";
+import { EditableText } from "@/shared/components/EditableText";
+import { EditableImagen } from "@/shared/components/EditableImagen";
```

```diff
             <span className="inline-block font-['Sora'] font-bold text-[12.5px] text-[var(--azul-300)] tracking-[0.14em] mb-[14px]">
-              {funcionalidades.eyebrow}
+              <EditableText path="funcionalidades.eyebrow" value={funcionalidades.eyebrow} as="span" />
             </span>
             <h2 className="font-['Sora'] font-bold text-[clamp(28px,3.4vw,44px)] max-[768px]:text-[clamp(26px,6vw,36px)] max-[480px]:text-[clamp(23px,7.5vw,30px)] tracking-[-0.02em] mb-[14px] leading-[1.1] text-balance text-[var(--neutro-100)]">
-              {funcionalidades.titulo}
+              <EditableText path="funcionalidades.titulo" value={funcionalidades.titulo} as="span" />
             </h2>
             <p className="text-[var(--navy-200)] text-[15.5px] leading-[1.6] mb-[26px] max-w-[38ch] max-[768px]:max-w-none">
-              {funcionalidades.descripcion}
+              <EditableText path="funcionalidades.descripcion" value={funcionalidades.descripcion} as="span" multiline />
             </p>
```

Side nav labels — these are also the click-to-scroll buttons, so wrap only the
label span, not the whole button (the button's own `onClick` must keep
working; `EditableText`'s own click-to-focus and the button's scroll-click
would otherwise fight — clicking the label text edits it, clicking anywhere
else on the button row still scrolls):

```diff
             {funcionalidades.items.map((item, i) => (
               <button
-                key={item.navLabel}
+                key={i}
                 className={`...`}
                 onClick={() => scrollToCard(i)}
               >
                 <span className={`...`}>
                   <ArrowRight size={18} strokeWidth={2.2} />
                 </span>
-                {item.navLabel}
+                <EditableText path={`funcionalidades.items.${i}.navLabel`} value={item.navLabel} as="span" />
               </button>
             ))}
```

Each stacked card — chip label, title, description, photo:

```diff
           {funcionalidades.items.map((item, i) => {
             const ChipIcono = getIcono(item.chipIcono);
             return (
               <article
-                key={item.navLabel}
+                key={i}
                 className={FK_CARD_CLASS}
                 ref={(el) => {
                   cardRefs.current[i] = el;
                 }}
               >
                 <div className={FK_SHOT_CLASS}>
-                  <img
-                    src={item.foto}
+                  <EditableImagen
+                    path={`funcionalidades.items.${i}.foto`}
+                    src={item.foto}
                     alt={item.titulo}
                     className="absolute inset-0 w-full h-full object-cover object-center"
                     width={2164}
                     height={1212}
-                    loading="lazy"
-                    decoding="async"
                   />
                 </div>
                 <span className={FK_CHIP_CLASS}>
                   <ChipIcono size={16} />
-                  {item.chipLabel}
+                  <EditableText path={`funcionalidades.items.${i}.chipLabel`} value={item.chipLabel} as="span" />
                 </span>
-                <h3 className={FK_H3_CLASS}>{item.titulo}</h3>
-                <p className={FK_P_CLASS}>{item.descripcion}</p>
+                <h3 className={FK_H3_CLASS}>
+                  <EditableText path={`funcionalidades.items.${i}.titulo`} value={item.titulo} as="span" />
+                </h3>
+                <p className={FK_P_CLASS}>
+                  <EditableText path={`funcionalidades.items.${i}.descripcion`} value={item.descripcion} as="span" multiline />
+                </p>
               </article>
             );
           })}
```

- [ ] **Step 2: Manual check**

`/crear/landing-fleepix`, "Funcionalidades" — click a side-nav label (edits
inline) and separately click elsewhere on that same button (still scrolls to
the card). Click a card's photo/chip/title/description and confirm each edits
independently.

- [ ] **Step 3: Commit**

```bash
git add "src/features/tema-landing-fleepix/components/Funcionalidades.tsx"
git commit -m "feat: inline-editable Funcionalidades section"
```

---

## Task 8: Faq (with inline add/remove)

**Files:**
- Modify: `src/features/tema-landing-fleepix/components/Faq.tsx`

- [ ] **Step 1: Wrap eyebrow/title/description/CTA and each Q&A, add inline +/×**

```diff
 import { useState } from 'react'
-import { ArrowRight, Plus } from 'lucide-react'
+import { ArrowRight, Plus, X } from 'lucide-react'
 import { Reveal } from '@/features/tema-landing-fleepix/shared/components/Reveal'
 import { buildWhatsappUrl } from '@/features/tema-landing-fleepix/shared/lib/whatsapp'
 import type { LandingFleepixConfig } from '../config'
+import { EditableText } from '@/shared/components/EditableText'
+import { useEditable } from '@/shared/components/EditableContext'

 export function Faq({ config }: { config: LandingFleepixConfig }) {
   const [openIdx, setOpenIdx] = useState<number | null>(null)
   const { faq } = config
+  const { editable, onAgregarFaq, onQuitarFaq } = useEditable()
   const ctaUrl = buildWhatsappUrl(config.whatsappNumero, config.whatsappMensajeDemo)
```

```diff
           <span className="inline-block font-['Sora'] font-bold text-[12.5px] text-[var(--accent)] tracking-[0.14em] mb-4">
-            {faq.eyebrow}
+            <EditableText path="faq.eyebrow" value={faq.eyebrow} as="span" />
           </span>
           <h2 className="font-['Sora'] font-bold text-[44px] max-[768px]:text-[clamp(26px,6vw,36px)] max-[480px]:text-[clamp(23px,7.5vw,30px)] leading-[1.05] tracking-[-0.03em] mb-[22px] text-[var(--navy-500)] text-balance">
-            {faq.titulo}
+            <EditableText path="faq.titulo" value={faq.titulo} as="span" />
           </h2>
           <p className="text-[var(--text-soft)] text-base leading-[1.6] mb-[30px] max-w-[34ch]">
-            {faq.descripcion}
+            <EditableText path="faq.descripcion" value={faq.descripcion} as="span" multiline />
           </p>
           <a className="..." href={ctaUrl} target="_blank" rel="noreferrer">
-            {faq.ctaLabel} <ArrowRight className="w-[17px] h-[17px] flex-none" strokeWidth={2.4} />
+            <EditableText path="faq.ctaLabel" value={faq.ctaLabel} as="span" /> <ArrowRight className="w-[17px] h-[17px] flex-none" strokeWidth={2.4} />
           </a>
```

Each item, plus remove button while editable, plus an "add" row at the end:

```diff
         <div className="flex flex-col gap-[14px]">
           {faq.items.map((item, i) => {
             const isOpen = openIdx === i
             return (
               <Reveal
                 as="div"
                 index={i}
-                key={item.pregunta}
+                key={i}
                 className={`...`}
               >
-                <button
-                  type="button"
-                  className="cursor-pointer w-full bg-transparent border-0 text-left font-['Sora'] text-[16.5px] font-semibold text-[var(--navy-500)] px-6 py-4 flex items-center justify-between gap-5"
-                  onClick={() => setOpenIdx(isOpen ? null : i)}
-                >
-                  {item.pregunta}
+                <div className="w-full bg-transparent text-left font-['Sora'] text-[16.5px] font-semibold text-[var(--navy-500)] px-6 py-4 flex items-center justify-between gap-5">
+                  <button
+                    type="button"
+                    className="flex-1 text-left cursor-pointer bg-transparent border-0"
+                    onClick={() => !editable && setOpenIdx(isOpen ? null : i)}
+                  >
+                    <EditableText path={`faq.items.${i}.pregunta`} value={item.pregunta} as="span" />
+                  </button>
+                  {editable && (
+                    <button
+                      type="button"
+                      aria-label="Quitar pregunta"
+                      className="flex-none w-6 h-6 rounded-full flex items-center justify-center text-[var(--text-faint)] hover:text-[#c0392b] hover:bg-[color-mix(in_srgb,#c0392b_10%,transparent)]"
+                      onClick={() => onQuitarFaq(i)}
+                    >
+                      <X size={14} strokeWidth={2.4} />
+                    </button>
+                  )}
                   <span
                     className={`w-[30px] h-[30px] flex-none rounded-[var(--r-sm)] text-[var(--verde-500)] flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
+                    onClick={() => setOpenIdx(isOpen ? null : i)}
+                    style={{ cursor: 'pointer' }}
                   >
                     <Plus size={18} strokeWidth={2.6} />
                   </span>
-                </button>
-                <div className={`overflow-hidden ${isOpen ? 'max-h-[600px]' : 'max-h-0'}`}>
+                </div>
+                <div className={`overflow-hidden ${isOpen || editable ? 'max-h-[600px]' : 'max-h-0'}`}>
                   <div className="px-6 pb-6 text-[var(--text-soft)] text-[14.5px] leading-[1.7] max-w-[62ch]">
-                    {item.respuesta}
+                    <EditableText path={`faq.items.${i}.respuesta`} value={item.respuesta} as="span" multiline />
                   </div>
                 </div>
               </Reveal>
             )
           })}
+          {editable && (
+            <button
+              type="button"
+              className="self-start text-[13px] font-['Sora'] font-semibold text-[var(--accent)] px-6 py-3 cursor-pointer bg-transparent border border-dashed border-[var(--border)] rounded-[var(--r-lg)] hover:border-[var(--accent)]"
+              onClick={onAgregarFaq}
+            >
+              + Agregar pregunta
+            </button>
+          )}
         </div>
```

Why the accordion toggle button changes shape: the question text used to be
the SAME clickable element that both opened the accordion and (now) needs to
become an editable field — those two behaviors conflict on the same element
(clicking to edit vs. clicking to expand). Splitting into an inner button
(question text, still opens on click when not editable) plus a separate
chevron button that always toggles keeps both working. While `editable`, the
answer stays expanded (`isOpen || editable`) so you can always see and edit
`respuesta` without hunting for the toggle state first.

- [ ] **Step 2: Manual check**

`/crear/landing-fleepix`, "Preguntas frecuentes": click a question → edits
inline; click the chevron → still expands/collapses; click the small "×" →
question disappears from the list (and from the FAQ array); click "+ Agregar
pregunta" → a new empty question appears at the end, already expanded, ready
to type into.

- [ ] **Step 3: Commit**

```bash
git add "src/features/tema-landing-fleepix/components/Faq.tsx"
git commit -m "feat: inline-editable FAQ with inline add/remove"
```

---

## Task 9: ContactForm (contactoSeccion content only)

**Files:**
- Modify: `src/features/tema-landing-fleepix/components/ContactForm.tsx`

The actual lead-capture form (`nombre`/`telefono`/`email`/`mensaje`, RHF+Zod)
is real data entry from a site visitor — it is **not** touched by this plan.
Only the surrounding marketing copy (`contactoSeccion.*`) becomes inline.

- [ ] **Step 1: Wrap eyebrow/title/description/bullets(+add/remove)/submit label/success message**

```diff
-import { ArrowRight, Check } from 'lucide-react'
+import { ArrowRight, Check, X } from 'lucide-react'
 import { Reveal } from '@/features/tema-landing-fleepix/shared/components/Reveal'
 import { BgGridCanvas } from './BgGridCanvas'
 import { useContactForm } from '../hooks/useContactForm'
 import type { LandingFleepixConfig } from '../config'
+import { EditableText } from '@/shared/components/EditableText'
+import { useEditable } from '@/shared/components/EditableContext'

 export function ContactForm({ config, paginaId = null }: { config: LandingFleepixConfig; paginaId?: string | null }) {
   const { register, onSubmit, formState: { errors }, sent } = useContactForm(config.whatsappNumero, paginaId)
   const { contactoSeccion } = config
+  const { editable, onAgregarContactoBullet, onQuitarContactoBullet } = useEditable()
```

```diff
             <span className="inline-block font-['Sora'] font-bold text-[12.5px] text-[var(--verde-600)] tracking-[0.14em] mb-[14px]">{contactoSeccion.eyebrow}</span>
-            <h2 className="font-['Sora'] font-bold text-[clamp(28px,3vw,40px)] leading-[1.08] tracking-[-0.02em] text-[var(--navy-500)] mb-[18px] text-balance">{contactoSeccion.titulo}</h2>
-            <p className="text-[var(--text-soft)] text-base leading-[1.6] max-w-[38ch]">{contactoSeccion.descripcion}</p>
+            <span className="inline-block font-['Sora'] font-bold text-[12.5px] text-[var(--verde-600)] tracking-[0.14em] mb-[14px]">
+              <EditableText path="contactoSeccion.eyebrow" value={contactoSeccion.eyebrow} as="span" />
+            </span>
+            <h2 className="font-['Sora'] font-bold text-[clamp(28px,3vw,40px)] leading-[1.08] tracking-[-0.02em] text-[var(--navy-500)] mb-[18px] text-balance">
+              <EditableText path="contactoSeccion.titulo" value={contactoSeccion.titulo} as="span" />
+            </h2>
+            <p className="text-[var(--text-soft)] text-base leading-[1.6] max-w-[38ch]">
+              <EditableText path="contactoSeccion.descripcion" value={contactoSeccion.descripcion} as="span" multiline />
+            </p>
             <ul className="list-none mt-[30px] p-0 flex flex-col gap-[14px]">
-              {contactoSeccion.bullets.map((bullet) => (
-                <li key={bullet} className="flex items-center gap-[11px] font-['Sora'] text-[14.5px] font-medium text-[var(--navy-500)]">
+              {contactoSeccion.bullets.map((bullet, i) => (
+                <li key={i} className="flex items-center gap-[11px] font-['Sora'] text-[14.5px] font-medium text-[var(--navy-500)]">
                   <span className="w-6 h-6 flex-none rounded-[var(--r-sm)] bg-[color-mix(in_srgb,var(--verde-500)_18%,transparent)] border border-[color-mix(in_srgb,var(--verde-500)_30%,transparent)] flex items-center justify-center text-[var(--verde-600)]">
                     <Check size={14} strokeWidth={3} />
                   </span>
-                  {bullet}
+                  <EditableText path={`contactoSeccion.bullets.${i}`} value={bullet} as="span" />
+                  {editable && (
+                    <button
+                      type="button"
+                      aria-label="Quitar punto"
+                      className="flex-none w-5 h-5 rounded-full flex items-center justify-center text-[var(--text-faint)] hover:text-[#c0392b]"
+                      onClick={() => onQuitarContactoBullet(i)}
+                    >
+                      <X size={12} strokeWidth={2.4} />
+                    </button>
+                  )}
                 </li>
               ))}
+              {editable && (
+                <li>
+                  <button
+                    type="button"
+                    className="text-[13px] font-['Sora'] font-semibold text-[var(--verde-600)] cursor-pointer bg-transparent border border-dashed border-[var(--border)] rounded-[var(--r-sm)] px-3 py-1.5 hover:border-[var(--verde-600)]"
+                    onClick={onAgregarContactoBullet}
+                  >
+                    + Agregar punto
+                  </button>
+                </li>
+              )}
             </ul>
```

Success message (shown after the lead form is submitted):

```diff
             {sent ? (
-              <p className="font-['Sora'] text-[17px] font-semibold text-[var(--navy-500)] text-center py-6">{contactoSeccion.mensajeExito}</p>
+              <p className="font-['Sora'] text-[17px] font-semibold text-[var(--navy-500)] text-center py-6">
+                <EditableText path="contactoSeccion.mensajeExito" value={contactoSeccion.mensajeExito} as="span" />
+              </p>
             ) : (
```

Submit button label:

```diff
                 <button type="submit" className="...">
-                  {contactoSeccion.botonEnviar}
+                  <EditableText path="contactoSeccion.botonEnviar" value={contactoSeccion.botonEnviar} as="span" />
                   <ArrowRight className="w-[19px] h-[19px] flex-none" strokeWidth={2.4} />
                 </button>
```

`mensajeExito` only renders after a real successful submit (`sent === true`).
To edit it while building the page, temporarily submit the demo form once
with any values (it's your own preview, nothing is sent anywhere except your
own `leads` table) — this is a known pilot limitation, not worth adding a
"preview toggle" for just one field.

- [ ] **Step 2: Manual check**

`/crear/landing-fleepix`, contact section: click eyebrow/title/description →
inline edit. Click a bullet → edits; click its "×" → removes it; click "+
Agregar punto" → adds one. Click the submit button label → edits (the button
still submits the actual lead form when clicked outside edit mode — note this
means clicking the button while NOT focused-for-edit will both save the lead
row and open WhatsApp, same as before; clicking it briefly focuses for text
edit first only if the click lands on the text itself, same UX as the FAQ
question button in Task 8).

- [ ] **Step 3: Commit**

```bash
git add "src/features/tema-landing-fleepix/components/ContactForm.tsx"
git commit -m "feat: inline-editable contact section copy with inline bullets"
```

---

## Task 10: Shrink the sidebar in `CrearLandingFleepixPage.tsx`

**Files:**
- Modify: `src/features/tema-landing-fleepix/CrearLandingFleepixPage.tsx`

- [ ] **Step 1: Add the generic file handler, drop the two old ones**

```diff
-  function handleFotoChange(path: string, file: File) {
-    const anterior = getPath(config, path) as string | undefined
-    setConfig((prev) => setPath(prev, path, URL.createObjectURL(file)))
-    subirArchivo(file)
-      .then((url) => {
-        setConfig((prev) => setPath(prev, path, url))
-        eliminarArchivo(anterior)
-      })
-      .catch(() => {
-        setConfig((prev) => setPath(prev, path, anterior ?? ''))
-        setErrorPublicar('No pudimos subir el archivo. Probá de nuevo.')
-      })
-  }
+  function handleArchivoGenerico(path: string, file: File) {
+    const anterior = getPath(config, path) as string | undefined
+    setConfig((prev) => setPath(prev, path, URL.createObjectURL(file)))
+    subirArchivo(file)
+      .then((url) => {
+        setConfig((prev) => setPath(prev, path, url))
+        eliminarArchivo(anterior)
+      })
+      .catch(() => {
+        setConfig((prev) => setPath(prev, path, anterior ?? ''))
+        setErrorPublicar('No pudimos subir el archivo. Probá de nuevo.')
+      })
+  }
```

```diff
-  function handleFuncionalidadFoto(i: number, file: File) {
-    const anterior = config.funcionalidades.items[i]?.foto
-    const aplicar = (url: string) =>
-      setConfig((prev) => {
-        const items = [...prev.funcionalidades.items]
-        items[i] = { ...items[i], foto: url }
-        return { ...prev, funcionalidades: { ...prev.funcionalidades, items } }
-      })
-    aplicar(URL.createObjectURL(file))
-    subirArchivo(file)
-      .then((url) => {
-        aplicar(url)
-        eliminarArchivo(anterior)
-      })
-      .catch(() => {
-        if (anterior) aplicar(anterior)
-        setErrorPublicar('No pudimos subir el archivo. Probá de nuevo.')
-      })
-  }
```

(Deleted outright — `handleArchivoGenerico` already covers this path via
`funcionalidades.items.${i}.foto`.)

- [ ] **Step 2: Delete the now-redundant per-array-item text handlers**

These are replaced by `handleChange` (already generic via `setPath`), since
every text field that used to need its own handler is now written from
`EditableText`'s `onChange` callback with a full dotted path:

```diff
-  // --- Bullets de una tarjeta de ParaQuien ---
-  function handleBulletChange(tarjeta: 'tarjetaTexto1' | 'tarjetaTexto2', i: number, value: string) {
-    setConfig((prev) => {
-      const bullets = [...prev.paraQuien[tarjeta].bullets]
-      bullets[i] = value
-      return { ...prev, paraQuien: { ...prev.paraQuien, [tarjeta]: { ...prev.paraQuien[tarjeta], bullets } } }
-    })
-  }
-
-  // --- Beneficios (array de 3) ---
-  function handleBeneficioChange(i: number, campo: 'titulo' | 'cuerpo' | 'icono', value: string) {
-    setConfig((prev) => {
-      const items = [...prev.beneficios.items]
-      items[i] = { ...items[i], [campo]: value }
-      return { ...prev, beneficios: { ...prev.beneficios, items } }
-    })
-  }
-
-  // --- Funcionalidades (array de 6) ---
-  function handleFuncionalidadChange(
-    i: number,
-    campo: 'navLabel' | 'chipIcono' | 'chipLabel' | 'titulo' | 'descripcion',
-    value: string,
-  ) {
-    setConfig((prev) => {
-      const items = [...prev.funcionalidades.items]
-      items[i] = { ...items[i], [campo]: value }
-      return { ...prev, funcionalidades: { ...prev.funcionalidades, items } }
-    })
-  }
-
-  // --- FAQ (array dinámico) ---
-  function handleFaqChange(i: number, campo: 'pregunta' | 'respuesta', value: string) {
-    setConfig((prev) => {
-      const items = [...prev.faq.items]
-      items[i] = { ...items[i], [campo]: value }
-      return { ...prev, faq: { ...prev.faq, items } }
-    })
-  }
+  // --- FAQ (array dinámico) — solo agregar/quitar; el texto de cada
+  // pregunta/respuesta ahora se edita inline en el preview (EditableText). ---
   function agregarFaq() {
     setConfig((prev) => ({ ...prev, faq: { ...prev.faq, items: [...prev.faq.items, { pregunta: '', respuesta: '' }] } }))
   }
   function quitarFaq(i: number) {
     setConfig((prev) => ({ ...prev, faq: { ...prev.faq, items: prev.faq.items.filter((_, idx) => idx !== i) } }))
   }
-
-  // --- Bullets de la sección de contacto (array dinámico) ---
-  function handleContactoBulletChange(i: number, value: string) {
-    setConfig((prev) => {
-      const bullets = [...prev.contactoSeccion.bullets]
-      bullets[i] = value
-      return { ...prev, contactoSeccion: { ...prev.contactoSeccion, bullets } }
-    })
-  }
+
+  // --- Bullets de la sección de contacto (array dinámico) — solo
+  // agregar/quitar; el texto de cada bullet se edita inline. ---
   function agregarContactoBullet() {
     setConfig((prev) => ({ ...prev, contactoSeccion: { ...prev.contactoSeccion, bullets: [...prev.contactoSeccion.bullets, ''] } }))
   }
   function quitarContactoBullet(i: number) {
     setConfig((prev) => ({
       ...prev,
       contactoSeccion: { ...prev.contactoSeccion, bullets: prev.contactoSeccion.bullets.filter((_, idx) => idx !== i) },
     }))
   }
-
-  // --- Etiquetas del menú (cantidad fija, atadas a las secciones de la página) ---
-  function handleNavLinkLabel(i: number, value: string) {
-    setConfig((prev) => {
-      const navLinks = [...prev.navLinks]
-      navLinks[i] = { ...navLinks[i], label: value }
-      return { ...prev, navLinks }
-    })
-  }
```

`handleChange`, `handleCheck`, `handleGenerar`, `handleCopiarLink` are
unchanged — keep them exactly as they are.

- [ ] **Step 3: Pass the new props to `LandingPage`**

```diff
-      <div className="crear-landing__preview">
-        <LandingPage config={config} />
-      </div>
+      <div className="crear-landing__preview">
+        <LandingPage
+          config={config}
+          editable
+          onFieldChange={handleChange}
+          onArchivoChange={handleArchivoGenerico}
+          onAgregarFaq={agregarFaq}
+          onQuitarFaq={quitarFaq}
+          onAgregarContactoBullet={agregarContactoBullet}
+          onQuitarContactoBullet={quitarContactoBullet}
+        />
+      </div>
```

- [ ] **Step 4: Remove the sidebar fields that now live only in the preview**

Delete these `<details>` blocks entirely (their content is 100% covered by
Task 3–9's inline editing, nothing structural was left in them):

- `<summary>Menú</summary>` (navLinks labels + navCtaLabel — both inline now)
- `<summary>Portada (Hero)</summary>` (all 6 fields inline now)
- `<summary>¿Para quién?</summary>` (all 10 fields inline now)
- `<summary>Preguntas frecuentes</summary>` (all fields + add/remove inline now)
- `<summary>Sección de contacto</summary>` (all fields + add/remove inline now)

Shrink these two to just their icon pickers (delete the `Field`/`textarea`
rows, keep only the `<select>` per item):

```diff
         <details className="crear-landing__seccion">
           <summary>Beneficios</summary>
-          <Field label="Etiqueta" path="beneficios.eyebrow" config={config} onChange={handleChange} />
-          <Field label="Título (usá ==así== para resaltar una parte)" path="beneficios.titulo" config={config} onChange={handleChange} />
-          <Field label="Descripción" path="beneficios.descripcion" config={config} onChange={handleChange} textarea />
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
-              <div className="crear-landing__field">
-                <label>Título</label>
-                <input type="text" value={item.titulo} onChange={(e) => handleBeneficioChange(i, 'titulo', e.target.value)} />
-              </div>
-              <div className="crear-landing__field">
-                <label>Texto (usá **así** para resaltar)</label>
-                <textarea value={item.cuerpo} onChange={(e) => handleBeneficioChange(i, 'cuerpo', e.target.value)} />
-              </div>
             </div>
           ))}
         </details>
```

`handleBeneficioChange` was deleted in Step 2 — replace its remaining use
(the icon `<select>`) with a small inline setter, added right above the
`return`:

```diff
+  function handleBeneficioIcono(i: number, value: string) {
+    setConfig((prev) => {
+      const items = [...prev.beneficios.items]
+      items[i] = { ...items[i], icono: value }
+      return { ...prev, beneficios: { ...prev.beneficios, items } }
+    })
+  }
```

```diff
-                <select value={item.icono} onChange={(e) => handleBeneficioChange(i, 'icono', e.target.value)}>
+                <select value={item.icono} onChange={(e) => handleBeneficioIcono(i, e.target.value)}>
```

Same pattern for Funcionalidades — keep only `chipIcono`:

```diff
         <details className="crear-landing__seccion">
           <summary>Funcionalidades</summary>
-          <Field label="Etiqueta" path="funcionalidades.eyebrow" config={config} onChange={handleChange} />
-          <Field label="Título" path="funcionalidades.titulo" config={config} onChange={handleChange} />
-          <Field label="Descripción" path="funcionalidades.descripcion" config={config} onChange={handleChange} textarea />
           {config.funcionalidades.items.map((item, i) => (
             <div className="crear-landing__tarjeta" key={i}>
               <p className="crear-landing__tarjeta-titulo">Funcionalidad {i + 1}</p>
-              <div className="crear-landing__field">
-                <label>Nombre en el menú lateral</label>
-                <input type="text" value={item.navLabel} onChange={(e) => handleFuncionalidadChange(i, 'navLabel', e.target.value)} />
-              </div>
               <div className="crear-landing__field">
                 <label>Ícono de la etiqueta</label>
-                <select value={item.chipIcono} onChange={(e) => handleFuncionalidadChange(i, 'chipIcono', e.target.value)}>
+                <select value={item.chipIcono} onChange={(e) => handleFuncionalidadChipIcono(i, e.target.value)}>
                   {OPCIONES_ICONO.map((key) => (
                     <option key={key} value={key}>
                       {key}
                     </option>
                   ))}
                 </select>
               </div>
-              <div className="crear-landing__field">
-                <label>Texto de la etiqueta</label>
-                <input type="text" value={item.chipLabel} onChange={(e) => handleFuncionalidadChange(i, 'chipLabel', e.target.value)} />
-              </div>
-              <div className="crear-landing__field">
-                <label>Título</label>
-                <input type="text" value={item.titulo} onChange={(e) => handleFuncionalidadChange(i, 'titulo', e.target.value)} />
-              </div>
-              <div className="crear-landing__field">
-                <label>Descripción</label>
-                <textarea value={item.descripcion} onChange={(e) => handleFuncionalidadChange(i, 'descripcion', e.target.value)} />
-              </div>
-              <div className="crear-landing__field">
-                <label>Foto</label>
-                <input type="file" accept="image/*" onChange={(e) => {
-                  const file = e.target.files?.[0]
-                  if (file) handleFuncionalidadFoto(i, file)
-                }} />
-              </div>
             </div>
           ))}
         </details>
```

```diff
+  function handleFuncionalidadChipIcono(i: number, value: string) {
+    setConfig((prev) => {
+      const items = [...prev.funcionalidades.items]
+      items[i] = { ...items[i], chipIcono: value }
+      return { ...prev, funcionalidades: { ...prev.funcionalidades, items } }
+    })
+  }
```

Identidad section: drop the logo file input (now click-to-upload in the
preview), keep company name + WhatsApp fields:

```diff
         <details className="crear-landing__seccion" open>
           <summary>Identidad</summary>
           <Field label="Nombre de tu empresa" path="identidad.nombreEmpresa" config={config} onChange={handleChange} />
-          <CampoFoto label="Logo" path="identidad.logoUrl" config={config} onFotoChange={handleFotoChange} />
           <Field label="WhatsApp (con código de país, sin +)" path="whatsappNumero" config={config} onChange={handleChange} />
           <Field label="Mensaje predefinido del botón de WhatsApp" path="whatsappMensajeDemo" config={config} onChange={handleChange} />
         </details>
```

Footer section: drop everything now inline (descripción, email, whatsapp
texto, dirección, copyright), keep the raw whatsapp number, the "desarrollo a
medida" message + checkbox, and social URLs:

```diff
         <details className="crear-landing__seccion">
           <summary>Pie de página</summary>
-          <Field label="Descripción de tu empresa" path="footer.descripcion" config={config} onChange={handleChange} textarea />
-          <Field label="Email de contacto" path="footer.contacto.email" config={config} onChange={handleChange} />
           <Field label="WhatsApp (con código de país, sin +)" path="footer.contacto.whatsappNumero" config={config} onChange={handleChange} />
-          <Field label="WhatsApp (como se muestra)" path="footer.contacto.whatsappTexto" config={config} onChange={handleChange} />
-          <Field label="Dirección" path="footer.contacto.direccion" config={config} onChange={handleChange} />
-          <Field label="Texto de copyright" path="footer.copyrightTexto" config={config} onChange={handleChange} />
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
```

`CampoFoto` may now be unused in this file — check with a search
(`grep -n "CampoFoto" CrearLandingFleepixPage.tsx`) and delete its
definition too if nothing else calls it.

- [ ] **Step 2: Manual check**

`pnpm dev`, `/crear/landing-fleepix`: sidebar should now only show Identidad
(name + whatsapp raw fields), Apariencia (colors), Beneficios (3 icon
selects), Funcionalidades (6 icon selects), Pie de página (whatsapp raw,
redes URLs, checkbox), subdominio/precio/generar. Every removed field must
still be reachable and editable from the preview (re-check each one from
Tasks 3–9).

- [ ] **Step 3: Commit**

```bash
git add "src/features/tema-landing-fleepix/CrearLandingFleepixPage.tsx"
git commit -m "feat: shrink fleepix sidebar to structural-only fields"
```

---

## Task 11: Full manual regression pass

**Files:** none (verification only)

- [ ] **Step 1: Editable mode end-to-end**

`pnpm dev`, `/crear/landing-fleepix` (no token — fresh page):
1. Every text field from Tasks 3–9 is clickable and edits in place.
2. Every photo is clickable and opens a file picker; upload one, confirm it
   shows immediately and persists after a page refresh with the same URL
   (`?token` in the address bar).
3. FAQ: add 2 questions, remove 1, edit remaining ones.
4. Contact bullets: add 1, remove 1, edit remaining ones.
5. Publish (`Generar landing`) still works and still requires the company
   name (unchanged validation).

- [ ] **Step 2: Read-only modes untouched**

`/ejemplos/landing-fleepix` and a published `/p/:slug` (publish the page from
Step 1 to get a slug): nothing is clickable, no dashed outlines, page renders
identically to before this plan — confirms `editable=false` truly changed
nothing.

- [ ] **Step 3: Note anything that felt off**

This is the point of piloting on one theme before Task 12. Write down
anything janky (cursor jumping, an element that's awkward to click, a field
that got missed) before replicating the pattern to invitación and vortex.

---

## Task 12 (separate, later): Replicate to invitación and landing-vortex

Not part of this plan — do this only after Task 11 feels right in real use.
`EditableText`/`EditableImagen`/`EditableContext` already live in `shared/`,
so each theme repeats Tasks 3–10's per-component pattern against its own
components and its own `Crear*Page.tsx`, with no changes needed to the shared
primitives themselves (unless Task 11 surfaces something to fix there first).
