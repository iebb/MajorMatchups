/* eslint-disable global-require */

import React from 'react';
import { AdvanceElimSeats, ChampionSeats } from '../../../libs/common/common';
import {Formats} from "../../../libs/common/formats/formats";
import { Major3Stage } from '../../Common/Major3Stage';
import { finalDataChampions, finalDataLegends, initialDataChallenger, initialDataLegends } from './initial_data';
import { Scores } from './scores';


const TournamentStages = [
  {
    id: 0,
    initialTeams: initialDataChallenger,
    teams: initialDataChallenger,
    name: "Challengers",
    tournament: 0,
    tournamentType: 0,
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
    tournament: 1,
    tournamentType: 0,
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
    tournament: 2,
    tournamentType: Formats.Knockout,
    seats: ChampionSeats,
    winsToAdvance: 3,
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
