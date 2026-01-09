import { Kafka } from "kafkajs";
import "dotenv/config";

const kafka = new Kafka({
  clientId: "webhook-test-producer",
  brokers: [process.env.KAFKA_BROKERS!],
});

const producer = kafka.producer();

async function produce() {
  await producer.connect();

  const bodyPayload = {
    webhookTriggerId: "wt-123",
    trigger: "TRIP_STATUS_CHANGE",
    attemptIndex: 0,
    client: {
      clientId: "client-001",
      config: {
        disableWebhookRetriesForStatusCodes: [400, 401, 403],
      },
      data: {
        notifications: "enabled",
      },
    },
    payload: {
      tripId: "trip-001",
      fleetId: "fleet-001",
      driverId: "driver-001",
      uploadRequestId: "upload-123",
      eventIndex: 1,
      eventType: "TRIP_COMPLETED",
      status: "COMPLETED",
      otherDetails: {
        distanceKm: 12.5,
      },
    },
    meta: {
      origin: "test-producer",
      timestamp: new Date().toISOString(),
    },
  };

  const message = {
    Records: [
      {
        messageId: "msg-001",
        receiptHandle: "handle-001",
        body: JSON.stringify(bodyPayload), // 👈 IMPORTANT
        attributes: {
          ApproximateReceiveCount: "1",
          SentTimestamp: Date.now().toString(),
          ApproximateFirstReceiveTimestamp: Date.now().toString(),
        },
        messageAttributes: {
          someAttribute: {
            stringValue: "example",
            dataType: "String",
          },
        },
        md5OfBody: "",
        eventSource: "aws:sqs",
        eventSourceARN: "arn:aws:sqs:region:account:queue",
        awsRegion: "ap-south-1",
      },
    ],
  };

  await producer.send({
    topic: process.env.KAFKA_TOPIC_MAIN!,
    messages: [
      {
        key: "webhook-test",
        value: JSON.stringify(message),
      },
    ],
  });

  console.log("✅ Test message produced to webhook-trigger");

  await producer.disconnect();
}

produce().catch((err) => {
  console.error("❌ Failed to produce message", err);
  process.exit(1);
});
