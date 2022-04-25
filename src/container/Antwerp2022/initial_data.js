// prettier-ignore

/*
  EUA EUB AM AP
  1   1   1
  2   2
  3   3
  4

          2
          3
      4
  5   5
  6   6
      7

              1
              2
           4
           5
           6
  7
  8   8

*/

export const initialDataLegends = [
  {
    code: "eu/hero",
    name: "Heroic",
    seed: 1,
    description: "EUA #1",
  },
  {
    code: "eu/cphf",
    name: "Copenhagen Flames",
    seed: 2,
    description: "EUB #1",
  },
  {
    code: "eu/big",
    name: "BIG",
    seed: 3,
    description: "EUA #2",
  },
  {
    code: "eu/c9",
    name: "Cloud9 (Qualified as Players)",
    seed: 4,
    description: "EUB #2",
  },
  {
    code: "am/furi",
    name: "FURIA Esports",
    seed: 5,
    description: "AM #1",
  },
  {
    code: "eu/faze",
    name: "FaZe Clan",
    seed: 6,
    description: "EUA #3",
  },
  {
    code: "eu/nip",
    name: "Ninjas in Pyjamas",
    seed: 7,
    description: "EUB #3",
  },
  {
    code: "eu/navi",
    name: "Natus Vincere",
    seed: 8,
    description: "EUA #4",
  },
];

export const initialDataChallenger = [
  {
    code: "eu/ence",
    name: "ENCE",
    seed: 9,
    description: "EUB #4",
  },
  {
    code: "eu/g2",
    name: "G2 Esports",
    seed: 10,
    description: "EUB #5",
  },
  {
    code: "eu/forz",
    name: "forZe",
    seed: 11,
    description: "EUA #5",
  },
  {
    code: "eu/astr",
    name: "Astralis",
    seed: 12,
    description: "EUB #6",
  },
  {
    code: "eu/vita",
    name: "Team Vitality",
    seed: 13,
    description: "EUA #6",
  },
  {
    code: "am/mibr",
    name: "MIBR",
    seed: 14,
    description: "AM #2",
  },
  {
    code: "am/impe",
    name: "Imperial Esports",
    seed: 15,
    description: "AM #3",
  },
  {
    code: "eu/bne",
    name: "Bad News Eagles",
    seed: 16,
    description: "EUB #7",
  },
  {
    code: "eu/ef",
    name: "Eternal Fire",
    seed: 17,
    description: "EUA #7",
  },
  {
    code: "eu/spir",
    name: "Team Spirit",
    seed: 18,
    description: "EUB #8",
  },
  {
    code: "eu/outs",
    name: "Outsiders",
    seed: 19,
    description: "EUA #8",
  },
  {
    code: "am/col",
    name: "Complexity Gaming",
    seed: 20,
    description: "AM #4",
  },
  {
    code: "ap/ihc",
    name: "IHC Esports",
    seed: 21,
    description: "AP #1",
  },
  {
    code: "ap/rng",
    name: "Renegades",
    seed: 22,
    description: "AP #2",
  },
  {
    code: "am/liqu",
    name: "Team Liquid",
    seed: 23,
    description: "AM #5",
  },
  {
    code: "am/9z",
    name: "9z Team",
    seed: 24,
    description: "AM #6",
  },
];

/*
export const finalDataLegends = [
  {
    code: "nip",
    name: "Ninjas in Pyjamas",
    "seed": 1,
    "description": "EU #1"
  },
  {
    code: "furi",
    name: "FURIA",
    "seed": 2,
    "description": "NA #1"
  },
  {
    code: "navi",
    name: "Natus Vincere",
    "seed": 3,
    "description": "CIS #1"
  },
  {
    code: "vita",
    name: "Vitality",
    "seed": 4,
    "description": "EU #2"
  },
  {
    code: "liq",
    name: "Liquid",
    "seed": 5,
    "description": "NA #2"
  },
  {
    code: "gamb",
    name: "Gambit",
    "seed": 6,
    "description": "CIS #2"
  },
  {
    code: "g2",
    name: "G2",
    "seed": 7,
    "description": "EU #3"
  },
  {
    code: "evl",
    name: "Evil Genius",
    "seed": 8,
    "description": "NA #3"
  },
  {
    code: "faze",
    name: "FaZe Clan",
    "seed": 9,
    "description": "0L, 3B, #24"
  },
  {
    code: "cope",
    name: "Copenhagen Flames",
    "seed": 10,
    "description": "0L, 1B, #23"
  },
  {
    code: "ence",
    name: "ENCE",
    "seed": 11,
    "description": "1L, 0B, #12"
  },
  {
    code: "ent",
    name: "Entropiq",
    "seed": 12,
    "description": "1L, 0B, #20"
  },
  {
    code: "vp",
    name: "Virtus.pro",
    "seed": 13,
    "description": "1L, -1B, #22"
  },
  {
    code: "hero",
    name: "Heroic",
    "seed": 14,
    "description": "2L, 3B, #15"
  },
  {
    code: "astr",
    name: "Astralis",
    "seed": 15,
    "description": "2L, -1B, #10"
  },
  {
    code: "mouz",
    name: "MOUZ",
    "seed": 16,
    "description": "2L, -3B, #16"
  }
];


export const finalDataChampions = [
  {
    code: "navi",
    name: "Natus Vincere",
    "seed": 1,
    "description": "0L, 4B, #3"
  },
  {
    code: "g2",
    name: "G2",
    "seed": 2,
    "description": "0L, -3B, #7"
  },
  {
    code: "hero",
    name: "Heroic",
    "seed": 3,
    "description": "1L, 1B, #14"
  },
  {
    code: "gamb",
    name: "Gambit",
    "seed": 4,
    "description": "1L, -2B, #6"
  },
  {
    code: "furi",
    name: "FURIA",
    "seed": 5,
    "description": "1L, -7B, #2"
  },
  {
    code: "vp",
    name: "Virtus.pro",
    "seed": 6,
    "description": "2L, 3B, #13"
  },
  {
    code: "nip",
    name: "Ninjas in Pyjamas",
    "seed": 7,
    "description": "2L, 0B, #1"
  },
  {
    code: "vita",
    name: "Vitality",
    "seed": 8,
    "description": "2L, -3B, #4"
  }
]
*/
