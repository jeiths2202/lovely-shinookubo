#!/bin/bash

# Lovely Shinookubo - Server Start Script
# Port: 7077

echo "🏮 Lovely Shinookubo - 스마트 가이드 서버 시작"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js가 설치되어 있지 않습니다."
    echo "   Node.js를 설치한 후 다시 실행해주세요."
    echo "   https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 버전: $(node --version)"

# Check if port 7077 is available
if lsof -Pi :7077 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  포트 7077이 이미 사용 중입니다."
    echo "   다른 프로세스를 종료하거나 다른 포트를 사용하세요."
    read -p "강제로 종료하고 다시 시작하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 포트 7077 프로세스 종료 중..."
        kill -9 $(lsof -ti:7077) 2>/dev/null || true
        sleep 2
    else
        exit 1
    fi
fi

# Start proxy server
echo "🚀 프록시 서버 시작 중... (포트 7077)"
echo "   Ctrl+C로 서버를 종료할 수 있습니다."
echo ""
echo "📡 API 엔드포인트:"
echo "   • http://localhost:7077/health"
echo "   • http://localhost:7077/api/status"
echo "   • http://localhost:7077/api/places/*"
echo "   • http://localhost:7077/api/weather"
echo "   • http://localhost:7077/api/twitter"
echo ""
echo "🌐 웹 애플리케이션:"
echo "   별도 터미널에서 다음 명령어를 실행하세요:"
echo "   python3 -m http.server 8000"
echo "   http://localhost:8000/index-final.html"
echo ""
echo "=============================================="

# Start the proxy server
node proxy-server.js