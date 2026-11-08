import { NonNegativeInt, ParsedListing, Stage, TimeSlot, dollars } from "@rentbuddy/core";
import type { z } from "zod";
import type { ListingCardProps } from "./ListingCard";

/*
 * Fixtures go through the same parsers as real data, so a fixture can't hold
 * a value production code would reject.
 */
type Raw = Omit<z.input<typeof ParsedListing>, "url" | "photos" | "sourceId" | "timeZone">;

const card = (
  raw: Raw,
  stage: Stage,
  extras: { unread?: number; viewing?: { start: string; end: string } } = {},
): ListingCardProps => ({
  listing: ParsedListing.parse({
    ...raw,
    sourceId: raw.address.street,
    url: "https://example.com/listing",
    photos: [],
    timeZone: "America/New_York",
  }),
  thumbnail: { kind: "pending" },
  stage: Stage.parse(stage),
  nextViewing: extras.viewing === undefined ? null : TimeSlot.parse(extras.viewing),
  unreadCount: NonNegativeInt.parse(extras.unread ?? 0),
});

const agent = (name: string, company: string) => ({ name, company, email: null, phone: null });

export const williamsburg = card(
  { source: "streeteasy", address: { street: "214 Bedford Ave", unit: "3F", neighborhood: "Williamsburg, Brooklyn", city: "Brooklyn" }, rent: dollars(3850), bedrooms: { kind: "bedrooms", count: 1 }, bathrooms: 1, size: 650, agent: agent("Dana Ruiz", "Corcoran") },
  "tracked",
);
export const lowerEastSide = card(
  { source: "streeteasy", address: { street: "88 Orchard St", unit: "5B", neighborhood: "Lower East Side, Manhattan", city: "New York" }, rent: dollars(4200), bedrooms: { kind: "bedrooms", count: 2 }, bathrooms: 1, size: null, agent: agent("Sam Patel", "Compass") },
  "contacted",
  { unread: 2 },
);
export const astoria = card(
  { source: "zillow", address: { street: "31-15 30th Ave", unit: "2R", neighborhood: "Astoria, Queens", city: "Queens" }, rent: dollars(2950), bedrooms: { kind: "bedrooms", count: 1 }, bathrooms: 1, size: 720, agent: agent("Jordan Lee", "Douglas Elliman") },
  "viewing-scheduled",
  { viewing: { start: "2026-11-11T18:30:00-05:00", end: "2026-11-11T19:00:00-05:00" } },
);
export const hellsKitchen = card(
  { source: "zillow", address: { street: "540 W 50th St", unit: "12C", neighborhood: "Hell's Kitchen, Manhattan", city: "New York" }, rent: dollars(3600), bedrooms: { kind: "studio" }, bathrooms: 1, size: 480, agent: agent("Alex Kim", "Brown Harris Stevens") },
  "viewed",
);
export const prospectHeights = card(
  { source: "streeteasy", address: { street: "402 Prospect Pl", unit: "4", neighborhood: "Prospect Heights, Brooklyn", city: "Brooklyn" }, rent: dollars(4650), bedrooms: { kind: "bedrooms", count: 2 }, bathrooms: 2, size: 980, agent: agent("Riley Chen", "Bohemia Realty") },
  "applied",
);
export const cobbleHill = card(
  { source: "zillow", address: { street: "75 Clinton St", unit: "2A", neighborhood: "Cobble Hill, Brooklyn", city: "Brooklyn" }, rent: dollars(3950), bedrooms: { kind: "bedrooms", count: 1 }, bathrooms: 1, size: null, agent: agent("Morgan Diaz", "Corcoran") },
  "signed",
);
export const nomad = card(
  { source: "streeteasy", address: { street: "1200 Broadway", unit: "9D", neighborhood: "NoMad, Manhattan", city: "New York" }, rent: dollars(5100), bedrooms: { kind: "bedrooms", count: 1 }, bathrooms: 1, size: null, agent: agent("Taylor Brooks", "Compass") },
  "passed",
);
export const noAgentStudio = card(
  { source: "zillow", address: { street: "10 Main St", unit: null, neighborhood: null, city: "Brooklyn" }, rent: dollars(2400), bedrooms: { kind: "studio" }, bathrooms: 1, size: null, agent: null },
  "tracked",
);

export const sampleCards: readonly ListingCardProps[] = [williamsburg, lowerEastSide, astoria, hellsKitchen, prospectHeights, cobbleHill, nomad];
