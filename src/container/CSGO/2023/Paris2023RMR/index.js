/* eslint-disable global-require */

import {GlobeAmericasIcon, GlobeAsiaAustraliaIcon, GlobeEuropeAfricaIcon} from '@heroicons/react/24/outline';
import {Formats} from "../../../../libs/common/formats/formats";
import {Regionals} from "../../../Common/Regional";
import {AME, AP, EUA, EUB, EUTB} from './initial_data';
import {Scores} from "./scores";

const Regions = [
  {
    id: 0,
    name: "Europe-A",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUA,
    seats: [
      { status: "legends", until: 4, abbrev: "L", statusPositioned: true },
      { status: "challengers", until: 6, abbrev: "Ch", statusPositioned: true },
      { status: "contenders", until: 8, abbrev: "Co", statusPositioned: true },
      { status: "decider", until: 11, abbrev: "D", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    rounds: 5,
    buchholtzLockIns: [`3-1`],
    tiebreakers: {
      "4": [{teams: 4, id: "4/5", name: "4/5th Decider"}],
    },
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: 0,
    defaultSuffix: "",
  },
  {
    id: 1,
    name: "Europe-B",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUB,
    seats: [
      { status: "legends", until: 3, abbrev: "L", statusPositioned: true },
      { status: "challengers", until: 7, abbrev: "Ch", statusPositioned: true },
      { status: "contenders", until: 8, abbrev: "Co", statusPositioned: true },
      { status: "decider", until: 11, abbrev: "D", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    buchholtzLockIns: [`3-1`],
    tiebreakers: {
      "4": [{teams: 4, offset: -0.1, id: "4/5", name: "4/5th Decider"}],
      "5": [{teams: 3, offset: 0.1, id: "3/4", name: "3rd/4th Decider"}],
    },
    rounds: 6,
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: 0,
    defaultSuffix: "",
  },
  {
    id: 2,
    name: "Americas",
    icon: GlobeAmericasIcon,
    seeds: AME,
    seats: [
      { status: "legends", until: 1, abbrev: "L", statusPositioned: true },
      { status: "challengers", until: 2, abbrev: "Ch", statusPositioned: true },
      { status: "contenders", until: 5, abbrev: "Co", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {
      "3": [{teams: 1, id: "1/2", offset: 0.1, name: "1st/2nd Decider"}],
    },
    rounds: 4,
    winsToAdvance: 3,
    losesToEliminate: 2,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: 0,
    defaultSuffix: "",
  },
  {
    id: 3,
    name: "Asia-Pacific",
    icon: GlobeAsiaAustraliaIcon,
    seeds: AP,
    seats: [
      { status: "contenders", until: 2, abbrev: "Co", statusPositioned: true },
      { status: "eliminated", until: 8, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {},
    rounds: 5,
    winsToAdvance: 3,
    losesToEliminate: 2,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.DoubleElimination,
    defaultSuffix: "",
  },
  {
    id: 4,
    name: "EU-Decider",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUTB,
    seats: [
      { status: "contenders", until: 1, abbrev: "Co", statusPositioned: true },
      { status: "eliminated", until: 6, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {
      "1": [{teams: 2, id: "2/3", offset: -0.1, name: "3rd Decider"}],
      "2": [{teams: 1, id: "1/2", offset: 0.1, name: "1st/2nd Decider"}],
    },
    rounds: 3,
    winsToAdvance: 1,
    losesToEliminate: 1,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: 0,
    defaultSuffix: "#1",
  },
];

const teamLogo = (code) => {
  return code.indexOf("#") !== -1 ?
    `https://majors.im/images/regions/${code.split("#")[0]}.png?r=2`
    :
    `https://img.majors.im/rmr/paris2023_rmr/${code}.png`;
}

export default class Paris2023RMR extends Regionals {
  defaultTab = 0;
  Regions = Regions;
  event = "par23rmr";

  teamLogo = teamLogo;
  title = "BLAST.tv Paris 2023 RMR Simulator";
  Scores = Scores;

  // fetch_scores = (callback) => {
  //   fetch(fetchPrefix + '/cs_scores')
  //     .then((resp) => resp.json())
  //     .then(callback);
  // };
}
