# Deployment Guide

## Prerequisites

### System Requirements
- **OS**: Windows Server 2019/2022 or Ubuntu 20.04 LTS
- **RAM**: 4GB minimum
- **CPU**: 2 cores minimum
- **Disk**: 20GB free space

### Software
- **Node.js**: v14.x or later
- **PostgreSQL**: v12.x or later
- **Redis**: v6.x or later
- **NGINX**: v1.18.x or later

## Installation

### Clone Repository
```bash
git clone https://github.com/your-repo/PZBotV.git
cd PZBotV
```

### Install Dependencies
```bash
npm install
```

### Configure Environment
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=pzbotv

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Payment Provider Configuration
PAYSTACK_SECRET_KEY=sk_live_xxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
PAYGATE_ID=xxxxx
PAYGATE_SECRET=xxxxx

# Discord Configuration
DISCORD_TOKEN=your_discord_token
```

### Run Migrations
```bash
npm run migrate
```

### Start Application
```bash
npm start
```

## Deployment

### Docker
```dockerfile
# Dockerfile
FROM node:14

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

CMD ["npm", "start"]
```

### Kubernetes
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pzbotv
spec:
  replicas: 3
  selector:
    matchLabels:
      app: pzbotv
  template:
    metadata:
      labels:
        app: pzbotv
    spec:
      containers:
      - name: pzbotv
        image: your-docker-repo/pzbotv:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: pzbotv-config
```

### NGINX Configuration
```nginx
# nginx.conf
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Monitoring

### Prometheus
```yaml
# prometheus.yaml
scrape_configs:
  - job_name: 'pzbotv'
    static_configs:
      - targets: ['localhost:3000']
```

### Grafana
1. Import Prometheus data source.
2. Create dashboards for performance metrics.
