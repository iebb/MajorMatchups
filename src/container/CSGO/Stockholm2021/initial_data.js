// prettier-ignore

const teamLogo = (code) => `https://img.majors.im/go/stockh2021/${code}.png`;
const addLogo = x => ({...x, logo: teamLogo(x.code)})


export const initialDataChallenger = [
  {
    code: "spir",
    name: "Team Spirit",
    seed: 9,
    description: "CIS #3",
  },
  {
    code: "astr",
    name: "Astralis",
    seed: 10,
    description: "EU #4",
  },
  {
    code: "pain",
    name: "paiN Gaming",
    seed: 11,
    description: "NA #4",
  },
  {
    code: "ence",
    name: "ENCE",
    seed: 12,
    description: "EU #5",
  },
  {
    code: "big",
    name: "BIG",
    seed: 13,
    description: "EU #6",
  },
  {
    code: "ride",
    name: "Movistar Riders",
    seed: 14,
    description: "EU #7",
  },
  {
    code: "hero",
    name: "Heroic",
    seed: 15,
    description: "EU #8",
  },
  {
    code: "mouz",
    name: "MOUZ",
    seed: 16,
    description: "EU #9",
  },
  {
    code: "shrk",
    name: "Sharks",
    seed: 17,
    description: "SA #1",
  },
  {
    code: "tyl",
    name: "TYLOO",
    seed: 18,
    description: "AS #1",
  },
  {
    code: "ren",
    name: "Renegades",
    seed: 19,
    description: "OC #1",
  },
  {
    code: "ent",
    name: "Entropiq",
    seed: 20,
    description: "CIS #4",
  },
  {
    code: "god",
    name: "Godsent",
    seed: 21,
    description: "NA #5",
  },
  {
    code: "vp",
    name: "Virtus.pro",
    seed: 22,
    description: "CIS #6",
  },
  {
    code: "cope",
    name: "Copenhagen Flames",
    seed: 23,
    description: "EU #10",
  },
  {
    code: "faze",
    name: "FaZe Clan",
    seed: 24,
    description: "EU #11",
  }
].map(addLogo);


export const initialDataLegends = [
  {
    code: "nip",
    name: "Ninjas in Pyjamas",
    seed: 1,
    description: "EU #1",
  },
  {
    code: "furi",
    name: "FURIA",
    seed: 2,
    description: "NA #1",
  },
  {
    code: "navi",
    name: "Natus Vincere",
    seed: 3,
    description: "CIS #1",
  },
  {
    code: "vita",
    name: "Vitality",
    seed: 4,
    description: "EU #2",
  },
  {
    code: "liq",
    name: "Liquid",
    seed: 5,
    description: "NA #2"
  },
  {
    code: "gamb",
    name: "Gambit",
    seed: 6,
    description: "CIS #2",
  },
  {
    code: "g2",
    name: "G2",
    seed: 7,
    description: "EU #3",
  },
  {
    code: "evl",
    name: "Evil Genius",
    seed: 8,
    description: "NA #3",
  }
].map(addLogo);

export const finalDataLegends = [
  {
    "code": "nip",
    "name": "Ninjas in Pyjamas",
    "seed": 1,
    "description": "EU #1"
  },
  {
    "code": "furi",
    "name": "FURIA",
    "seed": 2,
    "description": "NA #1"
  },
  {
    "code": "navi",
    "name": "Natus Vincere",
    "seed": 3,
    "description": "CIS #1"
  },
  {
    "code": "vita",
    "name": "Vitality",
    "seed": 4,
    "description": "EU #2"
  },
  {
    "code": "liq",
    "name": "Liquid",
    "seed": 5,
    "description": "NA #2"
  },
  {
    "code": "gamb",
    "name": "Gambit",
    "seed": 6,
    "description": "CIS #2"
  },
  {
    "code": "g2",
    "name": "G2",
    "seed": 7,
    "description": "EU #3"
  },
  {
    "code": "evl",
    "name": "Evil Genius",
    "seed": 8,
    "description": "NA #3"
  },
  {
    "code": "faze",
    "name": "FaZe Clan",
    "seed": 9,
    "description": "0L, 3B, #24"
  },
  {
    "code": "cope",
    "name": "Copenhagen Flames",
    "seed": 10,
    "description": "0L, 1B, #23"
  },
  {
    "code": "ence",
    "name": "ENCE",
    "seed": 11,
    "description": "1L, 0B, #12"
  },
  {
    "code": "ent",
    "name": "Entropiq",
    "seed": 12,
    "description": "1L, 0B, #20"
  },
  {
    "code": "vp",
    "name": "Virtus.pro",
    "seed": 13,
    "description": "1L, -1B, #22"
  },
  {
    "code": "hero",
    "name": "Heroic",
    "seed": 14,
    "description": "2L, 3B, #15"
  },
  {
    "code": "astr",
    "name": "Astralis",
    "seed": 15,
    "description": "2L, -1B, #10"
  },
  {
    "code": "mouz",
    "name": "MOUZ",
    "seed": 16,
    "description": "2L, -3B, #16"
  }
].map(addLogo);


export const finalDataChampions = [
  {
    "code": "navi",
    "name": "Natus Vincere",
    "seed": 1,
    "description": "0L, 4B, #3"
  },
  {
    "code": "g2",
    "name": "G2",
    "seed": 2,
    "description": "0L, -3B, #7"
  },
  {
    "code": "hero",
    "name": "Heroic",
    "seed": 3,
    "description": "1L, 1B, #14"
  },
  {
    "code": "gamb",
    "name": "Gambit",
    "seed": 4,
    "description": "1L, -2B, #6"
  },
  {
    "code": "furi",
    "name": "FURIA",
    "seed": 5,
    "description": "1L, -7B, #2"
  },
  {
    "code": "vp",
    "name": "Virtus.pro",
    "seed": 6,
    "description": "2L, 3B, #13"
  },
  {
    "code": "nip",
    "name": "Ninjas in Pyjamas",
    "seed": 7,
    "description": "2L, 0B, #1"
  },
  {
    "code": "vita",
    "name": "Vitality",
    "seed": 8,
    "description": "2L, -3B, #4"
  }
].map(addLogo);
