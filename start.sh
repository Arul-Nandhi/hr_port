#!/bin/bash

echo "Starting HR Management Portal..."
echo ""

echo "[1/2] Starting Django Backend..."
cd backend
source venv/bin/activate
python manage.py runserver &
BACKEND_PID=$!

sleep 2

echo "[2/2] Starting React Frontend..."
cd ..
npm start &
FRONTEND_PID=$!

echo ""
echo "Both services are starting..."
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000/api/"
echo "Django Admin: http://localhost:8000/admin/"
echo ""
echo "Login with: admin / admin123"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

# Clean up on exit
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
