/* eslint-disable global-require */

import { GlobeEuropeAfricaIcon } from '@heroicons/react/24/outline';
import { Formats } from '../../../../../libs/common/formats/formats';
import { Regionals } from '../../../../Common/Regional';
import { EU } from './initial_data';
import { Scores } from './scores';

const Regions = [
  {
    name: "Europe",
    icon: GlobeEuropeAfricaIcon,
    seeds: EU,
    seats: [
      { status: "major-stage", until: 6, abbrev: "Q", border: "border-green-500" },
      { status: "eliminated", until: 16, abbrev: "E", border: "border-red-500" },
    ],
    tiebreakers: {
      "5": [{teams: 7, offset: -0.1, id: "7/8", name: "Elimination Decider"}],
      "6": [{teams: 6, offset: 0.1, id: "6/7", name: "Final Playoff"}],
    },
    rounds: 7,
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "aut25.mrq.eu",
    defaultSuffix: "",
  },
].map((r, id) => ({...r, id}));

const teamLogo = (code) => `https://img.majors.im/logos/2504_cs2_austin_mrq/${code}.png`;

export default class Austin2025MRQ extends Regionals {
  defaultTab = 0;
  Regions = Regions;
  teamLogo = teamLogo;
  title = "BLAST.tv Austin Major 2025 Qualifier Simulator";
  _scores = Scores;

  fetch_scores = (callback) => {
    fetch('https://result-api.majors.im/scores/2504_cs2_austin_mrq/scores.json')
      .then((resp) => resp.json())
      .then((e) => {
        console.log(e);
        callback(e);
      });
  };
}
