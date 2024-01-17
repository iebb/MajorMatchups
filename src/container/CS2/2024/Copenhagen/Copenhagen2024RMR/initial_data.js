// prettier-ignore

import {RegionalRankings_2023_12_AM, RegionalRankings_2023_12_EU} from "../Copenhagen2024Qual/regional_rankings";

export const EUA = require("./data/provisional_eua.json");
export const EUB = require("./data/provisional_eub.json");
export const AM = require("./data/provisional_am.json");
export const AP = require("./data/provisional_ap.json");

export const EUTB = [
  {
    "code": "decider/seed_9a",
    "name": "EUA #9",
    "seed": 1,
    "description": "EUA #9",
    "buchholtz": 0,
    "buchholtz_offset": 0,
  },
  {
    "code": "decider/seed_9b",
    "name": "EUB #9",
    "seed": 2,
    "description": "EUB #9",
    "buchholtz": 0,
    "buchholtz_offset": 0,
  },
  {
    "code": "decider/seed_10a",
    "name": "EUA #10",
    "seed": 3,
    "description": "EUA #10",
    "buchholtz": 0,
    "buchholtz_offset": 0,
  },
  {
    "code": "decider/seed_10b",
    "name": "EUB #10",
    "seed": 4,
    "description": "EUB #10",
    "buchholtz": 0,
    "buchholtz_offset": 0,
  },
  {
    "code": "decider/seed_11a",
    "name": "EUB #11",
    "seed": 5,
    "description": "EUA #11",
    "buchholtz": 0,
    "buchholtz_offset": 0,
  },
  {
    "code": "decider/seed_11b",
    "name": "EUB #11",
    "seed": 6,
    "description": "EUB #11",
    "buchholtz": 0,
    "buchholtz_offset": 0,
  }
];

//  Team Vitality, GamerLegion, Apeks, , Monte, Into The Breach, , , , , and ENCE;
export const PrequalifiedTeamsEU = [
  {
    "code": "vita",
    "name": "Team Vitality",
  },
  {
    "code": "gl",
    "name": "GamerLegion",
  },
  {
    "code": "apek",
    "name": "Apeks",
  },
  {
    "code": "faze",
    "name": "FaZe Clan",
  },
  {
    "code": "mont",
    "name": "Monte",
  },
  {
    "code": "itb",
    "name": "Into The Breach",
  },
  {
    "code": "nip",
    "name": "Ninjas in Pyjamas",
  },
  {
    "code": "falc", // ence seat
    "name": "Team Falcons (ex-ENCE)",
  },
  {
    "code": "guil",
    "name": "Guild Eagles (ex-BNE)",
  },
  {
    "code": "g2",
    "name": "G2 Esports",
  },
  {
    "code": "ence", // 9ine seat
    "name": "ENCE (ex-9INE)",
  },
].map(team => ({
  ...team,
  logo: `https://img.majors.im/rmr/copenhagen2024_qual/${team.code}.png`,
  valveRanking: RegionalRankings_2023_12_EU[team.code]
}));

export const PrequalifiedTeamsAM = [
  {
    "code": "furi",
    "name": "Furia",
  },
].map(team => ({
  ...team,
  logo: `https://img.majors.im/rmr/copenhagen2024_qual/${team.code}.png`,
  valveRanking: RegionalRankings_2023_12_AM[team.code]
}));
