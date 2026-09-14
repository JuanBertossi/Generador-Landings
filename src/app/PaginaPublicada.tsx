import { lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { obtenerPaginaPublica } from '@/shared/api/paginas.service'
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

  const query = useQuery({
    queryKey: ['pagina-publica', slug],
    queryFn: () => obtenerPaginaPublica<PaginaRow['data']>(slug as string),
    enabled: !!slug,
    staleTime: Infinity,
    retry: false,
  })

  if (query.isLoading) {
    return <div className="pagina-publicada__estado">Cargando…</div>
  }

  const pagina = query.data as PaginaRow | null | undefined

  if (!pagina) {
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
