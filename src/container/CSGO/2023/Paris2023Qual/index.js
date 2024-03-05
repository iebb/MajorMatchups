/* eslint-disable global-require */

import React from 'react';
import {Regionals} from "../../../Common/Regional";
import { EUA, EUB, EUTB, NAM, SAM } from './initial_data';
import { Scores } from './scores';
import { SwissBuchholtzTB } from '../../../../libs/common/formats/SwissBuchholtzTB';
import { pack, setWinner, shuffle } from '../../../../libs/common/common';
import { BasicUI } from '../../../../components/BasicUI';
import Title from '../../../../components/BannerInsertion';
import { GlobeAmericasIcon, GlobeEuropeAfricaIcon } from '@heroicons/react/24/outline';

const Regions = [
  {
    id: 0,
    name: "Europe-A",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUA,
    seats: [
      { status: "rmr-b", until: 4, abbrev: "1" },
      { status: "rmr-a", until: 8, abbrev: "2" },
      { status: "decider", until: 11, abbrev: "D" },
      { status: "eliminated", until: 16, abbrev: "E" },
    ],
    tiebreakers: {},
    rounds: 5,
    winsToAdvance: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: 0,
  },
  {
    id: 1,
    name: "Europe-B",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUB,
    seats: [
      { status: "rmr-a", until: 4, abbrev: "1" },
      { status: "rmr-b", until: 8, abbrev: "2" },
      { status: "decider", until: 11, abbrev: "D" },
      { status: "eliminated", until: 16, abbrev: "E" },
    ],
    tiebreakers: {},
    rounds: 5,
    winsToAdvance: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: 0,
  },
  {
    id: 2,
    name: "EU-Decider",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUTB,
    seats: [
      { status: "rmr-b", until: 1, abbrev: "R" },
      { status: "rmr-a", until: 2, abbrev: "R" },
      { status: "eliminated", until: 6, abbrev: "E" },
    ],
    tiebreakers: {
      "1": [{teams: 2, id: "2/3", offset: -0.1, name: "3rd Decider"}],
    },
    rounds: 2,
    winsToAdvance: 1,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: 0,
  },
  {
    id: 3,
    name: "North-Am",
    icon: GlobeAmericasIcon,
    seeds: NAM,
    seats: [
      { status: "advance", until: 7, abbrev: "R" },
      { status: "eliminated", until: 16, abbrev: "E" },
    ],
    tiebreakers: {
      "5": [{teams: 7, id: "7/8", name: "7/8th Decider"}],
    },
    rounds: 6,
    winsToAdvance: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: 0,
  },
  {
    id: 4,
    name: "South-Am",
    icon: GlobeAmericasIcon,
    seeds: SAM,
    seats: [
      { status: "advance", until: 7, abbrev: "R" },
      { status: "eliminated", until: 16, abbrev: "E" },
    ],
    tiebreakers: {
      "5": [{teams: 7, id: "7/8", name: "7/8th Decider"}],
    },
    rounds: 6,
    winsToAdvance: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: 0,
  },
];

const teamLogo = (code) => `https://img.majors.im/rmr/paris2023_qual/${code}.png`;

export default class Paris2023Qual extends Regionals {
  defaultTab = 0;
  Regions = Regions;
  event = "par23qual";

  teamLogo = teamLogo;
  title= "BLAST.tv Paris 2023 RMR Closed Qualifier Simulator"
  Scores = Scores;

  // fetch_scores = (callback) => {
  //   fetch(fetchPrefix + '/cs_scores')
  //     .then((resp) => resp.json())
  //     .then(callback);
  // };
}
