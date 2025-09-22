#!/bin/bash

# Cyberpunk Terminal Startup Script

echo "🚀 Starting Cyberpunk Terminal..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

# Function to start backend
start_backend() {
    echo "�� Starting Python backend..."
    cd backend
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        echo "📦 Creating virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install dependencies
    echo "📥 Installing Python dependencies..."
    pip install -r requirements.txt
    
    # Start backend server
    echo "🔥 Starting FastAPI server on http://localhost:8000"
    python main.py &
    BACKEND_PID=$!
    
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "⚛️  Starting React frontend..."
    cd frontend
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "📥 Installing Node.js dependencies..."
        npm install
    fi
    
    # Start frontend server
    echo "🎨 Starting Vite dev server on http://localhost:3000"
    npm run dev &
    FRONTEND_PID=$!
    
    cd ..
}

# Start both services
start_backend
sleep 3
start_frontend

echo ""
echo "✅ Cyberpunk Terminal is starting up!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "�� API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap 'echo ""; echo "🛑 Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT
wait
