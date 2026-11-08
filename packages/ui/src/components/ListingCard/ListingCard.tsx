import type { Listing, NonNegativeInt, ParsedListing, Stage, TimeSlot } from "@rentbuddy/core";
import { formatBathrooms, formatBedrooms, formatRent, formatSize, formatSlot, SOURCE_LABELS } from "../../format";
import { StageBadge } from "../StageBadge/StageBadge";
import styles from "./ListingCard.module.css";

export type ListingCardListing = Pick<ParsedListing, "source" | "address" | "timeZone" | "rent" | "bedrooms" | "bathrooms" | "size" | "agent">;

export type ListingCardProps = {
  listing: ListingCardListing;
  thumbnail: Listing["thumbnail"];
  stage: Stage;
  /** The confirmed viewing, if one is scheduled. */
  nextViewing: TimeSlot | null;
  unreadCount: NonNegativeInt;
  onOpen?: () => void;
};

export function ListingCard({ listing, thumbnail, stage, nextViewing, unreadCount, onOpen }: ListingCardProps) {
  const { address, agent } = listing;
  return (
    <article className={styles.card} onClick={onOpen} tabIndex={onOpen === undefined ? undefined : 0}>
      <div className={styles.photo} style={thumbnailStyle(thumbnail)}>
        <span className={styles.source}>{SOURCE_LABELS[listing.source]}</span>
        {unreadCount > 0 && (
          <span className={styles.unread} aria-label={`${unreadCount} unread`}>
            {unreadCount}
          </span>
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.row}>
          <span className={styles.price}>
            {formatRent(listing.rent)}
            <span className={styles.per}>/mo</span>
          </span>
          <StageBadge stage={stage} />
        </div>
        <div className={styles.address}>
          {address.street}
          {address.unit === null ? "" : ` #${address.unit}`}
        </div>
        {address.neighborhood !== null && <div className={styles.meta}>{address.neighborhood}</div>}
        <div className={styles.meta}>
          {[formatBedrooms(listing.bedrooms), formatBathrooms(listing.bathrooms), ...(listing.size === null ? [] : [formatSize(listing.size)])].join(" · ")}
        </div>
        {agent !== null && (
          <div className={styles.agent}>
            {agent.name}
            {agent.company !== null && <span className={styles.company}> · {agent.company}</span>}
          </div>
        )}
        {nextViewing !== null && <div className={styles.viewing}>Viewing: {formatSlot(nextViewing, listing.timeZone)}</div>}
      </div>
    </article>
  );
}

function thumbnailStyle(thumbnail: Listing["thumbnail"]) {
  switch (thumbnail.kind) {
    case "ready":
      return { backgroundImage: `url(${thumbnail.url})` };
    case "pending":
    case "unavailable":
      return undefined; // gradient placeholder from CSS
  }
}
