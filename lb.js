const http = require('http');
const httpProxy = require('http-proxy');

// 1. Stateful Tracking: Added the isAlive flag
let servers = [
    { target: 'http://localhost:4001', isAlive: true },
    { target: 'http://localhost:4002', isAlive: true },
    { target: 'http://localhost:4003', isAlive: true }
];

const proxy = httpProxy.createProxyServer();
let currentIndex = 0;

// 2. The Heartbeat: Active Health Checker
const checkHealth = async () => {
    for (let server of servers) {
        try {
            // We use a 2-second timeout so a hanging server doesn't freeze the checker
            const response = await fetch(server.target, { 
                signal: AbortSignal.timeout(2000) 
            });
            
            if (response.ok) {
                if (!server.isAlive) console.log(`[HEALTH] ✅ ${server.target} is back online.`);
                server.isAlive = true;
            } else {
                if (server.isAlive) console.log(`[HEALTH] ⚠️ ${server.target} returned status ${response.status}. Marking dead.`);
                server.isAlive = false;
            }
        } catch (error) {
            if (server.isAlive) console.error(`[HEALTH] ❌ ${server.target} failed to respond. Marking dead.`);
            server.isAlive = false;
        }
    }
};

// Run the health check every 5 seconds
setInterval(checkHealth, 5000);

// 3. Smart Routing Logic
const server = http.createServer((req, res) => {
    // Filter out any dead nodes before routing
    const aliveServers = servers.filter(s => s.isAlive);

    // Fail-safe if everything crashes
    if (aliveServers.length === 0) {
        res.writeHead(503);
        return res.end('503 Service Unavailable: All backend nodes are down.');
    }

    // Ensure our index doesn't go out of bounds if a server recently dropped
    currentIndex = currentIndex % aliveServers.length;
    const target = aliveServers[currentIndex].target;
    
    proxy.web(req, res, { target }, (err) => {
        console.error(`[PROXY ERROR] Failed to reach ${target}:`, err.message);
        
        // Aggressively mark dead on a hard proxy failure, don't wait for the next heartbeat
        const failedServer = servers.find(s => s.target === target);
        if (failedServer) failedServer.isAlive = false;

        res.writeHead(502);
        res.end('502 Bad Gateway');
    });

    // Move to the next healthy server for the next request
    currentIndex = (currentIndex + 1) % aliveServers.length;
});

server.listen(8000, () => {
    console.log('🚀 Smart Load Balancer running on port 8000');
    console.log('Starting background health checks...');
});