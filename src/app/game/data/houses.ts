export interface House {
  id: string;
  name: string;
  color: string;
  seat: string;
  map: "westeros" | "essos";
  sigil: string;
  startArmies: Record<number, number>;
}

export const HOUSES: Record<string, House> = {
  stark: {
    id: "stark",
    name: "House Stark",
    color: "#C0C0C0",
    seat: "winterfell",
    map: "westeros",
    sigil: "🐺",
    startArmies: { 2: 21, 3: 28, 4: 24, 5: 20, 6: 20, 7: 20 },
  },
  baratheon: {
    id: "baratheon",
    name: "House Baratheon",
    color: "#3B2E1A",
    seat: "dragonstone",
    map: "westeros",
    sigil: "🦌",
    startArmies: { 2: 21, 3: 28, 4: 24, 5: 20, 6: 20, 7: 20 },
  },
  lannister: {
    id: "lannister",
    name: "House Lannister",
    color: "#D4A017",
    seat: "casterly-rock",
    map: "westeros",
    sigil: "🦁",
    startArmies: { 2: 21, 3: 28, 4: 24, 5: 20, 6: 20, 7: 20 },
  },
  tyrell: {
    id: "tyrell",
    name: "House Tyrell",
    color: "#2E7D32",
    seat: "highgarden",
    map: "westeros",
    sigil: "🌹",
    startArmies: { 4: 24, 5: 20, 6: 20, 7: 20 },
  },
  martell: {
    id: "martell",
    name: "House Martell",
    color: "#B22222",
    seat: "sunspear",
    map: "westeros",
    sigil: "☀️",
    startArmies: { 5: 20, 6: 20, 7: 20 },
  },
  targaryen: {
    id: "targaryen",
    name: "House Targaryen",
    color: "#CC0000",
    seat: "the-flatlands",
    map: "essos",
    sigil: "🐉",
    startArmies: { 2: 21, 6: 20, 7: 20 },
  },
  ghiscari: {
    id: "ghiscari",
    name: "House Ghiscari",
    color: "#00897B",
    seat: "astapor",
    map: "essos",
    sigil: "🦅",
    startArmies: { 2: 21, 6: 20, 7: 20 },
  },
};

export function getHousesForPlayerCount(count: number, mode: string): string[] {
  if (mode === "world_at_war") {
    const all = [
      "stark",
      "baratheon",
      "lannister",
      "tyrell",
      "martell",
      "targaryen",
      "ghiscari",
    ];
    return all.slice(0, count);
  }
  if (count === 2) return ["targaryen", "ghiscari"];
  if (count === 3) return ["stark", "baratheon", "lannister"];
  if (count === 4) return ["stark", "baratheon", "lannister", "tyrell"];
  if (count === 5)
    return ["stark", "baratheon", "lannister", "tyrell", "martell"];
  return ["stark", "baratheon", "lannister"];
}

export function getTurnOrderBonuses(playerIndex: number, playerCount: number) {
  if (playerIndex === 0) return { gold: 0, cards: 0, maester: 0 };
  if (playerIndex === 1) return { gold: 300, cards: 0, maester: 0 };
  if (playerIndex === 2 && playerCount === 3)
    return { gold: 300, cards: 0, maester: 0 };
  if (playerIndex === 2) return { gold: 300, cards: 0, maester: 0 };
  if (playerIndex === 3) return { gold: 500, cards: 1, maester: 0 };
  if (playerIndex === 4) return { gold: 500, cards: 1, maester: 0 };
  if (playerIndex === 5) return { gold: 500, cards: 1, maester: 0 };
  if (playerIndex === 6) return { gold: 500, cards: 1, maester: 1 };
  return { gold: 0, cards: 0, maester: 0 };
}
