import { z } from "zod";
import { Confidence, ThreadId, TrackedListingId } from "./primitives";
import { ListingSource } from "./listing";

/** How an inbound email was matched to a listing. Order mirrors the matching pipeline. */
export const MatchMethod = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("reply-headers") }),
  z.object({ kind: z.literal("source-notification"), source: ListingSource }),
  z.object({ kind: z.literal("known-agent") }),
  z.object({ kind: z.literal("llm"), confidence: Confidence }),
]);
export type MatchMethod = z.infer<typeof MatchMethod>;

export const MatchSuggestion = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("none") }),
  z.object({ kind: z.literal("suggested"), trackedListingId: TrackedListingId, confidence: Confidence }),
]);
export type MatchSuggestion = z.infer<typeof MatchSuggestion>;

export const FAILED_STEPS = ["parse-payload", "resolve-inbox", "match", "store"] as const;

export const InboundEmailState = z.discriminatedUnion("status", [
  z.object({ status: z.literal("received") }),
  z.object({ status: z.literal("matched"), threadId: ThreadId, method: MatchMethod }),
  z.object({ status: z.literal("unmatched"), suggestion: MatchSuggestion }),
  z.object({ status: z.literal("ignored"), reason: z.enum(["marketing", "auto-reply", "unknown-inbox"]) }),
  z.object({ status: z.literal("failed"), step: z.enum(FAILED_STEPS), message: z.string() }),
]);
export type InboundEmailState = z.infer<typeof InboundEmailState>;
