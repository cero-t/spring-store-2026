# Docker Stacks

This directory contains environment-specific Docker stack definitions.

## Stacks

| Directory | Stack | Purpose | Status |
|---|---|---|---|
| [`lgtm/`](./lgtm/) | - Webapp<br>- RabbitMQ<br>- Grafana LGTM | Spring services are run on the host machine, while local observability and UI are provided via Docker. | Available |
| [`grafana-cloud/`](./grafana-cloud/) | - Webapp<br>- RabbitMQ<br>- OTel Collector (Grafana Cloud) | Spring services are run on the host machine, and telemetry is forwarded by local collector to Grafana Cloud. | Draft |
| [`cloudwatch/`](./cloudwatch/) | - Webapp<br>- RabbitMQ<br>- ADOT Collector (CloudWatch) | Spring services are run on the host machine, and telemetry is forwarded by local ADOT collector to AWS CloudWatch. | Draft |

## Quick Start (lgtm)

```bash
cd docker/lgtm
docker compose up -d
```

Open:
- Webapp: http://localhost:5173
- Grafana: http://localhost:3000
- RabbitMQ Management: http://localhost:15672

## Quick Start (grafana-cloud)

```bash
cd docker/grafana-cloud
cp .env.example .env
docker compose up -d
```

Open:
- Webapp: http://localhost:5173
- RabbitMQ Management: http://localhost:15672
- OTLP Receiver: http://localhost:4318

## Quick Start (cloudwatch)

```bash
cd docker/cloudwatch
cp .env.example .env
docker compose up -d
```

Open:
- Webapp: http://localhost:5173
- RabbitMQ Management: http://localhost:15672
- OTLP Receiver: http://localhost:4318
