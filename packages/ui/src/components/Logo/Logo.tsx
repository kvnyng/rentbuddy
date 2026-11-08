import mascot from "../../assets/mascot.png";
import styles from "./Logo.module.css";

export type LogoProps = {
  /** "full" = mascot + wordmark, "mark" = mascot only, "wordmark" = text only */
  variant?: "full" | "mark" | "wordmark";
  /** Height of the mascot in px; the wordmark scales with it. */
  size?: number;
};

export function Logo({ variant = "full", size = 48 }: LogoProps) {
  return (
    <span className={styles.logo} style={{ ["--logo-size" as string]: `${size}px` }}>
      {variant !== "wordmark" && <img className={styles.mark} src={mascot} alt={variant === "mark" ? "RentBuddy" : ""} />}
      {variant !== "mark" && (
        <span className={styles.wordmark}>
          Rent<span className={styles.accent}>Buddy</span>
        </span>
      )}
    </span>
  );
}
