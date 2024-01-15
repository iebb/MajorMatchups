/* eslint-disable global-require */

import {AdvanceElimSeats, ChampionSeats} from '../../../../libs/common/common';
import {Formats} from "../../../../libs/common/formats/formats";
import {Major3Stage} from "../../../Common/Major3Stage";
import {finalDataChampions, finalDataLegends, initialDataChallenger, initialDataLegends} from './initial_data';
import {Scores} from './scores';

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
    losesToEliminate: 1,
    rounds: 3,
  },
];

export default class Stockholm2021 extends Major3Stage {
  TournamentStages = TournamentStages;
  event = "21stockholm";
  title = "PGL Stockholm Major 2021 Simulator";
  extras = [
    {
      title: "seeding rules",
      link: "https://press.pglesports.com/161255-the-buchholtz-system-will-replace-the-tie-breaker-system-during-the-challengers-and-legends-stages"
    }
  ];
  currentStage = 2;
  _scores = Scores;
  nextMajorSlot = false;
}
