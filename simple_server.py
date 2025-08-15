#!/usr/bin/env python3
import http.server
import socketserver
import json
from urllib.parse import urlparse, parse_qs

class TestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        if path == '/health':
            self.send_json({
                "status": "ok",
                "message": "Test server is running",
                "port": 8000
            })
        elif path == '/test':
            self.send_json({
                "test": "success",
                "message": "Simple Python server works!",
                "path": self.path
            })
        elif path == '/':
            self.send_json({
                "service": "Lovely Shinookubo Test Server",
                "status": "running",
                "available_endpoints": ["/health", "/test", "/"]
            })
        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not found"}).encode())
    
    def send_json(self, data):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

if __name__ == "__main__":
    PORT = 8000
    Handler = TestHandler
    
    with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
        print(f"🚀 Test server started at http://localhost:{PORT}")
        print(f"📡 Endpoints:")
        print(f"   • http://localhost:{PORT}/")
        print(f"   • http://localhost:{PORT}/health")
        print(f"   • http://localhost:{PORT}/test")
        print(f"🌐 Cloud Shell Web Preview: port {PORT}")
        httpd.serve_forever()