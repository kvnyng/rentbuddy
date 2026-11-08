import { z } from "zod";

/*
 * Branded primitives. The schema is the only way to obtain each type, so a
 * value of type `Money` is proof it passed the Money parser ("smart constructor").
 */

// ---------- Identifiers ----------
export const UserId = z.string().regex(/^user_[A-Za-z0-9]+$/, "Clerk user id").brand<"UserId">();
export type UserId = z.infer<typeof UserId>;

export const ListingId = z.uuid().brand<"ListingId">();
export type ListingId = z.infer<typeof ListingId>;

export const TrackedListingId = z.uuid().brand<"TrackedListingId">();
export type TrackedListingId = z.infer<typeof TrackedListingId>;

export const ViewingId = z.uuid().brand<"ViewingId">();
export type ViewingId = z.infer<typeof ViewingId>;

export const ThreadId = z.uuid().brand<"ThreadId">();
export type ThreadId = z.infer<typeof ThreadId>;

export const MessageId = z.uuid().brand<"MessageId">();
export type MessageId = z.infer<typeof MessageId>;

// ---------- Contact ----------
export const EmailAddress = z
  .email()
  .transform((s) => s.toLowerCase())
  .brand<"EmailAddress">();
export type EmailAddress = z.infer<typeof EmailAddress>;

export const HttpsUrl = z.url({ protocol: /^https$/ }).brand<"HttpsUrl">();
export type HttpsUrl = z.infer<typeof HttpsUrl>;

// ---------- Numbers ----------
/** US dollars as integer cents. Never a float, never negative. */
export const Money = z.int().nonnegative().brand<"Money">();
export type Money = z.infer<typeof Money>;
export const dollars = (amount: number): Money => Money.parse(Math.round(amount * 100));

export const PositiveInt = z.int().positive().brand<"PositiveInt">();
export type PositiveInt = z.infer<typeof PositiveInt>;

export const NonNegativeInt = z.int().nonnegative().brand<"NonNegativeInt">();
export type NonNegativeInt = z.infer<typeof NonNegativeInt>;

/** Bathrooms come in halves: 1, 1.5, 2… */
export const Bathrooms = z
  .number()
  .positive()
  .refine((n) => Number.isInteger(n * 2), "must be a multiple of 0.5")
  .brand<"Bathrooms">();
export type Bathrooms = z.infer<typeof Bathrooms>;

export const SquareFeet = z.int().positive().max(100_000).brand<"SquareFeet">();
export type SquareFeet = z.infer<typeof SquareFeet>;

/** Model or matcher confidence in [0, 1]. */
export const Confidence = z.number().min(0).max(1).brand<"Confidence">();
export type Confidence = z.infer<typeof Confidence>;

// ---------- Time ----------
const isIanaTimeZone = (tz: string): boolean => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};

/** An IANA time zone the runtime recognizes, e.g. "America/New_York". */
export const IanaTimeZone = z.string().refine(isIanaTimeZone, "unknown IANA time zone").brand<"IanaTimeZone">();
export type IanaTimeZone = z.infer<typeof IanaTimeZone>;

/**
 * ISO-8601 string with offset on the wire, Date in the domain. A codec, so
 * `.parse` decodes wire → domain and `.encode` turns domain → wire.
 */
export const Timestamp = z.codec(z.iso.datetime({ offset: true }), z.date(), {
  decode: (iso) => new Date(iso),
  encode: (date) => date.toISOString(),
});
export type Timestamp = z.infer<typeof Timestamp>;

export const TimeSlot = z
  .object({ start: Timestamp, end: Timestamp })
  .refine((s) => s.end > s.start, "end must be after start");
export type TimeSlot = z.infer<typeof TimeSlot>;
