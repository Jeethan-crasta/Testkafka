//docker commands to crete topics 


//Main topic

docker compose exec kafka kafka-topics \
  --create \
  --topic webhook-trigger \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1


//Retry after 5 minutes

docker compose exec kafka kafka-topics \
  --create \
  --topic webhook-trigger-retry-5m \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1


//Retry after 8 hours

docker compose exec kafka kafka-topics \
  --create \
  --topic webhook-trigger-retry-8h \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1


//Retry after 12 hours

docker compose exec kafka kafka-topics \
  --create \
  --topic webhook-trigger-retry-12h \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1


//Dead Letter Queue (DLQ)

docker compose exec kafka kafka-topics \
  --create \
  --topic webhook-trigger-dlq \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1


//Verify all topics exist

docker compose exec kafka kafka-topics \
  --list \
  --bootstrap-server localhost:9092
