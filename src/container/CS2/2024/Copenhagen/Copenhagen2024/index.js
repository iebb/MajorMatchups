/* eslint-disable global-require */

import {AdvanceElimSeats, ChampionSeats, fetchPrefix} from "../../../../../libs/common/common";
import {Formats} from "../../../../../libs/common/formats/formats";
import {Major3Stage} from "../../../../Common/Major3Stage";
import {finalDataChampions, finalDataLegends, initialDataChallenger, initialDataLegends} from "./initial_data";
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
    pickemTags: ["picks_233"],
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
    pickemTags: ["picks_234"],
  },
  {
    id: 2,
    initialTeams: [],
    teams: finalDataChampions,
    name: "Champions",
    tournament: TournamentChampions,
    tournamentType: Formats.Knockout2024,
    seats: ChampionSeats,
    winsToAdvance: 3,
    losesToEliminate: 1,
    rounds: 3,
    pickemTags: [],
  },
];

const teamLogo = (code) => `https://img.majors.im/cs2/cph2024/${code}_glitter.png`;

export default class Copenhagen2024 extends Major3Stage {
  TournamentStages = TournamentStages;
  event = "24copenhagen";
  title = "PGL Major Copenhagen 2024 Simulator";
  currentStage = 2;
  _scores = Scores;
  teamLogo = teamLogo;

  // state = {
  //   ...this.state,
  //   challengerResult: ChallengerResults,
  //   legendResult: LegendResults,
  // }

  fetch_scores = (callback) => {
    fetch('https://result-api.majors.im/scores.json')
      .then((resp) => resp.json())
      .then(callback);
  };

  fetch_matches = (callback) => {
    fetch('https://result-api.majors.im/matches.json')
      .then((resp) => resp.json())
      .then(callback);
  };
}
