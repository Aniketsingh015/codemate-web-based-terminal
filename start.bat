@echo off
echo 🚀 Starting Cyberpunk Terminal...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is required but not installed.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is required but not installed.
    pause
    exit /b 1
)

echo 🐍 Starting Python backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing Python dependencies...
pip install -r requirements.txt

REM Start backend server
echo 🔥 Starting FastAPI server on http://localhost:8000
start "Backend" cmd /k "python main.py"

cd ..

timeout /t 3 /nobreak >nul

echo ⚛️  Starting React frontend...
cd frontend

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📥 Installing Node.js dependencies...
    npm install
)

REM Start frontend server
echo 🎨 Starting Vite dev server on http://localhost:3000
start "Frontend" cmd /k "npm run dev"

cd ..

echo.
echo ✅ Cyberpunk Terminal is starting up!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo Press any key to exit...
pause >nul
