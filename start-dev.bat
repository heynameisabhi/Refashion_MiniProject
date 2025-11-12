@echo off
echo Starting Refashion Development Environment...
echo.

echo [1/2] Starting FastAPI Backend...
start "FastAPI Backend" cmd /k "cd FastApi_For_Refashion && python -m uvicorn main:app --reload --port 8000"

timeout /t 3 /nobreak > nul

echo [2/2] Starting React Frontend...
start "React Frontend" cmd /k "cd refashion-frontend && npm run dev"

echo.
echo ========================================
echo Development servers are starting!
echo ========================================
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo ========================================
