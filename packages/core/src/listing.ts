import { z } from "zod";
import { Bathrooms, EmailAddress, HttpsUrl, IanaTimeZone, ListingId, Money, PositiveInt, SquareFeet } from "./primitives";

export const LISTING_SOURCES = ["zillow", "streeteasy"] as const;
export const ListingSource = z.enum(LISTING_SOURCES);
export type ListingSource = z.infer<typeof ListingSource>;

/** "0 bedrooms" is not a number of bedrooms; a studio is its own kind. */
export const Bedrooms = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("studio") }),
  z.object({ kind: z.literal("bedrooms"), count: PositiveInt }),
]);
export type Bedrooms = z.infer<typeof Bedrooms>;

export const Agent = z.object({
  name: z.string().trim().min(1),
  company: z.string().trim().min(1).nullable(),
  email: EmailAddress.nullable(),
  phone: z.string().trim().min(1).nullable(),
});
export type Agent = z.infer<typeof Agent>;

/** What a site parser extracts from a listing page. */
export const ParsedListing = z.object({
  source: ListingSource,
  sourceId: z.string().min(1),
  url: HttpsUrl,
  address: z.object({
    street: z.string().trim().min(1),
    unit: z.string().trim().min(1).nullable(),
    neighborhood: z.string().trim().min(1).nullable(),
    city: z.string().trim().min(1),
  }),
  /** The listing's local time zone. Viewing times are always shown in it, wherever the renter is. */
  timeZone: IanaTimeZone,
  rent: Money,
  bedrooms: Bedrooms,
  bathrooms: Bathrooms,
  size: SquareFeet.nullable(),
  photos: z.array(HttpsUrl),
  agent: Agent.nullable(),
});
export type ParsedListing = z.infer<typeof ParsedListing>;

export const Listing = ParsedListing.extend({
  id: ListingId,
  thumbnail: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("pending") }),
    z.object({ kind: z.literal("ready"), url: HttpsUrl }),
    z.object({ kind: z.literal("unavailable") }),
  ]),
});
export type Listing = z.infer<typeof Listing>;

/**
 * Result of running a site parser over a page. Every outcome is explicit,
 * so the extension's popup can say exactly why it can't track a page.
 */
export type PageParseResult =
  | { kind: "listing"; listing: ParsedListing }
  | { kind: "not-a-listing-page" }
  | { kind: "unsupported-layout"; issues: readonly string[] };
