/* eslint-disable global-require */

import {AdvanceElimSeats, ChampionSeats, getWinnerFromScoreCSGO} from '../../../../libs/common/common';
import {FormatBinder, Formats} from "../../../../libs/common/formats/formats";
import {Major3Stage, TournamentLegends} from "../../../Common/Major3Stage";
import {FinalResults} from "./final_results";
import {challengers, legends} from "./initial_seed";

const teamLogo = (code) => `https://img.majors.im/go/katowice2019/${code}.png`;
const addLogo = x => ({
  ...x,
  logo: teamLogo(x.code),
  displayCode: x.code,
  initial_elo: x.elo,
});

const TournamentStages = [
  {
    id: 0,
    initialTeams: challengers.map(addLogo),
    teams: challengers.map(addLogo),
    name: "Challengers",
    tournament: 0,
    tournamentType: Formats.Elo2019,
    seats: AdvanceElimSeats,
    scores: FinalResults[0],
    winsToAdvance: 3,
    losesToEliminate: 3,
    rounds: 5,
  },
  {
    id: 1,
    initialTeams: legends.map(addLogo),
    teams: legends.map(addLogo),
    name: "Legends",
    tournament: 1,
    tournamentType: Formats.Elo2019,
    seats: AdvanceElimSeats,
    scores: FinalResults[1],
    winsToAdvance: 3,
    losesToEliminate: 3,
    rounds: 5,
  },
  {
    id: 2,
    initialTeams: [],
    teams: [],
    name: "Champions",
    tournament: 2,
    tournamentType: Formats.Knockout,
    seats: ChampionSeats,
    scores: FinalResults[2],
    losesToEliminate: 1,
    rounds: 3,
  },
];

export default class Katowice2019 extends Major3Stage {
  TournamentStages = TournamentStages;
  event = "19katowice";
  title = "IEM Katowice Major 2019 Simulator";
  currentStage = 0;
  _scores = FinalResults;
  nextMajorSlot = false;
  calculateMatchups = (s, e) => {
    this.setState(FormatBinder[this.state.tournamentType].bind(this)(s, e, getWinnerFromScoreCSGO, (deltaElo) =>
      5 / (1 + 6.3 * Math.pow(0.794, deltaElo))
    ));
  };

  advance = (_) => {
    this.init(1);
  };


}
