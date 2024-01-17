// prettier-ignore

import {RegionalRankings_2023_12_AM, RegionalRankings_2023_12_EU} from "./regional_rankings";

export const EUA = require("./data/eua.json").map(team => ({...team, valveRanking: RegionalRankings_2023_12_EU[team.code]}));
export const EUB = require("./data/eub.json").map(team => ({...team, valveRanking: RegionalRankings_2023_12_EU[team.code]}));
export const NAM = require("./data/nam.json").map(team => ({...team, valveRanking: RegionalRankings_2023_12_AM[team.code]}));
export const SAM = require("./data/sam.json").map(team => ({...team, valveRanking: RegionalRankings_2023_12_AM[team.code]}));

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

