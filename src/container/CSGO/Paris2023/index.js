/* eslint-disable global-require */
import React from 'react';
import {AdvanceElimSeats, ChampionSeats} from '../../../libs/common/common';
import {Major3Stage} from "../../Common/Major3Stage";
import {finalDataChampions, finalDataLegends, initialDataChallenger, initialDataLegends} from './initial_data';
import {Scores} from './scores';

const TournamentChallenger = 0;
const TournamentLegends = 1;
const TournamentChampions = 2;


const TournamentStages = [
  {
    id: 0,
    initialTeams: initialDataChallenger,
    teams: initialDataChallenger,
    name: "Challengers",
    tournament: TournamentChallenger,
    tournamentType: 0,
    seats: AdvanceElimSeats,
    winsToAdvance: 3,
    losesToEliminate: 3,
    rounds: 5,
    pickemTags: ["picks_224"],
  },
  {
    id: 1,
    initialTeams: initialDataLegends,
    teams: finalDataLegends,
    name: "Legends",
    tournament: TournamentLegends,
    tournamentType: 0,
    seats: AdvanceElimSeats,
    winsToAdvance: 3,
    losesToEliminate: 3,
    rounds: 5,
    pickemTags: ["picks_225"],
  },
  {
    id: 2,
    initialTeams: [],
    teams: finalDataChampions,
    name: "Champions",
    tournament: TournamentChampions,
    tournamentType: 2,
    tournamentFormat: "KNOCKOUT",

    seats: ChampionSeats,
    losesToEliminate: 1,
    rounds: 3,
  },
];

export default class Paris2023 extends Major3Stage {
  TournamentStages = TournamentStages;
  event = "23paris";
  title = "BLAST.tv Paris 2023 Major Simulator";
  currentStage = 1;
  _scores = Scores;

  loadScores = async () => {
    const resp = await (await fetch('https://majors.im/major_scores_21')).json();
    this._scores = {
      0: resp[1],
      1: resp[2],
      2: resp[3],
    };
    this.recalculate(true);
  }
}
