import {
  LayoutDashboard,
  PiggyBank,
  FileText,
  ShieldCheck,
  Route,
  Wallet,
  BellRing,
  Fuel,
  TrendingUp,
  Users,
  Zap,
  Star,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react'

export const ICONOS: Record<string, LucideIcon> = {
  panel: LayoutDashboard,
  ahorro: PiggyBank,
  documentos: FileText,
  seguridad: ShieldCheck,
  ruta: Route,
  finanzas: Wallet,
  alertas: BellRing,
  combustible: Fuel,
  crecimiento: TrendingUp,
  equipo: Users,
  velocidad: Zap,
  destacado: Star,
  integracion: RefreshCw,
}

export type IconoKey = keyof typeof ICONOS

export function getIcono(key: string): LucideIcon {
  return ICONOS[key] ?? Star
}
