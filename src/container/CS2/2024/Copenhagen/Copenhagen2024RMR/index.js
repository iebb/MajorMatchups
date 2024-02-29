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
      { status: "qualified", until: 5, abbrev: "Q", border: "border-green-500" },
      { status: "eliminated", until: 16, abbrev: "E", border: "border-red-500" },
    ],
    rounds: 4,
    winsToAdvance: 3,
    losesToEliminate: 2,
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
      { status: "qualified", until: 8, abbrev: "Q", border: "border-green-500" },
      { status: "decider", until: 11, abbrev: "D", border: "border-yellow-500" },
      { status: "eliminated", until: 16, abbrev: "E", border: "border-red-500" },
    ],
    tiebreakers: {},
    rounds: 5,
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "cph24.rmr.eua",
    defaultSuffix: "",
  },
  {
    name: "Europe-B",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUB,
    seats: [
      { status: "qualified", until: 8, abbrev: "Q", border: "border-green-500" },
      { status: "decider", until: 11, abbrev: "D", border: "border-yellow-500" },
      { status: "eliminated", until: 16, abbrev: "E", border: "border-red-500" },
    ],
    tiebreakers: {},
    rounds: 5,
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "cph24.rmr.eub",
    defaultSuffix: "",
  },
  {
    name: "EU-Decider",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUTB_Final,
    seats: [
      { status: "qualified", until: 1, abbrev: "Q", border: "border-green-500" },
      { status: "eliminated", until: 6, abbrev: "E", border: "border-red-500" },
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
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "cph24.rmr.eucq",
    defaultSuffix: "#",
  },
  {
    name: "Asia-Pacific",
    icon: GlobeAsiaAustraliaIcon,
    seeds: AP,
    seats: [
      { status: "qualified", until: 2, abbrev: "Q", border: "border-green-500" },
      { status: "eliminated", until: 8, abbrev: "E", border: "border-red-500" },
    ],
    tiebreakers: {},
    rounds: 5,
    winsToAdvance: 3,
    losesToEliminate: 2,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.DoubleElimination2024,
    resultTag: "cph24.rmr.ap",
    defaultSuffix: "",
  },
].map((r, id) => ({...r, id}));

const teamLogo = (code) => `https://img.majors.im/rmr/copenhagen2024_rmr/${code}.png`;

export default class Copenhagen2024RMR extends Regionals {
  defaultTab = 2;
  Regions = Regions;
  teamLogo = teamLogo;
  title = "PGL Major Copenhagen 2024 RMR Simulator";
  _scores = Scores;

  fetch_scores = (callback) => {
    fetch(fetchPrefix + '/cs_scores')
      .then((resp) => resp.json())
      .then(callback);
  };
}
