import type { ListingCardProps } from "./ListingCard";

export const sampleListings: ListingCardProps[] = [
  { address: "214 Bedford Ave #3F", neighborhood: "Williamsburg, Brooklyn", price: 3850, beds: 1, baths: 1, sqft: 650, source: "streeteasy", stage: "tracked", agentName: "Dana Ruiz", agentCompany: "Corcoran" },
  { address: "88 Orchard St #5B", neighborhood: "Lower East Side, Manhattan", price: 4200, beds: 2, baths: 1, source: "streeteasy", stage: "contacted", agentName: "Sam Patel", agentCompany: "Compass", unreadCount: 2 },
  { address: "31-15 30th Ave #2R", neighborhood: "Astoria, Queens", price: 2950, beds: 1, baths: 1, sqft: 720, source: "zillow", stage: "viewing-scheduled", agentName: "Jordan Lee", agentCompany: "Douglas Elliman", nextViewing: "Tue, Nov 11 · 6:30 PM" },
  { address: "540 W 50th St #12C", neighborhood: "Hell's Kitchen, Manhattan", price: 3600, beds: 0, baths: 1, sqft: 480, source: "zillow", stage: "viewed", agentName: "Alex Kim", agentCompany: "Brown Harris Stevens" },
  { address: "402 Prospect Pl #4", neighborhood: "Prospect Heights, Brooklyn", price: 4650, beds: 2, baths: 2, sqft: 980, source: "streeteasy", stage: "applied", agentName: "Riley Chen", agentCompany: "Bohemia Realty" },
  { address: "75 Clinton St #2A", neighborhood: "Cobble Hill, Brooklyn", price: 3950, beds: 1, baths: 1, source: "zillow", stage: "signed", agentName: "Morgan Diaz", agentCompany: "Corcoran" },
  { address: "1200 Broadway #9D", neighborhood: "NoMad, Manhattan", price: 5100, beds: 1, baths: 1, source: "streeteasy", stage: "passed", agentName: "Taylor Brooks", agentCompany: "Compass" },
];
