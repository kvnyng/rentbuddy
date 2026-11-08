import type { Bathrooms, Bedrooms, IanaTimeZone, ListingSource, Money, SquareFeet, TimeSlot } from "@rentbuddy/core";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const formatRent = (rent: Money) => usd.format(rent / 100);

export function formatBedrooms(bedrooms: Bedrooms): string {
  switch (bedrooms.kind) {
    case "studio":
      return "Studio";
    case "bedrooms":
      return `${bedrooms.count} bd`;
  }
}

export const formatBathrooms = (b: Bathrooms) => `${b} ba`;
export const formatSize = (s: SquareFeet) => `${s.toLocaleString("en-US")} ft²`;

export const SOURCE_LABELS: Record<ListingSource, string> = { zillow: "Zillow", streeteasy: "StreetEasy" };

/** Formats a viewing in the listing's time zone, e.g. "Wed, Nov 11, 6:30 PM EST". */
export const formatSlot = (slot: TimeSlot, timeZone: IanaTimeZone) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(slot.start);
