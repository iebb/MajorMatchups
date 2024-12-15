/* eslint-disable global-require */

import {AdvanceElimSeats, ChampionSeats} from "../../../../../libs/common/common";
import {Formats} from "../../../../../libs/common/formats/formats";
import {Major3Stage} from "../../../../Common/Major3Stage";
import {ChallengerResults, LegendResults} from "../../../../CSGO/2022/Rio/Rio2022/scores";
import {
  finalDataChampions,
  finalDataLegends,
  initialDataChallenger,
  initialDataLegends,
} from './initial_data';
import {Scores} from "./scores";

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
    tournamentType: Formats.SwissBuchholtz2024,
    seats: AdvanceElimSeats,
    winsToAdvance: 3,
    losesToEliminate: 3,
    rounds: 5,
    // pickemTags: ["picks_224"],
  },
  {
    id: 1,
    initialTeams: initialDataLegends,
    teams: finalDataLegends,
    name: "Legends",
    tournament: TournamentLegends,
    tournamentType: Formats.SwissBuchholtz2024,
    seats: AdvanceElimSeats,
    winsToAdvance: 3,
    losesToEliminate: 3,
    rounds: 5,
    pickemTags: [],
  },
  {
    id: 2,
    initialTeams: [],
    teams: finalDataChampions,
    name: "Champions",
    tournament: TournamentChampions,
    tournamentType: Formats.Knockout2024,
    seats: ChampionSeats,
    losesToEliminate: 1,
    rounds: 3,
    pickemTags: [],
  },
];

const teamLogo = (code) => `https://img.majors.im/logos/2411_cs2_rmr_shanghai/${code}.png`; // 2412_cs2_shanghai

export default class Shanghai2024Provisional extends Major3Stage {
  TournamentStages = TournamentStages;
  event = "24shanghai";
  title = "PW Major Shanghai 2024 Simulator";
  currentStage = 2;
  _scores = Scores;
  teamLogo = teamLogo;

  // fetch_scores = (callback) => {
  //   fetch('https://result-api.majors.im/scores/2412_cs2_shanghai/merged_scores.json')
  //     .then((resp) => resp.json())
  //     .then(callback);
  // };

  // state = {
  //   ...this.state,
  //   challengerResult: ChallengerResults,
  //   legendResult: LegendResults,
  // }

}
