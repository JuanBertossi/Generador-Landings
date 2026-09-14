import {
  Activity,
  Zap,
  TrendingUp,
  Users,
  Search,
  Code,
  Rocket,
  ShieldCheck,
  Sparkles,
  BarChart3,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react'

export const ICONOS: Record<string, LucideIcon> = {
  actividad: Activity,
  rayo: Zap,
  crecimiento: TrendingUp,
  equipo: Users,
  buscar: Search,
  codigo: Code,
  cohete: Rocket,
  seguridad: ShieldCheck,
  destacado: Sparkles,
  reportes: BarChart3,
  mensajes: MessageCircle,
}

export function getIcono(key: string): LucideIcon {
  return ICONOS[key] ?? Sparkles
}
