import { Link, NavLink, Outlet } from "react-router-dom";
import Button from "./Button";
import { useTheme } from "../hooks/useTheme";
import styles from "./Layout.module.css";

const links = [
  { to: "/", label: "Главная", end: true },
  { to: "/planets", label: "Планеты", end: false },
  { to: "/missions", label: "Миссии", end: false }
];

export default function Layout() {
  const { toggle } = useTheme();

  return (
    <>
      <header className={styles.header}>
        <Link className={styles.brand} to="/">Космос</Link>
        <nav className={styles.nav}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <Button secondary onClick={toggle}>Сменить тему</Button>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p>Космос, 2026</p>
      </footer>
    </>
  );
}
