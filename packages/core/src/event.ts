import { z } from "zod";
import { MessageId, Timestamp, TrackedListingId, UserId, ViewingId } from "./primitives";
import { Stage, StageChangeCause } from "./stage";

/**
 * Append-only domain events: the source for every marketing metric.
 * Stored as type + jsonb, and parsed through this union on every read.
 */
const base = { userId: UserId, trackedListingId: TrackedListingId, at: Timestamp };

export const DomainEvent = z.discriminatedUnion("type", [
  z.object({ type: z.literal("listing-tracked"), ...base }),
  z.object({ type: z.literal("stage-changed"), ...base, from: Stage, to: Stage, cause: StageChangeCause }),
  z.object({ type: z.literal("message-sent"), ...base, messageId: MessageId }),
  z.object({ type: z.literal("message-received"), ...base, messageId: MessageId }),
  z.object({ type: z.literal("viewing-proposed"), ...base, viewingId: ViewingId }),
  z.object({ type: z.literal("viewing-confirmed"), ...base, viewingId: ViewingId }),
  z.object({ type: z.literal("viewing-cancelled"), ...base, viewingId: ViewingId }),
]);
export type DomainEvent = z.infer<typeof DomainEvent>;
export type DomainEventType = DomainEvent["type"];
