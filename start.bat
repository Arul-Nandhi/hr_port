@echo off
echo Starting HR Management Portal...
echo.

echo [1/2] Starting Django Backend...
start cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver"

timeout /t 2

echo [2/2] Starting React Frontend...
cd .
start cmd /k "npm start"

echo.
echo Both services are starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000/api/
echo Django Admin: http://localhost:8000/admin/
echo.
echo Login with: admin / admin123
