/* eslint-disable global-require */

import {GlobeAmericasIcon, GlobeAsiaAustraliaIcon, GlobeEuropeAfricaIcon} from '@heroicons/react/24/outline';
import {fetchPrefix} from "../../../../../libs/common/common";
import {Formats} from "../../../../../libs/common/formats/formats";
import {Regionals} from "../../../../Common/Regional";
import {AP, AM, EUA, EUB, EUTB_Final} from './initial_data';
import {Scores} from "./scores";

const Regions = [
  {
    name: "Americas",
    icon: GlobeAmericasIcon,
    seeds: AM,
    seats: [
      { status: "qualified", until: 7, abbrev: "Q", border: "border-green-500" },
      { status: "eliminated", until: 16, abbrev: "E", border: "border-red-500" },
    ],
    tiebreakers: {
      "5": [{teams: 7, id: "7/8", name: "7/8th Decider"}],
    },
    rounds: 6,
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "",
    defaultSuffix: "",
  },
  {
    name: "Europe-A",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUA,
    seats: [
      { status: "qualified", until: 7, abbrev: "Q", border: "border-green-500" },
      { status: "eliminated", until: 16, abbrev: "E", border: "border-red-500" },
    ],
    tiebreakers: {
      "5": [{teams: 7, id: "7/8", name: "7/8th Decider"}],
    },
    rounds: 6,
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "sha24.rmr.eua",
    defaultSuffix: "",
  },
  {
    name: "Europe-B",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUB,
    seats: [
      { status: "qualified", until: 7, abbrev: "Q", border: "border-green-500" },
      { status: "eliminated", until: 16, abbrev: "E", border: "border-red-500" },
    ],
    tiebreakers: {
      "5": [{teams: 7, id: "7/8", name: "7/8th Decider"}],
    },
    rounds: 6,
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "sha24.rmr.eub",
    defaultSuffix: "",
  },
  {
    name: "Asia-Pacific",
    icon: GlobeAsiaAustraliaIcon,
    seeds: AP,
    seats: [
      { status: "qualified", until: 3, abbrev: "Q", border: "border-green-500" },
      { status: "eliminated", until: 8, abbrev: "E", border: "border-red-500" },
    ],
    tiebreakers: {
    },
    rounds: 4,
    winsToAdvance: 3,
    losesToEliminate: 2,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.DoubleElimination2024,
    resultTag: "sha24.rmr.ap",
    defaultSuffix: "",
  },
].map((r, id) => ({...r, id}));

const teamLogo = (code) => `https://img.majors.im/rmr/shanghai2024_rmr/${code}.png`;

export default class Shanghai2024RMR extends Regionals {
  defaultTab = 0;
  Regions = Regions;
  teamLogo = teamLogo;
  title = "PW Major Shanghai 2024 RMR Simulator";
  _scores = Scores;

  // fetch_scores = (callback) => {
  //   fetch(fetchPrefix + '/cs_scores')
  //     .then((resp) => resp.json())
  //     .then(callback);
  // };
}
