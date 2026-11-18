from calculator import DatosHogar, calcular_racionamiento


def test_calculo_optimo():
    datos = DatosHogar(
        sector="Escalera Raquel - Parte Alta",
        familia="Familia Pérez",
        integrantes=4,
        tanques=2,
        capacidad_tanque_litros=1000,
        potes=5,
        capacidad_pote_litros=200,
        dias_espera=10,
    )
    res = calcular_racionamiento(datos)
    assert res["total_litros"] == 3000.0
    assert res["racion_diaria_litros"] == 300.0
    assert res["racion_por_persona_litros"] == 75.0
    assert res["dias_reserva"] == 15.0
    assert res["nivel_alerta"] == "verde"


def test_calculo_precaucion():
    datos = DatosHogar(
        sector="Escalera Raquel - Parte Media",
        familia="Familia Gómez",
        integrantes=4,
        tanques=1,
        capacidad_tanque_litros=1000,
        potes=2,
        capacidad_pote_litros=200,
        dias_espera=10,
    )
    res = calcular_racionamiento(datos)
    assert res["total_litros"] == 1400.0
    assert res["racion_diaria_litros"] == 140.0
    assert res["racion_por_persona_litros"] == 35.0
    assert res["nivel_alerta"] == "amarillo"


def test_calculo_critico_rojo():
    datos = DatosHogar(
        sector="Escalera Raquel - Parte Baja",
        familia="Familia Rodríguez",
        integrantes=5,
        tanques=0,
        capacidad_tanque_litros=1000,
        potes=3,
        capacidad_pote_litros=200,
        dias_espera=15,
    )
    res = calcular_racionamiento(datos)
    assert res["total_litros"] == 600.0
    assert res["racion_diaria_litros"] == 40.0
    assert res["racion_por_persona_litros"] == 8.0
    assert res["nivel_alerta"] == "rojo"

