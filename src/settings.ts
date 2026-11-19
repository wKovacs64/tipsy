import useLocalStorageState from "use-local-storage-state";
import type { Defaults } from "./calc";

export const appDefaults: Defaults = { percent: 20, people: 1 };

export function useDefaults() {
  const [percent, setPercent] = useLocalStorageState("defaultTipPercent", {
    defaultValue: appDefaults.percent,
  });

  const [people, setPeople] = useLocalStorageState("defaultPartySize", {
    defaultValue: appDefaults.people,
  });

  return {
    defaults: { percent, people },
    setDefault: (field: keyof Defaults, value: number) => {
      if (field === "percent") setPercent(value);
      else setPeople(value);
    },
  };
}
