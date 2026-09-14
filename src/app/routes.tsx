import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, useSearchParams } from "react-router-dom";
import { HomePage } from "./HomePage";
import { PaginaPublicada } from "./PaginaPublicada";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

const InvitacionPageLazy = lazy(
  () => import("@/features/tema-invitacion/InvitacionPage.jsx")
);

// El link real (compartido con invitados) siempre arranca en la pantalla de
// bienvenida. Para la vista previa en vivo del home (?vista=directa) saltamos
// directo al hero — si no, el preview muestra solo la pantalla vacía de "Ingresar".
function InvitacionEjemplo() {
  const [params] = useSearchParams();
  return <InvitacionPageLazy saltarBienvenida={params.get("vista") === "directa"} />;
}
const CrearInvitacion = lazy(
  () => import("@/features/tema-invitacion/CrearInvitacionPage.jsx")
);
const CrearLandingFleepix = lazy(
  () => import("@/features/tema-landing-fleepix/CrearLandingFleepixPage")
);
const LandingFleepixEjemplo = lazy(
  () => import("@/features/tema-landing-fleepix/views/LandingPage")
);
const LandingVortexEjemplo = lazy(
  () => import("@/features/tema-landing-vortex/views/VortexPage")
);
const CrearLandingVortex = lazy(
  () => import("@/features/tema-landing-vortex/CrearLandingVortexPage")
);

function NotFound() {
  return (
    <div className="pagina-publicada__estado">
      <p>No encontramos esta página.</p>
      <a href="/">Volver al inicio</a>
    </div>
  );
}

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  {
    path: "/ejemplos/invitacion",
    element: (
      <ErrorBoundary mensaje="No pudimos cargar este ejemplo.">
        <Suspense fallback={null}>
          <InvitacionEjemplo />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/ejemplos/landing-fleepix",
    element: (
      <ErrorBoundary mensaje="No pudimos cargar este ejemplo.">
        <Suspense fallback={null}>
          <LandingFleepixEjemplo />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/crear/invitacion/:token?",
    element: (
      <ErrorBoundary mensaje="No pudimos cargar el formulario.">
        <Suspense fallback={null}>
          <CrearInvitacion />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/crear/landing-fleepix/:token?",
    element: (
      <ErrorBoundary mensaje="No pudimos cargar el formulario.">
        <Suspense fallback={null}>
          <CrearLandingFleepix />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/ejemplos/landing-vortex",
    element: (
      <ErrorBoundary mensaje="No pudimos cargar este ejemplo.">
        <Suspense fallback={null}>
          <LandingVortexEjemplo />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/crear/landing-vortex/:token?",
    element: (
      <ErrorBoundary mensaje="No pudimos cargar el formulario.">
        <Suspense fallback={null}>
          <CrearLandingVortex />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  { path: "/p/:slug", element: <PaginaPublicada /> },
  { path: "*", element: <NotFound /> },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
