import { Link } from "react-router-dom";
import { buttonClass } from "../components/Button";
import hero from "../images/hero.svg";
import saturn from "../images/planet-saturn.svg";
import rocket from "../images/rocket.svg";
import card from "../styles/card.module.css";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.text}>
          <h1>Путешествие по <span>Вселенной</span></h1>
          <p>Узнайте больше о планетах Солнечной системы и о том, как человек шёл к звёздам.</p>
          <div className={styles.buttons}>
            <Link className={buttonClass()} to="/planets">Смотреть планеты</Link>
            <Link className={buttonClass(true)} to="/missions">Открыть миссии</Link>
          </div>
        </div>
        <img src={hero} alt="Планета с кольцом и луна" />
      </section>

      <section>
        <h2 className={styles.title}>Разделы сайта</h2>
        <div className={styles.links}>
          <Link className={`${card.card} ${styles.linkCard}`} to="/planets">
            <img src={saturn} alt="Сатурн" />
            <h3>Планеты</h3>
            <p>Земля, Марс, Юпитер и Сатурн: размеры, спутники и необычные факты.</p>
            <span>Перейти →</span>
          </Link>
          <Link className={`${card.card} ${styles.linkCard}`} to="/missions">
            <img src={rocket} alt="Ракета" />
            <h3>Миссии</h3>
            <p>Последние запуски ракет со всего мира по данным публичного API.</p>
            <span>Перейти →</span>
          </Link>
        </div>
      </section>
    </>
  );
}
