"""
API Backend en Python (FastAPI) para la App de Racionamiento de Agua - Escalera Raquel.
"""

from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from calculator import DatosHogar, SECTORES_COMUNIDAD, calcular_racionamiento


app = FastAPI(
    title="AquaControl Escalera Raquel API",
    description="Backend en Python para el cálculo inteligente de racionamiento hídrico comunitario.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SolicitudCalculo(BaseModel):
    sector: str = Field(..., min_length=1, max_length=100, description="Sector o zona de la comunidad")
    familia: str = Field(..., min_length=1, max_length=100, description="Nombre o apellido de la familia")
    integrantes: int = Field(..., ge=1, le=30, description="Número de personas en el hogar")
    tanques: int = Field(0, ge=0, le=50, description="Cantidad de tanques")
    capacidad_tanque_litros: float = Field(1000.0, gt=0, le=50000, description="Capacidad de cada tanque en litros")
    potes: int = Field(0, ge=0, le=200, description="Cantidad de potes o pipotes")
    capacidad_pote_litros: float = Field(200.0, gt=0, le=5000, description="Capacidad de cada pote en litros")
    dias_espera: int = Field(..., ge=1, le=90, description="Días hasta el próximo ciclo de bombeo")


@app.get("/api/health")
def health_check():
    return {"status": "ok", "servicio": "AquaControl Escalera Raquel"}


@app.get("/api/sectores")
def obtener_sectores():
    return {"sectores": SECTORES_COMUNIDAD}


@app.post("/api/calcular")
def api_calcular_racionamiento(solicitud: SolicitudCalculo):
    datos = DatosHogar(
        sector=solicitud.sector.strip(),
        familia=solicitud.familia.strip(),
        integrantes=solicitud.integrantes,
        tanques=solicitud.tanques,
        capacidad_tanque_litros=solicitud.capacidad_tanque_litros,
        potes=solicitud.potes,
        capacidad_pote_litros=solicitud.capacidad_pote_litros,
        dias_espera=solicitud.dias_espera,
    )
    return calcular_racionamiento(datos)


# Servir el frontend compilado (React + Vite) si existe la carpeta dist
DIST_DIR = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if DIST_DIR.exists():
    app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        requested = DIST_DIR / full_path
        if full_path and requested.is_file():
            return FileResponse(requested)
        return FileResponse(DIST_DIR / "index.html")

