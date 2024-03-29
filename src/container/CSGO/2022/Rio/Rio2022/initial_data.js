// prettier-ignore

const teamLogo = (code) => `https://img.majors.im/go/rio2022/${code}_glitter.png`;
const addLogo = x => ({
  ...x,
  logo: teamLogo(x.code),
  displayCode: x.code,
})


export const initialDataLegends = [
  {
    code: "faze",
    name: "FaZe Clan",
    seed: 1,
    description: "EUA #1",
    region: "EU",
  },
  {
    code: "navi",
    name: "Natus Vincere",
    seed: 2,
    description: "EUB #1",
    region: "EU",
  },
  {
    code: "nip",
    name: "Ninjas in Pyjamas",
    seed: 3,
    description: "EUA #2",
    region: "EU",
  },
  {
    code: "ence",
    name: "ENCE",
    seed: 4,
    description: "EUB #2",
    region: "EU",
  },
  {
    code: "spr",
    name: "Sprout",
    seed: 5,
    description: "EUA #3",
    region: "EU",
  },
  {
    code: "hero",
    name: "Heroic",
    seed: 6,
    description: "EUB #3",
    region: "EU",
  },
  {
    code: "spir",
    name: "Team Spirit",
    seed: 7,
    description: "EUA #4",
    region: "EU",
  },
  {
    code: "liq",
    name: "Team Liquid",
    seed: 8,
    description: "AM #1",
    region: "AM",
  },
].map(addLogo);

export const initialDataChallenger = [
  {
    code: "og",
    name: "OG",
    "seed": 9,
    "description": "EUB #4",
    region: "EU",
  },
  {
    code: "vita",
    name: "Team Vitality",
    seed: 10,
    description: "EUB #5",
    region: "EU",
  },
  {
    code: "evl",
    name: "Evil Geniuses",
    seed: 11,
    description: "AM #2",
    region: "AM",
  },
  {
    code: "c9",
    name: "Cloud9",
    seed: 12,
    description: "EUA #5",
    region: "EU",
  },
  {
    code: "big",
    name: "BIG",
    seed: 13,
    region: "EU",
    description: "EUB #6",
  },
  {
    code: "bne",
    name: "Bad News Eagles",
    seed: 14,
    description: "EUA #7",
    region: "EU",
  },
  {
    code: "mouz",
    name: "MOUZ",
    seed: 15,
    description: "EUB #7",
    region: "EU",
  },
  {
    code: "nine",
    name: "9z Team",
    seed: 16,
    description: "AM #3",
    region: "AM",
  },
  {
    code: "gl",
    name: "Team GamerLegion",
    seed: 17,
    description: "EUA #7",
    region: "EU",
  },
  {
    code: "out",
    name: "Outsiders",
    seed: 18,
    description: "EUB #8",
    region: "EU",
  },
  {
    code: "zzn",
    name: "00 Nation",
    seed: 19,
    description: "AM #4",
    region: "AM",
  },
  {
    code: "furi",
    name: "FURIA Esports",
    seed: 20,
    description: "AM #5",
    region: "AM",
  },
  {
    code: "fntc",
    name: "Fnatic",
    seed: 21,
    description: "EUA #8",
    region: "EU",
  },
  {
    code: "ihc",
    name: "IHC Esports",
    seed: 22,
    description: "AP #1",
    region: "AP",
  },
  {
    code: "imp",
    name: "Imperial Esports",
    seed: 23,
    description: "AM #6",
    region: "AM",
  },
  {
    code: "gray",
    name: "Grayhound Gaming",
    seed: 24,
    description: "AP #2",
    region: "AP",
  },
].map(addLogo);

export const finalDataLegends = [
  ...initialDataLegends,
  {
    code: "mouz",
    name: "MOUZ",
    seed: 9,
    description: "3-0, +1",
    region: "EU",
  },
  {
    code: "bne",
    name: "Bad News Eagles",
    seed: 10,
    description: "3-0, -2",
    region: "EU",
  },
  {
    code: "out",
    name: "Outsiders",
    seed: 11,
    description: "3-1, +3",
    region: "EU",
  },
  {
    code: "big",
    name: "BIG",
    seed: 12,
    description: "3-1, +2",
    region: "EU",
  },
  {
    code: "furi",
    name: "FURIA Esports",
    seed: 13,
    description: "3-1, -3",
    region: "AM",
  },
  {
    code: "fntc",
    name: "Fnatic",
    seed: 14,
    description: "3-2, +4",
    region: "EU",
  },
  {
    code: "vita",
    name: "Team Vitality",
    seed: 15,
    description: "3-2, -5",
    region: "EU",
  },
  {
    code: "c9",
    name: "Cloud9",
    seed: 16,
    description: "3-2, -7",
    region: "EU",
  },
].map(addLogo);


export const finalDataChampions = [
  {
    code: "c9",
    name: "Cloud9",
    seed: 1,
    description: "3-0, 0",
    region: "EU",
  },
  {
    seed: 2,
    code: "furi",
    name: "FURIA Esports",
    description: "3-0, -1",
    region: "AM",
  },
  {
    code: "hero",
    name: "Heroic",
    seed: 3,
    description: "3-1, +6",
    region: "EU",
  },
  {
    code: "out",
    name: "Outsiders",
    seed: 4,
    description: "3-1, +1",
    region: "EU",
  },
  {
    code: "fntc",
    name: "Fnatic",
    seed: 5,
    description: "3-1, -3",
    region: "EU",
  },
  {
    code: "spir",
    name: "Team Spirit",
    seed: 6,
    description: "3-2, 0",
    region: "EU",
  },
  {
    code: "navi",
    name: "Natus Vincere",
    seed: 7,
    description: "3-2, -3, Seed 2",
    region: "EU",
  },
  {
    code: "mouz",
    name: "MOUZ",
    seed: 8,
    description: "3-2, -3, Seed 9",
    region: "EU",
  }
].map(addLogo);
