const MESES = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
]

// Fechas sin hora ("2026-03-16") se parsean como UTC medianoche — en Argentina
// (UTC-3) eso corre el día para atrás. Forzamos parseo en hora local.
function parseLocal(fechaISO) {
  return new Date(fechaISO.includes('T') ? fechaISO : `${fechaISO}T00:00:00`)
}

export function formatFechaTexto(fechaISO) {
  const d = parseLocal(fechaISO)
  return `${d.getDate()} DE ${MESES[d.getMonth()]} ${d.getFullYear()}`
}

export function formatHoraTexto(fechaISO) {
  const d = parseLocal(fechaISO)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} HS`
}
