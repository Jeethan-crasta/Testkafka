import "dotenv/config";
import { startKafkaConsumer } from "./kafka/consumer.js";
import { initCouchDB } from "./service/couchdb.js";

async function bootstrap() {
  console.log("Starting webhook service...");

  // Initialize CouchDB first
  initCouchDB();

  // Start Kafka consumer (new layered logic)
  await startKafkaConsumer();
}

bootstrap().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
