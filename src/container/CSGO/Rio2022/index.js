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
    pickemTags: ["picks_215"],
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
    pickemTags: ["picks_216"],
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

export default class Rio2022 extends Major3Stage {
  TournamentStages = TournamentStages;
  event = "22rio";
  title = "IEM Rio Major 2022 Simulator";
  currentStage = 2;
  _scores = Scores;

  loadScores = async () => {
    this._scores = Scores;
    this.recalculate(true);
    // return Scores;

    // fetch('https://result-api.majors.im/event_20.json')
    //   .then((resp) => resp.json())
    //   .then((resp) => {
    //     this._scores = {
    //       0: resp[1],
    //       1: resp[2],
    //       2: resp[3],
    //     };
    //     this.setState({scores: this._scores[this.state.tournament]}, () => {
    //       this.calculateMatchups(0, this.state.rounds + 1)
    //     });
    //   });
  }
}
