import { useEffect, useState } from "react";

function readTheme(): boolean {
  try {
    return localStorage.getItem("theme") === "light";
  } catch {
    return false;
  }
}

export function useTheme() {
  const [light, setLight] = useState<boolean>(readTheme);

  useEffect(() => {
    document.body.classList.toggle("light", light);
    try {
      localStorage.setItem("theme", light ? "light" : "dark");
    } catch {
      return;
    }
  }, [light]);

  return { light, toggle: () => setLight((value) => !value) };
}
