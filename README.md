# Cyberpunk Terminal

A futuristic web-based Python terminal application with a cyberpunk/hacker-style UI, featuring real-time system monitoring, file exploration, and natural language command processing.

## Features

### Backend (FastAPI)
- **Secure Command Execution**: Safe subprocess execution with security restrictions
- **Natural Language Processing**: Convert natural language commands to shell commands
- **System Monitoring**: Real-time CPU, memory, and disk usage statistics
- **File System API**: Browse directories and read file contents
- **WebSocket Support**: Real-time communication with the frontend
- **Voice Commands**: Speech-to-text integration for voice commands

### Frontend (React + TypeScript)
- **Cyberpunk UI**: Glowing borders, neon colors, and smooth animations
- **Multi-tab Terminal**: Multiple terminal sessions in one interface
- **Command History**: Navigate through command history with arrow keys
- **Auto-complete**: Smart command suggestions
- **System Monitor**: Live graphs of system resources
- **File Explorer**: Visual file system navigation
- **Theme Toggle**: Switch between Cyberpunk and Minimal themes
- **Voice Input**: Record and execute voice commands
- **Drag & Drop**: File upload support

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the backend server:
```bash
python main.py
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

### Basic Commands
- `ls` - List files and directories
- `cd <directory>` - Change directory
- `pwd` - Print working directory
- `mkdir <name>` - Create directory
- `rm <file>` - Remove file
- `cat <file>` - Display file contents
- `ps` - Show running processes

### Natural Language Commands
- "create a folder test" → `mkdir test`
- "move file1.txt into test" → `mv file1.txt test/`
- "show files" → `ls -la`
- "find myfile" → `find . -name '*myfile*'`
- "open config.txt" → `cat config.txt`

### Voice Commands
1. Click the microphone button in the terminal
2. Speak your command
3. The command will be automatically transcribed and executed

### Keyboard Shortcuts
- `↑/↓` - Navigate command history
- `Enter` - Execute command
- `Ctrl+Shift+N` - New terminal tab
- `Ctrl+W` - Close current tab

## API Endpoints

### REST API
- `POST /execute` - Execute terminal commands
- `GET /system-stats` - Get system monitoring data
- `GET /files/{path}` - List files in directory
- `GET /file-content/{path}` - Get file contents
- `POST /speech-to-text` - Convert speech to text

### WebSocket
- `ws://localhost:8000/ws` - Real-time communication

## Security Features

- Command validation and sanitization
- Dangerous command blocking (rm -rf /, sudo, etc.)
- Timeout protection (30-second limit)
- Working directory restrictions

## Customization

### Themes
- **Cyberpunk**: Neon colors, glowing effects, matrix background
- **Minimal**: Clean dark theme with subtle accents

### Styling
The UI uses Tailwind CSS with custom cyberpunk color schemes. You can modify the theme in `tailwind.config.js`.

## Development

### Project Structure
```
cyberpunk-terminal/
├── backend/
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Node.js dependencies
└── README.md
```

### Adding New Features

1. **Backend**: Add new endpoints in `main.py`
2. **Frontend**: Create components in `src/components/`
3. **Types**: Define TypeScript interfaces in `src/types/`

## Deployment

### Backend Deployment
```bash
# Install production dependencies
pip install gunicorn

# Run with Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve static files
npx serve -s dist
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Screenshots

The application features:
- Futuristic cyberpunk UI with neon colors
- Real-time system monitoring graphs
- Multi-tab terminal interface
- File explorer with visual navigation
- Voice command support
- Smooth animations and transitions

## Troubleshooting

### Common Issues

1. **Backend not starting**: Check if port 8000 is available
2. **Frontend not connecting**: Ensure backend is running on port 8000
3. **Voice commands not working**: Check microphone permissions
4. **File operations failing**: Verify file permissions

### Getting Help

- Check the console for error messages
- Ensure all dependencies are installed
- Verify Python and Node.js versions
- Check firewall settings for WebSocket connections
