import { writable } from "svelte/store";

function createDarkModeStore() {
  const { set, subscribe, update } = writable<"light" | "dark">("dark");

  return {
    set,
    subscribe,
    toggle: () => {
      update((_) => (_ === "dark" ? "light" : "dark"));
    },
  };
}

export const darkMode = createDarkModeStore();
