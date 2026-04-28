// src/utils/professionMap.ts

const PROFESSION_MAP: Record<string, string> = {
  // plumber
  pipe: "plumber",
  leak: "plumber",
  water: "plumber",
  sink: "plumber",

  // electrician
  socket: "electrician",
  light: "electrician",
  wiring: "electrician",
  electricity: "electrician",

  // roofer
  roof: "roofer",
  tiles: "roofer",

  // carpenter
  wood: "carpenter",
  furniture: "carpenter",
  door: "carpenter",

  // cleaner
  clean: "cleaner",
  cleaning: "cleaner",

  // painter
  paint: "painter",
  wall: "painter",

  // tiler
  tile: "tiler",
  bathroom: "tiler",

  // helper
  move: "helper",
  carry: "helper",
};

export function detectProfession(input: string): string | null {
  const text = input.toLowerCase();

  for (const key in PROFESSION_MAP) {
    if (text.includes(key)) {
      return PROFESSION_MAP[key];
    }
  }

  return null;
}