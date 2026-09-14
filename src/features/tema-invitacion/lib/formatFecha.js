const MESES = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
]

// Fechas sin hora ("2026-03-16") se parsean como UTC medianoche — en Argentina
// (UTC-3) eso corre el día para atrás. Forzamos parseo en hora local.
function parseLocal(fechaISO) {
  if (!fechaISO) return null
  const d = new Date(fechaISO.includes('T') ? fechaISO : `${fechaISO}T00:00:00`)
  return isNaN(d) ? null : d
}

// Config en blanco (invitación recién creada, todavía sin fecha elegida en
// el formulario) manda fechaISO === '' acá — sin este chequeo se mostraba
// literalmente "NaN DE undefined NaN" / "NaN:NaN HS" en pantalla.
export function formatFechaTexto(fechaISO) {
  const d = parseLocal(fechaISO)
  if (!d) return '—'
  return `${d.getDate()} DE ${MESES[d.getMonth()]} ${d.getFullYear()}`
}

export function formatHoraTexto(fechaISO) {
  const d = parseLocal(fechaISO)
  if (!d) return '—:—'
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} HS`
}
