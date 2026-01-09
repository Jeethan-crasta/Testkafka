import { webhookTrigger } from "../service/webhook.js";
import { publishToRetry, publishToDLQ } from "./retryRouter.js";
import { TOPICS } from "./topics.js";

export type HandlerResult =
  | { status: "SKIP" }
  | { status: "SUCCESS" }
  | { status: "FORWARDED" };

export async function handleMessage(
  topic: string,
  payload: any
): Promise<HandlerResult> {
  // Retry delay gate (epoch-safe)
  if (payload.timestamp && Date.now() < payload.timestamp) {
    return { status: "SKIP" };
  }

  try {
    await webhookTrigger(payload);
    return { status: "SUCCESS" };
  } catch (err) {
    // Failure routing
    if (topic === TOPICS.MAIN) {
      await publishToRetry(payload, TOPICS.RETRY_5M);
    } else if (topic === TOPICS.RETRY_5M) {
      await publishToRetry(payload, TOPICS.RETRY_8H);
    } else if (topic === TOPICS.RETRY_8H) {
      await publishToRetry(payload, TOPICS.RETRY_12H);
    } else if (topic === TOPICS.RETRY_12H) {
      await publishToDLQ(payload);
    }

    return { status: "FORWARDED" };
  }
}
