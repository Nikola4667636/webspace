import { useState } from "react";
import Button from "../components/Button";
import PageHead from "../components/PageHead";
import { planets } from "../data/planets";
import card from "../styles/card.module.css";
import styles from "./Planets.module.css";

export default function Planets() {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const planet = planets[current];

  return (
    <>
      <PageHead title="Планеты" text="Выберите планету, чтобы узнать о ней больше." />
      <div className={styles.tabs}>
        {planets.map((item, index) => (
          <button
            key={item.name}
            type="button"
            className={index === current ? `${styles.tab} ${styles.activeTab}` : styles.tab}
            onClick={() => setCurrent(index)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <section className={`${card.card} ${styles.planet}`}>
        <img src={planet.image} alt={planet.name} />
        <div className={styles.info}>
          <h2>{planet.name}</h2>
          <p className={styles.lead}>{planet.lead}</p>
          <ul className={styles.facts}>
            {planet.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
          {expanded && <p className={styles.more}>{planet.more}</p>}
          <div className={styles.buttons}>
            <Button onClick={() => setExpanded((value) => !value)}>{expanded ? "Скрыть" : "Подробнее"}</Button>
            <Button secondary onClick={() => setCurrent((current + 1) % planets.length)}>Следующая планета</Button>
          </div>
        </div>
      </section>
    </>
  );
}
