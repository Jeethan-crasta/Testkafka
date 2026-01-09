export const TOPICS = {
  MAIN: process.env.KAFKA_TOPIC_MAIN!,
  RETRY_5M: process.env.KAFKA_TOPIC_RETRY_5M!,
  RETRY_8H: process.env.KAFKA_TOPIC_RETRY_8H!,
  RETRY_12H: process.env.KAFKA_TOPIC_RETRY_12H!,
  DLQ: process.env.KAFKA_TOPIC_DLQ!,
};

export const RETRY_DELAYS_MS: Record<string, number> = {
  [TOPICS.RETRY_5M]: 5 * 60 * 1000,
  [TOPICS.RETRY_8H]: 8 * 60 * 60 * 1000,
  [TOPICS.RETRY_12H]: 12 * 60 * 60 * 1000,
};
