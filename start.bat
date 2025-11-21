@echo off
echo ====================================
echo GALAND Plomberie - Demarrage
echo ====================================
echo.

echo Demarrage du serveur backend...
start "Backend API" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Demarrage du frontend...
start "Frontend React" cmd /k "cd frontend && npm run dev"

echo.
echo ====================================
echo Les serveurs ont ete demarres !
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ====================================
