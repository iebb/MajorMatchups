/* eslint-disable global-require */

import { AdvanceElimSeats, ChampionSeats } from '../../../../../libs/common/common';
import { Formats } from '../../../../../libs/common/formats/formats';
import {
  finalDataStage2,
  finalDataStage3,
  initialDataStage1,
  initialDataStage2,
  initialDataStage3,
} from './initial_data';
import { Scores } from './scores';
import { Major4Stage } from '../../../../Common/Major4Stage';

const TournamentStage1 = 0;
const TournamentStage2 = 1;
const TournamentStage3 = 2;
const TournamentChampions = 3;


const TournamentStages = [
  {
    id: 0,
    initialTeams: initialDataStage1,
    teams: initialDataStage1,
    name: "Stage 1",
    tournament: TournamentStage1,
    tournamentType: Formats.SwissBuchholtzBlast25,
    seats: AdvanceElimSeats,
    winsToAdvance: 3,
    losesToEliminate: 3,
    rounds: 5,
    // pickemTags: ["picks_224"],
  },
  {
    id: 1,
    initialTeams: initialDataStage2,
    teams: finalDataStage2,
    name: "Stage 2",
    tournament: TournamentStage2,
    tournamentType: Formats.SwissBuchholtzBlast25,
    seats: AdvanceElimSeats,
    winsToAdvance: 3,
    losesToEliminate: 3,
    rounds: 5,
    pickemTags: [],
  },
  {
    id: 2,
    initialTeams: initialDataStage3,
    teams: finalDataStage3,
    name: "Stage 3",
    tournament: TournamentStage3,
    tournamentType: Formats.SwissBuchholtzBlast25,
    seats: AdvanceElimSeats,
    winsToAdvance: 3,
    losesToEliminate: 3,
    rounds: 5,
    pickemTags: [],
  },
  {
    id: 3,
    initialTeams: [],
    teams: [], // finalDataStage4,
    name: "Champions",
    tournament: TournamentChampions,
    tournamentType: Formats.Knockout2024,
    seats: ChampionSeats,
    losesToEliminate: 1,
    rounds: 3,
    pickemTags: [],
  },
];

const teamLogo = (code) => `https://img.majors.im/logos/2504_cs2_austin/${code}.png`; // 2412_cs2_shanghai

export default class Austin2025Provisional extends Major4Stage {
  TournamentStages = TournamentStages;
  event = "25austin";
  title = "BLAST.tv Austin Major 2025 Simulator";
  currentStage = 2;
  _scores = Scores;
  teamLogo = teamLogo;

  fetch_scores = (callback) => {
    fetch('https://result-api.majors.im/scores/2504_cs2_austin/merged_scores.json')
      .then((resp) => resp.json())
      .then(callback);
  };

  // state = {
  //   ...this.state,
  //   Stage1Result: Stage1Results,
  //   legendResult: LegendResults,
  // }

}
