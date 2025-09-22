import os
import subprocess
import psutil
import re
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# -------------------------------
# Natural Language Command Processor
# -------------------------------
class NaturalLanguageProcessor:
    def __init__(self):
        self.command_patterns = {
            r"create.*folder.*(\w+)": lambda m: f"mkdir {m.group(1)}",
            r"create.*directory.*(\w+)": lambda m: f"mkdir {m.group(1)}",
            r"make.*folder.*(\w+)": lambda m: f"mkdir {m.group(1)}",
            r"move.*(\w+\.\w+).*into.*(\w+)": lambda m: f"mv {m.group(1)} {m.group(2)}/",
            r"copy.*(\w+\.\w+).*to.*(\w+)": lambda m: f"cp {m.group(1)} {m.group(2)}/",
            r"delete.*(\w+\.\w+)": lambda m: f"rm {m.group(1)}",
            r"remove.*(\w+\.\w+)": lambda m: f"rm {m.group(1)}",
            r"show.*files": lambda m: "ls -la",
            r"list.*files": lambda m: "ls -la",
            r"show.*current.*directory": lambda m: "pwd",
            r"go.*to.*(\w+)": lambda m: f"cd {m.group(1)}",
            r"change.*to.*(\w+)": lambda m: f"cd {m.group(1)}",
            r"open.*(\w+\.\w+)": lambda m: f"cat {m.group(1)}",
            r"read.*(\w+\.\w+)": lambda m: f"cat {m.group(1)}",
            r"find.*(\w+)": lambda m: f"find . -name '*{m.group(1)}*'",
            r"search.*for.*(\w+)": lambda m: f"find . -name '*{m.group(1)}*'",
        }

    def process_command(self, command: str) -> str:
        command_lower = command.lower()
        for pattern, replacement_func in self.command_patterns.items():
            match = re.search(pattern, command_lower)
            if match:
                return replacement_func(match)
        return command

nlp = NaturalLanguageProcessor()

# -------------------------------
# Safe command execution
# -------------------------------
def execute_command(command: str, working_directory: str = None):
    if not working_directory:
        working_directory = os.getcwd()

    processed_command = nlp.process_command(command)

    # Handle cd separately
    if processed_command.startswith("cd"):
        parts = processed_command.split(maxsplit=1)
        target_dir = parts[1] if len(parts) > 1 else os.path.expanduser("~")

        new_path = os.path.abspath(os.path.join(working_directory, target_dir))
        if os.path.isdir(new_path):
            return {
                "output": f"Changed directory to: {new_path}",
                "error": "",
                "exit_code": 0,
                "working_directory": new_path
            }
        else:
            return {
                "output": "",
                "error": f"No such directory: {target_dir}",
                "exit_code": 1,
                "working_directory": working_directory
            }

    # Block dangerous commands
    dangerous_commands = ['rm -rf /', 'sudo', 'su', 'passwd', 'chmod 777', 'dd if=']
    if any(dangerous in processed_command for dangerous in dangerous_commands):
        return {
            "output": "",
            "error": "Command blocked for security reasons",
            "exit_code": 1,
            "working_directory": working_directory
        }

    try:
        result = subprocess.run(
            processed_command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=30,
            cwd=working_directory
        )
        return {
            "output": result.stdout,
            "error": result.stderr,
            "exit_code": result.returncode,
            "working_directory": working_directory
        }
    except subprocess.TimeoutExpired:
        return {
            "output": "",
            "error": "Command timed out after 30 seconds",
            "exit_code": 124,
            "working_directory": working_directory
        }
    except Exception as e:
        return {
            "output": "",
            "error": f"Error executing command: {str(e)}",
            "exit_code": 1,
            "working_directory": working_directory
        }

# -------------------------------
# API Endpoints
# -------------------------------
@app.route("/")
def root():
    return {"message": "CodeMate Terminal API is running!"}

@app.route("/execute", methods=["POST"])
def execute_command_endpoint():
    data = request.get_json(force=True)
    command = data.get("command", "")
    working_directory = data.get("working_directory")
    result = execute_command(command, working_directory)
    return jsonify(result)

@app.route("/api/system-stats")
def get_system_stats():
    try:
        cpu_percent = psutil.cpu_percent(interval=0.5)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')

        return jsonify({
            "cpu_percent": cpu_percent,
            "memory_percent": memory.percent,
            "memory_used": memory.used,
            "memory_total": memory.total,
            "disk_percent": disk.percent,
            "disk_used": disk.used,
            "disk_total": disk.total,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": f"Error getting system stats: {str(e)}"}), 500

@app.route("/api/files", defaults={"path": "."}, strict_slashes=False)
@app.route("/api/files/<path:path>", strict_slashes=False)
def list_files(path):
    try:
        if not os.path.exists(path) or not os.path.isdir(path):
            return jsonify([])

        files = []
        for item in os.listdir(path):
            item_path = os.path.join(path, item)
            try:
                stat = os.stat(item_path)
                files.append({
                    "name": item,
                    "path": item_path,
                    "is_directory": os.path.isdir(item_path),
                    "size": stat.st_size,
                    "modified": datetime.fromtimestamp(stat.st_mtime).isoformat()
                })
            except OSError:
                continue

        return jsonify(sorted(files, key=lambda x: (not x['is_directory'], x['name'].lower())))
    except Exception:
        return jsonify([])

@app.route("/api/welcome")
def welcome_message():
    return jsonify({
        "message": "Welcome to CodeMate.Server 🚀",
        "timestamp": datetime.now().isoformat()
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True, use_reloader=False)