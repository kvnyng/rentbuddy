import type { Listing, NonNegativeInt, ParsedListing, Stage, TimeSlot } from "@rentbuddy/core";
import type { HTMLAttributes, KeyboardEvent } from "react";
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
  /** Makes the card a button that opens the listing. Omit for a static card. */
  onOpen?: () => void;
};

export function ListingCard({ listing, thumbnail, stage, nextViewing, unreadCount, onOpen }: ListingCardProps) {
  const { address } = listing;
  const streetAndUnit = `${address.street}${address.unit === null ? "" : ` #${address.unit}`}`;
  return (
    <article className={styles.card} {...(onOpen === undefined ? {} : buttonProps(onOpen, `Open listing at ${streetAndUnit}`))}>
      <div className={styles.photo} style={thumbnailStyle(thumbnail)}>
        <span className={styles.source}>{SOURCE_LABELS[listing.source]}</span>
        {unreadCount > 0 && (
          <span className={styles.unread} aria-label={`${unreadCount} unread`}>
            {unreadCount}
          </span>
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.address}>{streetAndUnit}</div>
        {address.neighborhood !== null && <div className={styles.neighborhood}>{address.neighborhood}</div>}
        <div className={styles.row}>
          <span className={styles.price}>
            {formatRent(listing.rent)}
            <span className={styles.per}>/mo</span>
          </span>
          <StageBadge stage={stage} />
        </div>
        <div className={styles.meta}>
          {[formatBedrooms(listing.bedrooms), formatBathrooms(listing.bathrooms), ...(listing.size === null ? [] : [formatSize(listing.size)])].join(" · ")}
        </div>
        {nextViewing !== null && <div className={styles.viewing}>Viewing: {formatSlot(nextViewing, listing.timeZone)}</div>}
      </div>
    </article>
  );
}

/**
 * Button semantics for a card that holds block content (which a real <button>
 * can't). Mirrors native buttons: Enter activates on keydown; Space activates
 * on keyup and its keydown is cancelled so the page doesn't scroll. Keys
 * pressed inside nested controls are ignored.
 */
function buttonProps(onOpen: () => void, label: string): HTMLAttributes<HTMLElement> {
  const fromCard = (e: KeyboardEvent<HTMLElement>) => e.target === e.currentTarget;
  return {
    role: "button",
    tabIndex: 0,
    "aria-label": label,
    onClick: onOpen,
    onKeyDown: (e) => {
      if (!fromCard(e)) return;
      if (e.key === "Enter") {
        e.preventDefault();
        onOpen();
      } else if (e.key === " ") {
        e.preventDefault();
      }
    },
    onKeyUp: (e) => {
      if (fromCard(e) && e.key === " ") onOpen();
    },
  };
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
