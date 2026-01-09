import { Kafka } from "kafkajs";
import "dotenv/config";

const brokers = process.env.KAFKA_BROKERS?.split(",");
if (!brokers) throw new Error("KAFKA_BROKERS not defined");

export const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID ?? "webhook-trigger",
  brokers,
});

export const consumer = kafka.consumer({
  groupId: process.env.KAFKA_GROUP_ID ?? "webhook-consumer-group",
});

export const producer = kafka.producer();
