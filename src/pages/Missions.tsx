import { useMemo, useState } from "react";
import { getErrorMessage } from "../api/launches";
import Button from "../components/Button";
import LaunchCard from "../components/LaunchCard";
import PageHead from "../components/PageHead";
import Spinner from "../components/Spinner";
import StatusBox from "../components/StatusBox";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useLaunches } from "../hooks/useLaunches";
import styles from "./Missions.module.css";

export default function Missions() {
  const { launches, status, error, reload } = useLaunches();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const query = useDebouncedValue(search, 250).trim().toLowerCase();

  const providers = useMemo(
    () => [...new Set(launches.map((launch) => launch.provider))].sort((a, b) => a.localeCompare(b)),
    [launches]
  );

  const selected = category === "all" || providers.includes(category) ? category : "all";

  const items = useMemo(
    () =>
      launches.filter((launch) => {
        const matchesCategory = selected === "all" || launch.provider === selected;
        const text = [launch.name, launch.provider, launch.rocket, launch.mission].join(" ").toLowerCase();
        return matchesCategory && text.includes(query);
      }),
    [launches, selected, query]
  );

  const loading = status === "loading";
  const count = status === "success" ? items.length : 0;

  return (
    <>
      <PageHead title="Миссии" text="Последние запуски ракет со всего мира. Данные: Launch Library 2 (The Space Devs)." />

      <div className={styles.toolbar} role="search">
        <label className={styles.field}>
          <span>Поиск</span>
          <input
            type="search"
            placeholder="Название, ракета, оператор"
            autoComplete="off"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span>Оператор</span>
          <select value={selected} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">Все</option>
            {providers.map((provider) => (
              <option key={provider} value={provider}>
                {provider}
              </option>
            ))}
          </select>
        </label>
        <Button disabled={loading} onClick={() => void reload()}>
          {loading ? "Загрузка…" : "Обновить"}
        </Button>
      </div>

      <p className={styles.counter}>Показано запусков: {count}</p>

      {loading && (
        <StatusBox>
          <Spinner />
          <p>Загрузка…</p>
        </StatusBox>
      )}

      {status === "error" && (
        <StatusBox error>
          <p>{getErrorMessage(error)}</p>
          <Button onClick={() => void reload()}>Повторить попытку</Button>
        </StatusBox>
      )}

      {status === "success" && items.length === 0 && (
        <StatusBox>
          <p>Ничего не найдено</p>
        </StatusBox>
      )}

      {status === "success" && items.length > 0 && (
        <ul className={styles.timeline}>
          {items.map((launch) => (
            <LaunchCard key={launch.id} launch={launch} />
          ))}
        </ul>
      )}
    </>
  );
}
