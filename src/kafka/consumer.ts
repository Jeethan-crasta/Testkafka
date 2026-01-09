import { consumer, producer } from "./kafkaClient.js";
import { handleMessage } from "./messageHandler.js";
import { TOPICS } from "./topics.js";

export async function startKafkaConsumer() {
  await consumer.connect();
  await producer.connect();

  await consumer.subscribe({
    topics: [
      TOPICS.MAIN,
      TOPICS.RETRY_5M,
      TOPICS.RETRY_8H,
      TOPICS.RETRY_12H,
    ],
    fromBeginning: false,
  });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());

      const result = await handleMessage(topic, payload);

      // Do not commit if skipped
      if (result.status === "SKIP") {
        return;
      }

      // Commit only when terminal decision is made
      await consumer.commitOffsets([
        {
          topic,
          partition,
          offset: (Number(message.offset) + 1).toString(),
        },
      ]);
    },
  });
}
