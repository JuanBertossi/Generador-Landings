import { lazy, Suspense, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '@/shared/lib/supabaseClient'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'

const InvitacionPageLazy = lazy(() => import('@/features/tema-invitacion/InvitacionPage.jsx'))
const LandingFleepixLazy = lazy(() => import('@/features/tema-landing-fleepix/views/LandingPage'))
const LandingVortexLazy = lazy(() => import('@/features/tema-landing-vortex/views/VortexPage'))

type Tema = 'invitacion' | 'landing-fleepix' | 'landing-vortex'

type PaginaRow = {
  id: string
  tema: Tema
  // Viene de una columna jsonb — la forma real depende de `tema`, cada
  // Lazy de abajo la castea a la config concreta que espera.
  data: any
}

/** Lee una página publicada por su slug y renderiza el tema que corresponda. */
export function PaginaPublicada() {
  const { slug } = useParams<{ slug: string }>()
  // undefined = cargando, null = no existe / no está publicada
  const [pagina, setPagina] = useState<PaginaRow | null | undefined>(undefined)

  useEffect(() => {
    let cancelado = false
    async function cargar() {
      setPagina(undefined)
      const { data, error } = await supabase.rpc('obtener_pagina_publica', { p_slug: slug })
      if (cancelado) return
      const fila = Array.isArray(data) ? data[0] : null
      setPagina(error || !fila ? null : (fila as PaginaRow))
    }
    cargar()
    return () => {
      cancelado = true
    }
  }, [slug])

  if (pagina === undefined) {
    return <div className="pagina-publicada__estado">Cargando…</div>
  }

  if (pagina === null) {
    return (
      <div className="pagina-publicada__estado">
        <p>No encontramos esta página. Puede que el link esté mal o que ya no esté disponible.</p>
        <a href="/">Volver al inicio</a>
      </div>
    )
  }

  return (
    <ErrorBoundary mensaje="No pudimos cargar esta página. Probá recargar.">
      <Suspense fallback={<div className="pagina-publicada__estado">Cargando…</div>}>
        {pagina.tema === 'invitacion' && (
          <InvitacionPageLazy config={pagina.data} saltarBienvenida={false} paginaId={pagina.id as any} />
        )}
        {pagina.tema === 'landing-fleepix' && <LandingFleepixLazy config={pagina.data} paginaId={pagina.id} />}
        {pagina.tema === 'landing-vortex' && <LandingVortexLazy config={pagina.data} />}
      </Suspense>
    </ErrorBoundary>
  )
}
