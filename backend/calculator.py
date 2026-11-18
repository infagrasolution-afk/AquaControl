"""
Motor de cálculo de racionamiento hídrico para la comunidad Escalera Raquel.
Calcula la ración diaria disponible, los días de reserva, el nivel de alerta
y las recomendaciones de uso según los recipientes y días hasta el próximo bombeo.
"""

from dataclasses import dataclass
from typing import Dict, List


CONSUMO_ESTANDAR_PERSONA_LITROS = 50.0  # Referencia OMS para necesidades básicas diarias
MINIMO_VITAL_PERSONA_LITROS = 20.0      # Mínimo diario para consumo humano e higiene básica

SECTORES_COMUNIDAD = [
    "Escalera Raquel - Parte Alta",
    "Escalera Raquel - Parte Media",
    "Escalera Raquel - Parte Baja",
    "Escalera Raquel - Sector Principal",
]


@dataclass
class DatosHogar:
    sector: str
    familia: str
    integrantes: int
    tanques: int
    capacidad_tanque_litros: float
    potes: int
    capacidad_pote_litros: float
    dias_espera: int


def calcular_racionamiento(datos: DatosHogar) -> Dict:
    """
    Ejecuta el cálculo completo de racionamiento de agua para un hogar.
    """
    agua_tanques = datos.tanques * datos.capacidad_tanque_litros
    agua_potes = datos.potes * datos.capacidad_pote_litros
    total_litros = round(agua_tanques + agua_potes, 2)

    racion_diaria_litros = round(total_litros / datos.dias_espera, 1)
    racion_por_persona = round(racion_diaria_litros / datos.integrantes, 1)

    consumo_ideal_familia = datos.integrantes * CONSUMO_ESTANDAR_PERSONA_LITROS
    dias_reserva = round(total_litros / consumo_ideal_familia, 1) if consumo_ideal_familia > 0 else 0.0

    # Clasificación del nivel de alerta de déficit
    if total_litros <= 0 or racion_por_persona < MINIMO_VITAL_PERSONA_LITROS:
        nivel_alerta = "rojo"
        estado_alerta = "Déficit Crítico"
        mensaje_alerta = (
            "Alerta en rojo: el agua almacenada está por debajo del mínimo vital "
            f"({MINIMO_VITAL_PERSONA_LITROS:.0f} L/persona/día). Aplica racionamiento estricto."
        )
        recomendacion_titulo = "Solo Cocina e Higiene Mínima"
        distribucion = [
            {"categoria": "Cocina y Bebida", "porcentaje": 60, "litros": round(racion_diaria_litros * 0.60, 1)},
            {"categoria": "Baño e Higiene", "porcentaje": 40, "litros": round(racion_diaria_litros * 0.40, 1)},
            {"categoria": "Limpieza y Lavado", "porcentaje": 0, "litros": 0.0},
        ]
        consejos: List[str] = [
            "Prioriza agua potable exclusivamente para beber y cocinar.",
            "Reutiliza el agua del lavado de alimentos para bajar el inodoro.",
            "Suspende el lavado de ropa y limpieza de pisos hasta el próximo bombeo.",
        ]
    elif racion_por_persona < CONSUMO_ESTANDAR_PERSONA_LITROS:
        nivel_alerta = "amarillo"
        estado_alerta = "Precaución / Racionamiento"
        mensaje_alerta = (
            "Alerta moderada: alcanza para cubrir lo esencial si se administra con cuidado "
            "hasta el próximo ciclo de bombeo."
        )
        recomendacion_titulo = "Baño y Cocina (Prioridad)"
        distribucion = [
            {"categoria": "Cocina y Bebida", "porcentaje": 35, "litros": round(racion_diaria_litros * 0.35, 1)},
            {"categoria": "Baño e Higiene", "porcentaje": 45, "litros": round(racion_diaria_litros * 0.45, 1)},
            {"categoria": "Limpieza Básica", "porcentaje": 20, "litros": round(racion_diaria_litros * 0.20, 1)},
        ]
        consejos = [
            "Duchas cortas de máximo 3 minutos cerrando la llave al enjabonarse.",
            "Usa recipientes medidores en la cocina para no desperdiciar agua al fregar.",
            "Reserva el lavado de ropa pesada para el día que llegue el bombeo.",
        ]
    else:
        nivel_alerta = "verde"
        estado_alerta = "Óptimo / Seguro"
        mensaje_alerta = (
            "Reserva saludable: cuentas con suficiente agua para cubrir el consumo "
            "básico recomendado durante todo el ciclo de espera."
        )
        recomendacion_titulo = "Cocina, Baño y Limpieza"
        distribucion = [
            {"categoria": "Cocina y Bebida", "porcentaje": 25, "litros": round(racion_diaria_litros * 0.25, 1)},
            {"categoria": "Baño e Higiene", "porcentaje": 45, "litros": round(racion_diaria_litros * 0.45, 1)},
            {"categoria": "Limpieza y Lavado", "porcentaje": 30, "litros": round(racion_diaria_litros * 0.30, 1)},
        ]
        consejos = [
            "Mantén tus tanques y potes tapados para evitar evaporación y zancudos.",
            "Revisa grifos y flotantes para evitar pérdidas por goteo.",
            "Si sobra agua al final del ciclo, puedes apoyar con riego o limpieza profunda.",
        ]

    # Porcentaje visual para el medidor de reserva (0 a 100%)
    porcentaje_cobertura = min(100, round((racion_por_persona / CONSUMO_ESTANDAR_PERSONA_LITROS) * 100))

    return {
        "sector": datos.sector,
        "familia": datos.familia,
        "integrantes": datos.integrantes,
        "dias_espera": datos.dias_espera,
        "total_litros": total_litros,
        "agua_tanques_litros": round(agua_tanques, 2),
        "agua_potes_litros": round(agua_potes, 2),
        "racion_diaria_litros": racion_diaria_litros,
        "racion_por_persona_litros": racion_por_persona,
        "dias_reserva": dias_reserva,
        "nivel_alerta": nivel_alerta,
        "estado_alerta": estado_alerta,
        "mensaje_alerta": mensaje_alerta,
        "porcentaje_cobertura": porcentaje_cobertura,
        "recomendacion_titulo": recomendacion_titulo,
        "distribucion_uso": distribucion,
        "consejos": consejos,
    }

