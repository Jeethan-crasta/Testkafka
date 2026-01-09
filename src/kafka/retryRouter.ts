import { producer } from "./kafkaClient.js";
import { TOPICS, RETRY_DELAYS_MS } from "./topics.js";

type Payload = {
  timestamp?: number;
  attempts?: number;
  [key: string]: any;
};

export async function publishToRetry(
  payload: Payload,
  retryTopic: string
) {
  const delay = RETRY_DELAYS_MS[retryTopic];

  const enrichedPayload: Payload = {
    ...payload,
    attempts: (payload.attempts ?? 0) + 1,
    timestamp: Date.now() + delay,
  };

  await producer.send({
    topic: retryTopic,
    messages: [{ value: JSON.stringify(enrichedPayload) }],
  });
}

export async function publishToDLQ(payload: Payload) {
  const { timestamp, ...cleanPayload } = payload;

  await producer.send({
    topic: TOPICS.DLQ,
    messages: [{ value: JSON.stringify(cleanPayload) }],
  });
}
