import { useCallback, useEffect, useRef, useState } from "react";
import { fetchLaunches, readCache, saveCache } from "../api/launches";
import type { Launch } from "../api/types";

export type Status = "loading" | "success" | "error";

export function useLaunches() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<unknown>(null);
  const requestId = useRef(0);

  const load = useCallback(async (force: boolean) => {
    const id = ++requestId.current;
    setStatus("loading");

    try {
      let data = force ? null : readCache();
      if (!data) {
        data = await fetchLaunches();
        saveCache(data);
      }
      if (id !== requestId.current) {
        return;
      }
      setLaunches(data);
      setStatus("success");
    } catch (e) {
      if (id === requestId.current) {
        setError(e);
        setStatus("error");
      }
    }
  }, []);

  useEffect(() => {
    void load(false);
    return () => {
      requestId.current++;
    };
  }, [load]);

  return { launches, status, error, reload: () => load(true) };
}
