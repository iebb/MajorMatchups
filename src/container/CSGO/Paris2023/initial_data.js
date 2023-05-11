// prettier-ignore


const teamLogo = (code) => `https://img.majors.im/go/paris2023/${code}_glitter_large.png`;
const addLogo = x => ({...x, logo: teamLogo(x.code)});

export const initialDataLegends = [
  {
    "code": "navi",
    "name": "Natus Vincere",
    seed: 1,
    description: "EUA #1",
    region: "EU",
  },
  {
    "code": "nein",
    "name": "9INE",
    seed: 2,
    description: "EUB #1",
    region: "EU",
  },
  {
    "code": "furi",
    "name": "FURIA Esports",
    seed: 3,
    description: "AM #1",
    region: "AM",
  },
  {
    "code": "fntc",
    "name": "Fnatic",
    seed: 4,
    description: "EUA #2",
    region: "EU",
  },
  {
    "code": "hero",
    "name": "Heroic",
    seed: 5,
    description: "EUB #2",
    region: "EU",
  },
  {
    "code": "itb",
    "name": "Into The Breach",
    seed: 6,
    description: "EUA #3",
    region: "EU",
  },
  {
    "code": "vita",
    "name": "Team Vitality",
    seed: 7,
    description: "EUB #3",
    region: "EU",
  },
  {
    "code": "bne",
    "name": "Bad News Eagles",
    seed: 8,
    description: "EUA #4",
    region: "EU",
  }
].map(addLogo);

export const initialDataChallenger = [
  {
    "code": "mont",
    "name": "Monte",
    seed: 9,
    description: "EUB #4",
    region: "EU",
  },
  {
    "code": "pain",
    "name": "paiN Gaming",
    seed: 10,
    description: "AM #2",
    region: "AM",
  },
  {
    "code": "g2",
    "name": "G2 Esports",
    "seed": 11,
    description: "EUB #5",
    region: "EU",
  },
  {
    "code": "gl",
    "name": "GamerLegion",
    seed: 12,
    description: "EUA #5",
    region: "EU",
  },
  {
    "code": "forz",
    "name": "forZe eSports",
    seed: 13,
    description: "EUB #6",
    region: "EU",
  },
  {
    "code": "apex",
    "name": "Apeks",
    seed: 14,
    region: "EU",
    description: "EUA #6",
  },
  {
    "code": "nip",
    "name": "Ninjas in Pyjamas",
    seed: 15,
    description: "EUB #7",
    region: "EU",
  },
  {
    "code": "og",
    "name": "OG",
    seed: 16,
    description: "EUA #7",
    region: "EU",
  },
  {
    "code": "ence",
    "name": "ENCE",
    seed: 17,
    description: "EUB #8",
    region: "EU",
  },
  {
    "code": "mouz",
    "name": "MOUZ",
    seed: 18,
    description: "EUA #8",
    region: "EU",
  },
  {
    "code": "liq",
    "name": "Team Liquid",
    seed: 19,
    description: "AM #3",
    region: "AM",
  },
  {
    "code": "gray",
    "name": "Grayhound Gaming",
    seed: 20,
    description: "AP #1",
    region: "AP",
  },
  {
    "code": "cplx",
    "name": "Complexity Gaming",
    seed: 21,
    description: "AM #4",
    region: "AM",
  },
  {
    "code": "mngz",
    "name": "The MongolZ",
    seed: 22,
    description: "AP #2",
    region: "AP",
  },
  {
    "code": "flux",
    "name": "Fluxo",
    seed: 23,
    description: "AM #5",
    region: "AM",
  },
  {
    "code": "faze",
    "name": "FaZe Clan",
    seed: 24,
    description: "EU-TB",
    region: "EU",
  },
].map(addLogo);

export const finalDataLegends = [
  ...initialDataLegends,
].map(addLogo);
export const finalDataChampions = [].map(addLogo);
