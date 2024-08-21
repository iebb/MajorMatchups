/* eslint-disable global-require */

import {GlobeAmericasIcon, GlobeEuropeAfricaIcon} from '@heroicons/react/24/outline';
import React from 'react';
import {fetchPrefix} from "../../../../../libs/common/common";
import {Formats} from "../../../../../libs/common/formats/formats";
import {Regionals} from "../../../../Common/Regional";
import {EUA, EUB, EUTB_Final, NAM, SAM} from './initial_data';
import {Scores} from "./scores";

const Regions = [
  {
    name: "Europe-A",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUA,
    seats: [
      { status: "qualified", until: 8, abbrev: "Q" },
      { status: "eliminated", until: 16, abbrev: "E" },
    ],
    tiebreakers: {},
    rounds: 5,
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "sha24.cq.eua",
    defaultSuffix: "",
  },
  {
    name: "Europe-B",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUB,
    seats: [
      { status: "qualified", until: 8, abbrev: "Q" },
      { status: "eliminated", until: 16, abbrev: "E" },
    ],
    tiebreakers: {},
    rounds: 5,
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "sha24.cq.eub",
    defaultSuffix: "",
  },
  {
    name: "North-Am",
    icon: GlobeAmericasIcon,
    seeds: NAM,
    seats: [
      { status: "qualified", until: 4, abbrev: "Q" },
      { status: "eliminated", until: 16, abbrev: "E" },
    ],
    tiebreakers: {
      "4": [{teams: 4, id: "4/5", name: "4/5th Decider"}],
    },
    rounds: 5,
    winsToAdvance: 3,
    losesToEliminate: 2,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "sha24.cq.nam",
    defaultSuffix: "",
  },
  {
    name: "South-Am",
    icon: GlobeAmericasIcon,
    seeds: SAM,
    seats: [
      { status: "qualified", until: 4, abbrev: "Q" },
      { status: "eliminated", until: 16, abbrev: "E" },
    ],
    tiebreakers: {
      "4": [{teams: 4, id: "4/5", name: "4/5th Decider"}],
    },
    rounds: 5,
    winsToAdvance: 3,
    losesToEliminate: 2,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "sha24.cq.sam",
    defaultSuffix: "",
  },
].map((r, id) => ({...r, id}));

const teamLogo = (code) => `https://img.majors.im/rmr/shanghai2024_qual/${code}.png`;

export default class Shanghai2024Qual extends Regionals {
  defaultTab = 0;
  Regions = Regions;
  teamLogo = teamLogo;
  title = "PW Major Shanghai 2024 RMR Closed Qualifier Simulator";
  // subtitle = <span>
  //   Pick your winners here, and <a href="/24rmr_shanghai" className="text-yellow-400 underline">EU & Americas RMR</a> simulation is now available.
  // </span>;
  _scores = Scores;

  fetch_scores = (callback) => {
    fetch('https://result-api.majors.im/scores.json')
      .then((resp) => resp.json())
      .then(callback);
  };

  fetch_matches = (callback) => {
    fetch('https://result-api.majors.im/matches.json')
      .then((resp) => resp.json())
      .then(callback);
  };
}
