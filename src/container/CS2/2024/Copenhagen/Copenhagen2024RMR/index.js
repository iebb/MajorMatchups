/* eslint-disable global-require */

import {GlobeAmericasIcon, GlobeEuropeAfricaIcon} from '@heroicons/react/24/outline';
import {fetchPrefix} from "../../../../../libs/common/common";
import {Formats} from "../../../../../libs/common/formats/formats";
import {Regionals} from "../../../../Common/Regional";
import {AM, EUA, EUB, EUTB_Final} from './initial_data';
import {Scores} from "./scores";

const Regions = [
  {
    name: "Americas",
    icon: GlobeAmericasIcon,
    seeds: AM,
    seats: [
      { status: "qualified", until: 5, abbrev: "Q", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {
      "3": [{teams: 1, id: "1/2", name: "Legends Decider"}],
    },
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
      { status: "qualified", until: 8, abbrev: "Q", statusPositioned: true },
      { status: "decider", until: 11, abbrev: "D", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
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
      { status: "qualified", until: 8, abbrev: "Q", statusPositioned: true },
      { status: "decider", until: 11, abbrev: "D", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
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
      { status: "qualified", until: 1, abbrev: "Q", statusPositioned: true },
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
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "cph24.rmr.eucq",
    defaultSuffix: "#",
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
