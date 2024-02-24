// prettier-ignore

import {RegionalRankings_2023_12_AM, RegionalRankings_2023_12_EU} from "./regional_rankings";

export const EUA = require("./data/eua.json").map(team => ({...team, valveRanking: RegionalRankings_2023_12_EU[team.code]}));
export const EUB = require("./data/eub.json").map(team => ({...team, valveRanking: RegionalRankings_2023_12_EU[team.code]}));
export const AM = require("./data/am.json").map(team => ({...team, valveRanking: RegionalRankings_2023_12_AM[team.code]}));

export const EUTB_Final = [
  {
    "code": "fnat",
    "logo": "https://img.majors.im/rmr/copenhagen2024_rmr/fnat.png",
    "name": "Fnatic",
    "seed": 1,
    "valveRanking": 1036,
    "buchholtz_offset": 6,
    "buchholtz": 6
  },
  {
    "code": "guil",
    "logo": "https://img.majors.im/rmr/copenhagen2024_rmr/guil.png",
    "name": "Guild Eagles",
    "seed": 2,
    "valveRanking": 23,
    "buchholtz_offset": 0,
    "buchholtz": 0
  },
  {
    "code": "9pan",
    "logo": "https://img.majors.im/rmr/copenhagen2024_rmr/9pan.png",
    "name": "9Pandas",
    "seed": 3,
    "valveRanking": 21,
    "buchholtz_offset": 4,
    "buchholtz": 4
  },
  {
    "code": "astr",
    "logo": "https://img.majors.im/rmr/copenhagen2024_rmr/astr.png",
    "name": "Astralis",
    "seed": 4,
    "valveRanking": 15,
    "buchholtz_offset": -1,
    "buchholtz": -1
  },
  {
    "code": "betb",
    "logo": "https://img.majors.im/rmr/copenhagen2024_rmr/betb.png",
    "name": "BetBoom Team",
    "seed": 5,
    "valveRanking": 16,
    "buchholtz_offset": -3,
    "buchholtz": -3
  },
  {
    "code": "gl",
    "logo": "https://img.majors.im/rmr/copenhagen2024_rmr/gl.png",
    "name": "GamerLegion",
    "seed": 6,
    "valveRanking": 19,
    "buchholtz_offset": -1,
    "buchholtz": -1
  }
];

