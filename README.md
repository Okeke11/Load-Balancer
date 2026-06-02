# 🚀 Smart Traffic Load Balancer

A lightweight, Layer 7 round-robin load balancer built with Node.js. This project demonstrates core distributed systems concepts including dynamic reverse proxying, active health checks, and graceful failover.

## ✨ Features

* **Round-Robin Routing:** Distributes incoming HTTP traffic sequentially across a cluster of backend servers to optimize resource utilization.
* **Active Health Checks:** Runs a background heartbeat interval (every 5 seconds) to ping backend nodes. 
* **Dynamic Node Management:** Automatically removes unresponsive servers from the routing pool and reinstates them when they recover, ensuring zero downtime for end users.
* **Graceful Failover:** Returns a proper `503 Service Unavailable` status if all backend nodes go offline, preventing connection hanging.

## 🛠️ Tech Stack

* **Runtime:** [Node.js](https://nodejs.org/) (v18+)
* **Proxy Engine:** [`http-proxy`](https://www.npmjs.com/package/http-proxy)
* **Mock Backends:** [Express.js](https://expressjs.com/)

## 📂 Project Structure

```text
├── lb.js             # The main Load Balancer and health-check logic
├── server.js         # Mock Express backend to simulate API servers
├── package.json      # Project metadata and dependencies
└── .gitignore        # Ignored files (node_modules, etc.)
```
## 🚀 Getting Started

### 1. Prerequisites
Ensure you have Node.js installed on your machine.

### 2. Installation
Clone the repository and install the required dependencies:

```bash
npm install
```
## 3. Running the Cluster

To see the load balancer in action, you need to start the mock backend servers and the load balancer itself in separate terminal windows.

### Start the Backend Nodes:

Open three separate terminal windows and start the mock servers on different ports:

```bash
node server.js 4001
node server.js 4002
node server.js 4003
```

### Start the Load Balancer:

Open a fourth terminal and start the proxy server:

```bash
node lb.js
```

The load balancer will start on port 9000 and immediately begin health-checking the backends.

## 🧪 Testing the Load Balancer

### Normal Operation

Send requests to the Load Balancer using curl or your browser:

```bash
curl http://localhost:9000
```

If you run this multiple times, you will see the response cycle cleanly between port 4001, 4002, and 4003.

### Simulating a Node Failure (Chaos Testing)

Stop one of your backend servers (e.g., press Ctrl+C in the port 4002 terminal).

Watch the Load Balancer terminal. Within 5 seconds, it will log:

```text
[HEALTH] ❌ http://localhost:4002 failed to respond. Marking dead.
```

Send more requests to `http://localhost:9000`. The load balancer will automatically skip port 4002 and route only to 4001 and 4003.

Restart the server on port 4002. The load balancer will detect its recovery and seamlessly add it back to the rotation.

## 🧠 Future Enhancements

- Redis Integration: Store server state and health metrics in a distributed Redis cache to support multiple load balancer instances.

- Weighted Routing: Allow certain high-capacity servers to receive a larger percentage of the traffic.

- Least Connections Algorithm: Route traffic to the server with the fewest active requests instead of strict round-robin.

Built to explore infrastructure, networking, and fault-tolerant system design.
