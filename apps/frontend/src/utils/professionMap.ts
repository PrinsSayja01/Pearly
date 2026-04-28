// src/utils/professionMap.ts

const PROFESSION_MAP: Record<string, string[]> = {
  plumber: ["pipe", "leak", "water", "sink", "drain"],
  electrician: ["socket", "light", "wiring", "electricity"],
  roofer: ["roof", "tiles", "leak roof"],
  carpenter: ["wood", "furniture", "door"],
  painter: ["paint", "wall"],
  tiler: ["tile", "bathroom"],
  cleaner: ["clean", "cleaning"],
  helper: ["move", "carry"],
  mason: ["brick", "cement"],
  gardener: ["garden", "grass"],
  hvac: ["ac", "heating"],
  mechanic: ["car", "engine"],
  welder: ["weld", "metal"],
  plasterer: ["plaster"],
  glazier: ["glass", "window"],
  installer: ["install"],
  remover: ["remove"],
  decorator: ["decorate"],
  security: ["alarm", "camera"],
  pest_control: ["pest", "insects"]
};

export function detectProfession(input: string) {
  const text = input.toLowerCase();

  let matches: string[] = [];

  for (const role in PROFESSION_MAP) {
    for (const keyword of PROFESSION_MAP[role]) {
      if (text.includes(keyword)) {
        matches.push(role);
        break;
      }
    }
  }

  const unique = [...new Set(matches)];

  return {
    profession: unique[0] || null,
    suggestions: unique.slice(0, 2)
  };
}