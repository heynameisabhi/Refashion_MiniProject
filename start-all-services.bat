@echo off
echo Starting ReFashion Development Environment...
echo.

echo [1/3] Starting FastAPI Backend (AI Detection)...
start "FastAPI Backend" cmd /k "cd FastApi_For_Refashion && python -m uvicorn main:app --reload --port 8000"

timeout /t 3 /nobreak > nul

echo [2/3] Starting Spring Boot Backend (Data Management)...
start "Spring Boot Backend" cmd /k "cd Refashion_backend\StartUP_Pitch\SpringBoot_GrowLoop\growloop-backend && mvnw.cmd spring-boot:run"

timeout /t 5 /nobreak > nul

echo [3/3] Starting React Frontend...
start "React Frontend" cmd /k "cd refashion-frontend && npm run dev"

echo.
echo ========================================
echo All services are starting!
echo ========================================
echo FastAPI (AI):     http://localhost:8000
echo Spring Boot:      http://localhost:8080
echo Frontend:         http://localhost:5173
echo API Docs (Fast):  http://localhost:8000/docs
echo ========================================
echo.
echo Note: Make sure MySQL is running and 'refashiondb' database exists
echo ========================================