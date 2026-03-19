#!/usr/bin/env python3
"""
VAPT Workshop - Dynamic Lab Server
This script acts as the main HTTP server for the workshop UI.
It serves the static HTML/CSS/JS files, and provides an API
to start, stop, and stream logs from the Docker container labs.
"""

import http.server
import socketserver
import urllib.parse
import json
import subprocess
import os
import threading

PORT = 8778
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DOCKER_DIR = os.path.join(DIRECTORY, "labs", "docker")

# Ensure docker compose is used as the current command
DOCKER_CMD = ["docker", "compose"]

class WorkshopAPIHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        
        if parsed_path.path.startswith('/api/'):
            self.handle_api(parsed_path)
            return
            
        # Serve static files normally
        super().do_GET()

    def handle_api(self, parsed_path):
        query = urllib.parse.parse_qs(parsed_path.query)
        lab = query.get('lab', [''])[0]
        
        # Security check to prevent command injection
        if not lab or not lab.isalnum() and '-' not in lab:
            self.send_json_response(400, {"status": "error", "message": "Invalid lab identifier."})
            return

        service_names = [f"{lab}-app"] # Maps lab module name to docker-compose service name
        if lab == 'sqli':
            service_names = ['sqli-web', 'sqli-db']
        
        endpoint = parsed_path.path
        
        try:
            if endpoint == '/api/start':
                self.send_json_response(200, {"status": "processing", "message": f"Starting {lab}..."})
                # Fire and forget start process
                threading.Thread(target=self.run_docker_cmd, args=(["up", "-d", "--build"] + service_names,)).start()
                return
                
            elif endpoint == '/api/stop':
                self.send_json_response(200, {"status": "processing", "message": f"Stopping {lab}..."})
                threading.Thread(target=self.run_docker_cmd, args=(["stop"] + service_names,)).start()
                return
                
            elif endpoint == '/api/logs':
                # Fetch last 50 lines of logs
                result = subprocess.run(DOCKER_CMD + ["logs", "--tail", "50"] + service_names, 
                                     cwd=DOCKER_DIR, capture_output=True, text=True)
                
                log_output = result.stdout + result.stderr
                if not log_output:
                    log_output = "[System] Container is starting up or has no output yet..."
                    
                self.send_json_response(200, {"status": "success", "logs": log_output})
                return
                
            else:
                self.send_json_response(404, {"status": "error", "message": "API endpoint not found."})
                
        except Exception as e:
            self.send_json_response(500, {"status": "error", "message": str(e)})


    def run_docker_cmd(self, args):
        try:
            subprocess.run(DOCKER_CMD + list(args), cwd=DOCKER_DIR, capture_output=True, text=True)
        except Exception as e:
            print(f"Docker command failed: {e}")

    def send_json_response(self, code, data):
        self.send_response(code)
        self.send_header('Content-type', 'application/json')
        # Allow CORS for local dev
        self.send_header('Access-Control-Allow-Origin', '*') 
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

if __name__ == '__main__':
    # Ensure Docker directory exists before starting
    if not os.path.exists(DOCKER_DIR):
        print(f"ERROR: Docker directory not found at {DOCKER_DIR}")
        exit(1)
        
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("", PORT), WorkshopAPIHandler) as httpd:
        print(f"[*] Dynamic VAPT Workshop Server online!")
        print(f"[*] Serving files from: {DIRECTORY}")
        print(f"[*] Access the workshop at: http://localhost:{PORT}")
        print(f"[*] Press Ctrl+C to stop the server.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[*] Shutting down server...")
