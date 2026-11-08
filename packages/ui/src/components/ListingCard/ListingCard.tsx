import type { Stage } from "../../tokens/tokens";
import { StageBadge } from "../StageBadge/StageBadge";
import styles from "./ListingCard.module.css";

export type ListingSource = "zillow" | "streeteasy";

export type ListingCardProps = {
  address: string;
  neighborhood?: string;
  price: number;
  beds: number;
  baths: number;
  sqft?: number;
  photoUrl?: string;
  source: ListingSource;
  stage: Stage;
  agentName?: string;
  agentCompany?: string;
  /** Pre-formatted, e.g. "Tue, Nov 11 · 6:30 PM" */
  nextViewing?: string;
  unreadCount?: number;
  onClick?: () => void;
};

const SOURCE_LABEL: Record<ListingSource, string> = { zillow: "Zillow", streeteasy: "StreetEasy" };
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function ListingCard(p: ListingCardProps) {
  return (
    <article className={styles.card} onClick={p.onClick} tabIndex={p.onClick ? 0 : undefined}>
      <div className={styles.photo} style={p.photoUrl ? { backgroundImage: `url(${p.photoUrl})` } : undefined}>
        <span className={styles.source}>{SOURCE_LABEL[p.source]}</span>
        {!!p.unreadCount && <span className={styles.unread} aria-label={`${p.unreadCount} unread`}>{p.unreadCount}</span>}
      </div>
      <div className={styles.body}>
        <div className={styles.row}>
          <span className={styles.price}>{usd.format(p.price)}<span className={styles.per}>/mo</span></span>
          <StageBadge stage={p.stage} />
        </div>
        <div className={styles.address}>{p.address}</div>
        {p.neighborhood && <div className={styles.meta}>{p.neighborhood}</div>}
        <div className={styles.meta}>
          {p.beds === 0 ? "Studio" : `${p.beds} bd`} · {p.baths} ba{p.sqft ? ` · ${p.sqft.toLocaleString()} ft²` : ""}
        </div>
        {(p.agentName || p.agentCompany) && (
          <div className={styles.agent}>
            {p.agentName}{p.agentName && p.agentCompany ? " · " : ""}<span className={styles.company}>{p.agentCompany}</span>
          </div>
        )}
        {p.nextViewing && <div className={styles.viewing}>Viewing: {p.nextViewing}</div>}
      </div>
    </article>
  );
}
