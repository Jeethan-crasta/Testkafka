#!/usr/bin/env bash
set -e

echo "Creating Kafka topics..."

docker compose exec kafka kafka-topics \
  --create \
  --if-not-exists \
  --topic webhook-trigger \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1

docker compose exec kafka kafka-topics \
  --create \
  --if-not-exists \
  --topic webhook-trigger-retry-5m \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1

docker compose exec kafka kafka-topics \
  --create \
  --if-not-exists \
  --topic webhook-trigger-retry-8h \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1

docker compose exec kafka kafka-topics \
  --create \
  --if-not-exists \
  --topic webhook-trigger-retry-12h \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1

docker compose exec kafka kafka-topics \
  --create \
  --if-not-exists \
  --topic webhook-trigger-dlq \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1

echo "Verifying topics..."
docker compose exec kafka kafka-topics \
  --list \
  --bootstrap-server localhost:9092

echo "Done."
