@echo off
title AquaControl - Escalera Raquel
echo ========================================================
echo   Iniciando AquaControl (Python FastAPI + React PWA)
echo ========================================================
echo.
echo Abre tu navegador en: http://localhost:8000
echo Presiona Ctrl+C para detener el servidor.
echo.
cd /d "%~dp0backend"
.venv\Scripts\uvicorn.exe main:app --host 0.0.0.0 --port 8000
pause

