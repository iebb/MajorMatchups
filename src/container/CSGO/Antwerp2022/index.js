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
    tournamentFormat: "SWISS_BUCHHOLTZ",
    seats: AdvanceElimSeats,
    winsToAdvance: 3,
    losesToEliminate: 3,
    rounds: 5,
    pickemTags: ["picks_206"],
  },
  {
    id: 1,
    initialTeams: initialDataLegends,
    teams: finalDataLegends,
    name: "Legends",
    tournament: TournamentLegends,
    tournamentType: 0,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    advanceMode: 1,
    seats: AdvanceElimSeats,
    winsToAdvance: 3,
    losesToEliminate: 3,
    rounds: 5,
    pickemTags: ["picks_207"],
  },
  {
    id: 2,
    initialTeams: [],
    teams: finalDataChampions,
    name: "Champions",
    tournament: TournamentChampions,
    tournamentType: 2,
    tournamentFormat: "KNOCKOUT",
    advanceMode: 2,
    seats: ChampionSeats,
    losesToEliminate: 1,
    rounds: 3,
  },
];

export default class Antwerp2022 extends Major3Stage {
  TournamentStages = TournamentStages;
  event = "22antwerp";
  title = "PGL Antwerp Major 2022 Simulator";
  currentStage = 2;
  _scores = Scores;
}
