// components/EmptyState.tsx
import { Link } from "react-router-dom";
import styles from "./EmptyState.module.css";

type Props = {
  title: string;
  message: string;
  actionLabel?: string;
  actionTo?: string;
};

export default function EmptyState({ title, message, actionLabel, actionTo }: Props) {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      <p>{message}</p>

      {actionLabel && actionTo && (
        <Link to={actionTo} className={styles.button}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}