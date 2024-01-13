/* eslint-disable global-require */

import React from 'react';
import {AdvanceElimSeats, ChampionSeats} from '../../../libs/common/common';
import {Formats} from "../../../libs/common/formats/formats";
import {Major3Stage} from "../../Common/Major3Stage";
import {finalDataChampions, finalDataLegends, initialDataChallenger, initialDataLegends} from './initial_data';
import { ChallengerResults, LegendResults, Scores } from './scores';

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
    pickemTags: ["picks_215"],
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
    pickemTags: ["picks_216"],
  },
  {
    id: 2,
    initialTeams: [],
    teams: finalDataChampions,
    name: "Champions",
    tournament: TournamentChampions,
    tournamentType: Formats.Knockout,
    seats: ChampionSeats,
    losesToEliminate: 1,
    rounds: 3,
  },
];

export default class Rio2022 extends Major3Stage {
  TournamentStages = TournamentStages;
  event = "22rio";
  title = "IEM Rio Major 2022 Simulator";
  currentStage = 2;
  _scores = Scores;

  state = {
    ...this.state,
    challengerResult: ChallengerResults,
    legendResult: LegendResults,
  }

  // loadScores = async () => {
  //   this._scores = Scores;
  //   this.recalculate(true);
  // }
}
