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
