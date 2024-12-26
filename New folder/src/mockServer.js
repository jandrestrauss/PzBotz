const http = require('http');

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/rcon') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log('Received RCON command:', body);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Mock response' }));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(27015, 'localhost', () => {
    console.log('Mock server running on http://localhost:27015');
});
