from flask import Flask, jsonify
import requests

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        "message": "Lovely Shinookubo Test Server",
        "status": "running",
        "port": 8000
    })

@app.route('/health')
def health():
    return jsonify({
        "status": "ok",
        "service": "lovely-shinookubo"
    })

@app.route('/test')
def test():
    return jsonify({
        "test": "success",
        "message": "Flask server is working!"
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)