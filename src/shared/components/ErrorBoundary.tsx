import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode; mensaje?: string }
type State = { error: boolean }

/**
 * Atrapa fallas al cargar un chunk lazy (deploy nuevo con un archivo que ya
 * no existe en el server, corte de red, etc.) — sin esto, un lazy() que
 * falla deja la pantalla en blanco para siempre, sin aviso ni recuperación.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: false }

  static getDerivedStateFromError() {
    return { error: true }
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '40vh',
            gap: '14px',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <p>{this.props.mensaje ?? 'Algo no cargó bien.'}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              border: '1px solid currentColor',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            Recargar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
