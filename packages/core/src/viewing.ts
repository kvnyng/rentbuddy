import { z } from "zod";
import { MessageId, TimeSlot, Timestamp, ViewingId } from "./primitives";

export const ViewingSource = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("proposed-in-email"), messageId: MessageId }),
  z.object({ kind: z.literal("entered-by-user") }),
]);
export type ViewingSource = z.infer<typeof ViewingSource>;

export const CANCEL_REASONS = ["another-time-confirmed", "cancelled-by-user", "cancelled-by-agent"] as const;
export const CancelReason = z.enum(CANCEL_REASONS);
export type CancelReason = z.infer<typeof CancelReason>;

const base = { id: ViewingId, slot: TimeSlot, source: ViewingSource };

/** Each status carries exactly the data that status has. */
export const Viewing = z.discriminatedUnion("status", [
  z.object({ status: z.literal("proposed"), ...base }),
  z.object({ status: z.literal("confirmed"), ...base, confirmedAt: Timestamp }),
  z.object({ status: z.literal("cancelled"), ...base, reason: CancelReason }),
]);
export type Viewing = z.infer<typeof Viewing>;
export type ViewingStatus = Viewing["status"];
