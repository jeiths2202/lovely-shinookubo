#!/bin/bash

# Connection Test Script for Lovely Shinookubo
# Tests both local and external connectivity

echo "🔍 Lovely Shinookubo - Connection Test"
echo "====================================="

# Test local connection
echo "1. Testing local connection (localhost:7077)..."
if curl -s --max-time 5 http://localhost:7077/health > /dev/null; then
    echo "✅ Local connection: OK"
    LOCAL_RESPONSE=$(curl -s http://localhost:7077/health)
    echo "   Response: $LOCAL_RESPONSE"
else
    echo "❌ Local connection: FAILED"
    echo "   Is the proxy server running?"
    echo "   Check with: ps aux | grep 'node proxy-server.js'"
fi

echo ""

# Test external connection
echo "2. Testing external connection (34.58.110.50:7077)..."
if curl -s --max-time 10 http://34.58.110.50:7077/health > /dev/null; then
    echo "✅ External connection: OK"
    EXTERNAL_RESPONSE=$(curl -s http://34.58.110.50:7077/health)
    echo "   Response: $EXTERNAL_RESPONSE"
else
    echo "❌ External connection: FAILED"
    echo "   Possible issues:"
    echo "   - Firewall rule not configured"
    echo "   - Server not binding to 0.0.0.0"
    echo "   - Network connectivity issues"
fi

echo ""

# Check server process
echo "3. Checking server process..."
if pgrep -f "node proxy-server.js" > /dev/null; then
    PID=$(pgrep -f "node proxy-server.js")
    echo "✅ Server process running (PID: $PID)"
else
    echo "❌ Server process not found"
    echo "   Start with: ./start-server.sh"
fi

echo ""

# Check port binding
echo "4. Checking port binding..."
NETSTAT_OUTPUT=$(netstat -tlnp 2>/dev/null | grep 7077)
if [ ! -z "$NETSTAT_OUTPUT" ]; then
    echo "✅ Port 7077 is listening:"
    echo "   $NETSTAT_OUTPUT"
    
    if echo "$NETSTAT_OUTPUT" | grep -q "0.0.0.0:7077"; then
        echo "✅ Binding to all interfaces (0.0.0.0)"
    elif echo "$NETSTAT_OUTPUT" | grep -q ":::7077"; then
        echo "⚠️  Binding to IPv6 only - this may cause external access issues"
    elif echo "$NETSTAT_OUTPUT" | grep -q "127.0.0.1:7077"; then
        echo "❌ Binding to localhost only - external access will fail"
    fi
else
    echo "❌ Port 7077 not listening"
fi

echo ""

# Test API endpoints
echo "5. Testing API endpoints..."
ENDPOINTS=("/health" "/api/status" "/api/weather?lat=35.7040&lon=139.7052")

for endpoint in "${ENDPOINTS[@]}"; do
    echo -n "   Testing $endpoint... "
    if curl -s --max-time 5 "http://localhost:7077$endpoint" > /dev/null; then
        echo "✅ OK"
    else
        echo "❌ FAILED"
    fi
done

echo ""

# Check logs
echo "6. Recent server logs (last 5 lines):"
if [ -f "/data/ijswork/lovely-shinookubo-repo/proxy-server.log" ]; then
    echo "   $(tail -5 /data/ijswork/lovely-shinookubo-repo/proxy-server.log | grep -v '^$')"
else
    echo "   No log file found"
fi

echo ""
echo "======================================"
echo "🔧 Troubleshooting steps:"
echo "1. If local connection fails: ./start-server.sh"
echo "2. If external connection fails: ./setup-firewall.sh"
echo "3. Check server logs: tail -f proxy-server.log"
echo "4. Restart server: pkill -f 'node proxy-server' && ./start-server.sh"