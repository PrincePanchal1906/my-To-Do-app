@echo off
echo Starting Full Stack To-Do Application...

echo Starting Backend API Server...
start cmd /k "cd backend && npm start"

echo Starting Frontend React App...
start cmd /k "cd frontend && npm run dev"

echo Done! Let the servers spin up for a few seconds.
