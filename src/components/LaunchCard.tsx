import { useState } from "react";
import type { Launch } from "../api/types";
import Button from "./Button";
import card from "../styles/card.module.css";
import styles from "./LaunchCard.module.css";

const STATUS_NAMES: Record<string, string> = {
  Success: "Успешно",
  Failure: "Неудача",
  "Partial Failure": "Частичная неудача",
  Go: "Готов к запуску",
  TBC: "Ожидает подтверждения",
  TBD: "Дата уточняется"
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Дата неизвестна";
  }
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

interface Props {
  launch: Launch;
}

export default function LaunchCard({ launch }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const pad = [launch.pad, launch.location].filter(Boolean).join(", ");

  return (
    <li className={`${card.card} ${styles.mission}`}>
      <div className={styles.top}>
        <span className={styles.date}>{formatDate(launch.date)}</span>
        <span className={styles.badge}>
          {STATUS_NAMES[launch.statusAbbrev] ?? (launch.statusName || "Статус неизвестен")}
        </span>
      </div>
      <h3>{launch.name}</h3>
      <p>{launch.provider}</p>
      {launch.image && !imageFailed && (
        <img
          className={styles.image}
          src={launch.image}
          alt={launch.name}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      )}
      {expanded && (
        <div className={styles.more}>
          <p>{launch.description || "Описание миссии отсутствует."}</p>
          {launch.rocket && <p>Ракета: {launch.rocket}</p>}
          {launch.missionType && <p>Тип миссии: {launch.missionType}</p>}
          {pad && <p>Площадка: {pad}</p>}
        </div>
      )}
      <Button small aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>
        {expanded ? "Скрыть" : "Подробнее"}
      </Button>
    </li>
  );
}
