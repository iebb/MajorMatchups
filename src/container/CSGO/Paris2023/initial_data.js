// prettier-ignore


const teamLogo = (code) => `https://img.majors.im/go/paris2023/${code}_glitter.png`;
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
  {
    "code": "ence",
    "name": "ENCE",
    "seed": 9,
    "description": "3-0/+2/#17",
    "region": "EU",
    "logo": "https://img.majors.im/go/paris2023/ence_glitter.png"
  },
  {
    "code": "g2",
    "name": "G2 Esports",
    "seed": 10,
    "description": "3-0/-2/#11",
    "region": "EU",
    "logo": "https://img.majors.im/go/paris2023/g2_glitter.png"
  },
  {
    "code": "apex",
    "name": "Apeks",
    "seed": 11,
    "description": "3-1/+2/#14",
    "region": "EU",
    "logo": "https://img.majors.im/go/paris2023/apex_glitter.png"
  },
  {
    "code": "faze",
    "name": "FaZe Clan",
    "seed": 12,
    "description": "3-1/+2/#24",
    "region": "EU",
    "logo": "https://img.majors.im/go/paris2023/faze_glitter.png"
  },
  {
    "code": "nip",
    "name": "Ninjas in Pyjamas",
    "seed": 13,
    "description": "3-1/-3/#15",
    "region": "EU",
    "logo": "https://img.majors.im/go/paris2023/nip_glitter.png"
  },
  {
    "code": "mont",
    "name": "Monte",
    "seed": 14,
    "description": "3-2/-5/#9",
    "region": "EU",
    "logo": "https://img.majors.im/go/paris2023/mont_glitter.png"
  },
  {
    "code": "liq",
    "name": "Team Liquid",
    "seed": 15,
    "description": "3-2/-5/#19",
    "region": "AM",
    "logo": "https://img.majors.im/go/paris2023/liq_glitter.png"
  },
  {
    "code": "gl",
    "name": "GamerLegion",
    "seed": 16,
    "description": "3-2/-10/#12",
    "region": "EU",
    "logo": "https://img.majors.im/go/paris2023/gl_glitter.png"
  }
].map(addLogo);
export const finalDataChampions = [
  {
    "code": "hero",
    "name": "Heroic",
    "seed": 1,
    "region": "EU",
    "description": "0L, 4B, #5"
  },
  {
    "code": "vita",
    "name": "Team Vitality",
    "seed": 2,
    "region": "EU",
    "description": "0L, -2B, #7"
  },
  {
    "code": "liq",
    "name": "Team Liquid",
    "seed": 3,
    "region": "AM",
    "description": "1L, 0B, #15"
  },
  {
    "code": "mont",
    "name": "Monte",
    "seed": 4,
    "region": "EU",
    "description": "1L, -2B, #14"
  },
  {
    "code": "gl",
    "name": "GamerLegion",
    "seed": 5,
    "region": "EU",
    "description": "1L, -4B, #16"
  },
  {
    "code": "apex",
    "name": "Apeks",
    "seed": 6,
    "region": "EU",
    "description": "2L, 3B, #11"
  },
  {
    "code": "itb",
    "name": "Into The Breach",
    "seed": 7,
    "region": "EU",
    "description": "2L, 1B, #6"
  },
  {
    "code": "faze",
    "name": "FaZe Clan",
    "seed": 8,
    "region": "EU",
    "description": "2L, -2B, #12"
  }
].map(addLogo);
