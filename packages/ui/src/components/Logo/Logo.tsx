import mascot from "../../assets/mascot.png";
import styles from "./Logo.module.css";

export type LogoProps = {
  /** "full" = mascot + wordmark, "mark" = mascot only, "wordmark" = text only */
  variant?: "full" | "mark" | "wordmark";
  /** Height of the mascot in px; the wordmark scales with it. */
  size?: number;
};

export function Logo({ variant = "full", size = 48 }: LogoProps) {
  const style = { "--logo-size": `${size}px` };
  switch (variant) {
    case "full":
      return (
        <span className={styles.logo} style={style}>
          <img className={styles.mark} src={mascot} alt="" />
          <Wordmark />
        </span>
      );
    case "mark":
      return (
        <span className={styles.logo} style={style}>
          <img className={styles.mark} src={mascot} alt="RentBuddy" />
        </span>
      );
    case "wordmark":
      return (
        <span className={styles.logo} style={style}>
          <Wordmark />
        </span>
      );
  }
}

const Wordmark = () => (
  <span className={styles.wordmark}>
    Rent<span className={styles.accent}>Buddy</span>
  </span>
);
