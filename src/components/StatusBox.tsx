import type { ReactNode } from "react";
import card from "../styles/card.module.css";
import styles from "./StatusBox.module.css";

interface Props {
  error?: boolean;
  children: ReactNode;
}

export default function StatusBox({ error, children }: Props) {
  return (
    <div className={`${card.card} ${styles.status} ${error ? styles.error : ""}`} aria-live="polite">
      {children}
    </div>
  );
}
