#!/usr/bin/env python3
"""
Cyberpunk Terminal Demo Script
This script demonstrates the capabilities of the Cyberpunk Terminal application.
"""

import requests
import json
import time
import os

# Configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

def test_backend_connection():
    """Test if the backend is running and accessible."""
    try:
        response = requests.get(f"{BACKEND_URL}/")
        if response.status_code == 200:
            print("✅ Backend is running and accessible")
            return True
        else:
            print(f"❌ Backend returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Make sure it's running on port 8000")
        return False

def test_command_execution():
    """Test basic command execution."""
    print("\n🧪 Testing command execution...")
    
    commands = [
        "pwd",
        "ls -la",
        "echo 'Hello from Cyberpunk Terminal!'",
        "date",
        "whoami"
    ]
    
    for cmd in commands:
        try:
            response = requests.post(f"{BACKEND_URL}/execute", json={"command": cmd})
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Command: {cmd}")
                print(f"   Output: {result['output'][:100]}...")
                if result['error']:
                    print(f"   Error: {result['error']}")
            else:
                print(f"❌ Command failed: {cmd} (Status: {response.status_code})")
        except Exception as e:
            print(f"❌ Error executing command '{cmd}': {e}")

def test_natural_language():
    """Test natural language command processing."""
    print("\n🤖 Testing natural language commands...")
    
    natural_commands = [
        "create a folder test_demo",
        "show files",
        "show current directory",
        "find test_demo"
    ]
    
    for cmd in natural_commands:
        try:
            response = requests.post(f"{BACKEND_URL}/execute", json={"command": cmd})
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Natural Language: {cmd}")
                print(f"   Output: {result['output'][:100]}...")
            else:
                print(f"❌ Natural language command failed: {cmd}")
        except Exception as e:
            print(f"❌ Error with natural language command '{cmd}': {e}")

def test_system_stats():
    """Test system monitoring functionality."""
    print("\n📊 Testing system monitoring...")
    
    try:
        response = requests.get(f"{BACKEND_URL}/system-stats")
        if response.status_code == 200:
            stats = response.json()
            print("✅ System stats retrieved successfully:")
            print(f"   CPU Usage: {stats['cpu_percent']:.1f}%")
            print(f"   Memory Usage: {stats['memory_percent']:.1f}%")
            print(f"   Disk Usage: {stats['disk_percent']:.1f}%")
            print(f"   Memory: {stats['memory_used'] / (1024**3):.2f} GB / {stats['memory_total'] / (1024**3):.2f} GB")
            print(f"   Disk: {stats['disk_used'] / (1024**3):.2f} GB / {stats['disk_total'] / (1024**3):.2f} GB")
        else:
            print(f"❌ Failed to get system stats (Status: {response.status_code})")
    except Exception as e:
        print(f"❌ Error getting system stats: {e}")

def test_file_operations():
    """Test file system operations."""
    print("\n📁 Testing file operations...")
    
    try:
        # Test listing files
        response = requests.get(f"{BACKEND_URL}/files/.")
        if response.status_code == 200:
            files = response.json()
            print(f"✅ File listing successful: {len(files)} items found")
            for file in files[:5]:  # Show first 5 files
                file_type = "📁" if file['is_directory'] else "📄"
                print(f"   {file_type} {file['name']}")
        else:
            print(f"❌ Failed to list files (Status: {response.status_code})")
    except Exception as e:
        print(f"❌ Error with file operations: {e}")

def cleanup_demo_files():
    """Clean up demo files created during testing."""
    print("\n🧹 Cleaning up demo files...")
    
    try:
        response = requests.post(f"{BACKEND_URL}/execute", json={"command": "rm -rf test_demo"})
        if response.status_code == 200:
            print("✅ Demo files cleaned up")
        else:
            print("⚠️  Could not clean up demo files")
    except Exception as e:
        print(f"⚠️  Error cleaning up: {e}")

def main():
    """Run the demo script."""
    print("🎮 Cyberpunk Terminal Demo")
    print("=" * 50)
    
    # Test backend connection
    if not test_backend_connection():
        print("\n❌ Backend is not running. Please start it first:")
        print("   cd backend && python main.py")
        return
    
    # Run tests
    test_command_execution()
    test_natural_language()
    test_system_stats()
    test_file_operations()
    
    # Cleanup
    cleanup_demo_files()
    
    print("\n🎉 Demo completed!")
    print(f"🌐 Open the frontend at: {FRONTEND_URL}")
    print("📚 API documentation: http://localhost:8000/docs")

if __name__ == "__main__":
    main()
