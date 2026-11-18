/**
 * Respaldo local (Offline-First) con la misma lógica matemática del backend en Python.
 * Permite que la PWA siga funcionando en el teléfono incluso sin conexión al servidor.
 */

export const CONSUMO_ESTANDAR_PERSONA_LITROS = 50.0
export const MINIMO_VITAL_PERSONA_LITROS = 20.0

export const SECTORES_DEFAULT = [
  'Escalera Raquel - Parte Alta',
  'Escalera Raquel - Parte Media',
  'Escalera Raquel - Parte Baja',
  'Escalera Raquel - Sector Principal',
]

export function calcularRacionamientoLocal(datos) {
  const integrantes = Math.max(1, Number(datos.integrantes) || 1)
  const tanques = Math.max(0, Number(datos.tanques) || 0)
  const capacidadTanque = Math.max(1, Number(datos.capacidad_tanque_litros) || 1000)
  const potes = Math.max(0, Number(datos.potes) || 0)
  const capacidadPote = Math.max(1, Number(datos.capacidad_pote_litros) || 200)
  const diasEspera = Math.max(1, Number(datos.dias_espera) || 1)

  const aguaTanques = tanques * capacidadTanque
  const aguaPotes = potes * capacidadPote
  const totalLitros = Number((aguaTanques + aguaPotes).toFixed(2))

  const racionDiaria = Number((totalLitros / diasEspera).toFixed(1))
  const racionPorPersona = Number((racionDiaria / integrantes).toFixed(1))

  const consumoIdealFamilia = integrantes * CONSUMO_ESTANDAR_PERSONA_LITROS
  const diasReserva = consumoIdealFamilia > 0 ? Number((totalLitros / consumoIdealFamilia).toFixed(1)) : 0

  let nivelAlerta = 'verde'
  let estadoAlerta = 'Óptimo / Seguro'
  let mensajeAlerta =
    'Reserva saludable: cuentas con suficiente agua para cubrir el consumo básico recomendado durante todo el ciclo de espera.'
  let recomendacionTitulo = 'Cocina, Baño y Limpieza'
  let distribucion = [
    { categoria: 'Cocina y Bebida', porcentaje: 25, litros: Number((racionDiaria * 0.25).toFixed(1)) },
    { categoria: 'Baño e Higiene', porcentaje: 45, litros: Number((racionDiaria * 0.45).toFixed(1)) },
    { categoria: 'Limpieza y Lavado', porcentaje: 30, litros: Number((racionDiaria * 0.30).toFixed(1)) },
  ]
  let consejos = [
    'Mantén tus tanques y potes tapados para evitar evaporación y zancudos.',
    'Revisa grifos y flotantes para evitar pérdidas por goteo.',
    'Si sobra agua al final del ciclo, puedes apoyar con riego o limpieza profunda.',
  ]

  if (totalLitros <= 0 || racionPorPersona < MINIMO_VITAL_PERSONA_LITROS) {
    nivelAlerta = 'rojo'
    estadoAlerta = 'Déficit Crítico'
    mensajeAlerta = `Alerta en rojo: el agua almacenada está por debajo del mínimo vital (${MINIMO_VITAL_PERSONA_LITROS} L/persona/día). Aplica racionamiento estricto.`
    recomendacionTitulo = 'Solo Cocina e Higiene Mínima'
    distribucion = [
      { categoria: 'Cocina y Bebida', porcentaje: 60, litros: Number((racionDiaria * 0.6).toFixed(1)) },
      { categoria: 'Baño e Higiene', porcentaje: 40, litros: Number((racionDiaria * 0.4).toFixed(1)) },
      { categoria: 'Limpieza y Lavado', porcentaje: 0, litros: 0 },
    ]
    consejos = [
      'Prioriza agua potable exclusivamente para beber y cocinar.',
      'Reutiliza el agua del lavado de alimentos para bajar el inodoro.',
      'Suspende el lavado de ropa y limpieza de pisos hasta el próximo bombeo.',
    ]
  } else if (racionPorPersona < CONSUMO_ESTANDAR_PERSONA_LITROS) {
    nivelAlerta = 'amarillo'
    estadoAlerta = 'Precaución / Racionamiento'
    mensajeAlerta =
      'Alerta moderada: alcanza para cubrir lo esencial si se administra con cuidado hasta el próximo ciclo de bombeo.'
    recomendacionTitulo = 'Baño y Cocina (Prioridad)'
    distribucion = [
      { categoria: 'Cocina y Bebida', porcentaje: 35, litros: Number((racionDiaria * 0.35).toFixed(1)) },
      { categoria: 'Baño e Higiene', porcentaje: 45, litros: Number((racionDiaria * 0.45).toFixed(1)) },
      { categoria: 'Limpieza Básica', porcentaje: 20, litros: Number((racionDiaria * 0.2).toFixed(1)) },
    ]
    consejos = [
      'Duchas cortas de máximo 3 minutos cerrando la llave al enjabonarse.',
      'Usa recipientes medidores en la cocina para no desperdiciar agua al fregar.',
      'Reserva el lavado de ropa pesada para el día que llegue el bombeo.',
    ]
  }

  const porcentajeCobertura = Math.min(
    100,
    Math.round((racionPorPersona / CONSUMO_ESTANDAR_PERSONA_LITROS) * 100)
  )

  return {
    sector: datos.sector,
    familia: datos.familia,
    integrantes,
    dias_espera: diasEspera,
    total_litros: totalLitros,
    agua_tanques_litros: Number(aguaTanques.toFixed(2)),
    agua_potes_litros: Number(aguaPotes.toFixed(2)),
    racion_diaria_litros: racionDiaria,
    racion_por_persona_litros: racionPorPersona,
    dias_reserva: diasReserva,
    nivel_alerta: nivelAlerta,
    estado_alerta: estadoAlerta,
    mensaje_alerta: mensajeAlerta,
    porcentaje_cobertura: porcentajeCobertura,
    recomendacion_titulo: recomendacionTitulo,
    distribucion_uso: distribucion,
    consejos,
  }
}

