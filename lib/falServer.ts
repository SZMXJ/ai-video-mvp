// /lib/falServer.ts
import * as fal from "@fal-ai/client";

/**
 * Ensure FAL_KEY exists on the server.
 * With @fal-ai/client v1.x you usually don't need fal.config();
 * it reads credentials from env (FAL_KEY).
 */
export function assertFalKey() {
  if (!process.env.FAL_KEY) {
    throw new Error("Missing FAL_KEY. Please set FAL_KEY in .env.local / Vercel env.");
  }
}

export { fal };
