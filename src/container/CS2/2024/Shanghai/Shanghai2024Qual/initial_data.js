// prettier-ignore

import {RegionalRankings_2023_12_AM, RegionalRankings_2023_12_EU} from "./regional_rankings";

export const EUA = require("./data/eua.json").map(team => ({...team, valveRanking: RegionalRankings_2023_12_EU[team.code]}));
export const EUB = require("./data/eub.json").map(team => ({...team, valveRanking: RegionalRankings_2023_12_EU[team.code]}));
export const NAM = require("./data/nam.json").map(team => ({...team, valveRanking: RegionalRankings_2023_12_AM[team.code]}));
export const SAM = require("./data/sam.json").map(team => ({...team, valveRanking: RegionalRankings_2023_12_AM[team.code]}));

