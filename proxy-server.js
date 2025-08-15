// Proxy Server for API CORS handling
// Run with: node proxy-server.js

const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 7077;

// API configurations
const API_CONFIGS = {
    googlePlaces: {
        apiKey: 'AIzaSyB1ks3Sss829bj6l9b36LajXtm_umL-UPM',
        baseUrl: 'https://maps.googleapis.com/maps/api/place'
    },
    twitter: {
        bearerToken: 'AAAAAAAAAAAAAAAAAAAAAFFW3gEAAAAAwLO5ZkJXKUyzU9CUgMgvu6dU%2FMU%3DTwlTf0ekq4pIgpX2aAktP5Bcdo1FMtC6FXa9BO98yegEZcKRBP',
        baseUrl: 'https://api.twitter.com/2'
    },
    openWeather: {
        apiKey: 'f3ecd01ec2651182b68e69aae2072748',
        baseUrl: 'https://api.openweathermap.org/data/2.5'
    }
};

const server = http.createServer(async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);
    
    try {
        // Google Places API proxy
        if (pathname.startsWith('/api/places')) {
            const endpoint = pathname.replace('/api/places', '');
            await proxyGooglePlaces(endpoint, query, res);
        }
        // Weather API proxy
        else if (pathname.startsWith('/api/weather')) {
            await proxyWeather(query, res);
        }
        // Twitter API proxy
        else if (pathname.startsWith('/api/twitter')) {
            await proxyTwitter(query, res);
        }
        // Health check
        else if (pathname === '/health') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                status: 'ok', 
                port: PORT,
                timestamp: new Date().toISOString() 
            }));
        }
        // API status
        else if (pathname === '/api/status') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                googlePlaces: !!API_CONFIGS.googlePlaces.apiKey,
                twitter: !!API_CONFIGS.twitter.bearerToken,
                weather: !!API_CONFIGS.openWeather.apiKey,
                port: PORT
            }));
        }
        // Serve static files
        else {
            serveStaticFile(pathname, res);
        }
    } catch (error) {
        console.error('Server error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    }
});

async function proxyGooglePlaces(endpoint, query, res) {
    const apiUrl = `${API_CONFIGS.googlePlaces.baseUrl}${endpoint}?` +
        `${new URLSearchParams(query).toString()}&` +
        `key=${API_CONFIGS.googlePlaces.apiKey}`;
    
    console.log('Proxying to Google Places:', apiUrl);
    
    https.get(apiUrl, (apiRes) => {
        let data = '';
        
        apiRes.on('data', (chunk) => {
            data += chunk;
        });
        
        apiRes.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }).on('error', (error) => {
        console.error('Google Places API error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    });
}

async function proxyWeather(query, res) {
    const { lat = '35.7040', lon = '139.7052' } = query;
    
    const apiUrl = `${API_CONFIGS.openWeather.baseUrl}/weather?` +
        `lat=${lat}&lon=${lon}&` +
        `appid=${API_CONFIGS.openWeather.apiKey}&` +
        `units=metric&lang=ko`;
    
    console.log('Proxying to OpenWeather:', apiUrl);
    
    https.get(apiUrl, (apiRes) => {
        let data = '';
        
        apiRes.on('data', (chunk) => {
            data += chunk;
        });
        
        apiRes.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }).on('error', (error) => {
        console.error('Weather API error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    });
}

async function proxyTwitter(query, res) {
    const searchQuery = query.q || '신오쿠보';
    const maxResults = query.max_results || '10';
    
    const apiUrl = `${API_CONFIGS.twitter.baseUrl}/tweets/search/recent?` +
        `query=${encodeURIComponent(searchQuery)}&` +
        `max_results=${maxResults}&` +
        `tweet.fields=created_at,public_metrics`;
    
    console.log('Proxying to Twitter:', apiUrl);
    
    const options = {
        headers: {
            'Authorization': `Bearer ${API_CONFIGS.twitter.bearerToken}`
        }
    };
    
    https.get(apiUrl, options, (apiRes) => {
        let data = '';
        
        apiRes.on('data', (chunk) => {
            data += chunk;
        });
        
        apiRes.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }).on('error', (error) => {
        console.error('Twitter API error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    });
}

server.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════════╗
║   Lovely Shinookubo Proxy Server Started  ║
╠════════════════════════════════════════════╣
║   Port: ${PORT}                              ║
║   Host: 0.0.0.0 (All interfaces)          ║
║   Local: http://localhost:${PORT}           ║
║   External: http://34.58.110.50:${PORT}    ║
╠════════════════════════════════════════════╣
║   Endpoints:                               ║
║   • /api/places/* - Google Places API     ║
║   • /api/weather  - OpenWeather API       ║
║   • /api/twitter  - Twitter API           ║
║   • /api/status   - API Status            ║
║   • /health       - Health Check          ║
╚════════════════════════════════════════════╝
    `);
});

// Serve static files
function serveStaticFile(pathname, res) {
    // Default to index-final.html for root
    if (pathname === '/') {
        pathname = '/index-final.html';
    }
    
    const filePath = path.join(__dirname, pathname);
    
    // Security check - prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Forbidden' }));
        return;
    }
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'File not found' }));
            return;
        }
        
        // Set content type based on file extension
        const ext = path.extname(filePath).toLowerCase();
        const contentTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml'
        };
        
        const contentType = contentTypes[ext] || 'text/plain';
        
        res.writeHead(200, { 
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*'
        });
        res.end(data);
    });
}

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});

process.on('SIGINT', () => {
    console.log('\nSIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});