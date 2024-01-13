/* eslint-disable global-require */

import {AdvanceElimSeats, ChampionSeats, getWinnerFromScoreCSGO, packTeam} from '../../../libs/common/common';
import {FormatBinder, Formats} from "../../../libs/common/formats/formats";
import {getPickResults} from "../../../libs/common/storage";
import {Major3Stage, TournamentChallenger, TournamentChampions, TournamentLegends} from "../../Common/Major3Stage";
import {getRelativeSeed, rankingSeed} from "./initial_seed";
import {FinalChallengers, FinalLegends, FinalResults} from "./final_results";

const teamLogo = (code) => `https://img.majors.im/go/berlin2019/${code}.png`;
const addLogo = x => ({
  ...x,
  logo: teamLogo(x.code),
  displayCode: x.code,
  initial_elo: x.elo,
});

const qs = [0.7333, 0.1365, 1.065e-2, 2.69e-4, -2.078e-5, -1.549e-6, 4.29e-9, 1.831e-9];

const TournamentStages = [
  {
    id: 0,
    initialTeams: FinalChallengers.teams.map(addLogo),
    teams: FinalChallengers.teams.map(addLogo),
    name: "Challengers",
    tournament: 0,
    tournamentType: Formats.Elo2019,
    seats: AdvanceElimSeats,
    winsToAdvance: 3,
    losesToEliminate: 3,
    rounds: 5,
  },
  {
    id: 1,
    initialTeams: FinalLegends.teams.map(addLogo),
    teams: FinalLegends.teams.map(addLogo),
    name: "Legends",
    tournament: 1,
    tournamentType: Formats.Elo2019,
    seats: AdvanceElimSeats,
    winsToAdvance: 3,
    losesToEliminate: 3,
    rounds: 5,
  },
  {
    id: 2,
    initialTeams: FinalLegends.teams.map(addLogo),
    teams: FinalLegends.teams.map(addLogo),
    name: "Champions",
    tournament: 2,
    tournamentType: Formats.Knockout,
    seats: ChampionSeats,
    losesToEliminate: 1,
    rounds: 3,
  },
];

export default class Berlin2019 extends Major3Stage {
  TournamentStages = TournamentStages;
  event = "19berlin";
  title = "StarLadder Berlin Major 2019 Simulator";
  currentStage = 0;
  _scores = FinalResults;
  nextMajorSlot = false;
  calculateMatchups = (s, e) => {
    this.setState(FormatBinder[this.state.tournamentType].bind(this)(s, e, getWinnerFromScoreCSGO, (deltaElo) =>
      qs.map((v, idx) => v * deltaElo ** idx).reduce((a, b) => a + b)
    ));
  };


  advance = (_) => {
    this.init(1);
    /*
    let finalTeams;
    let { challengerResult } = this.state
    if (this.state.tournament === TournamentChallenger) {
      const teamsAdvanced = this.state.roundTeams[5].filter(t => t.w === 3).map(t => t.code);
      const filtered = rankingSeed.filter(
        (x) => x.length === 3 || teamsAdvanced.indexOf(x[0]) !== -1
      );
      const elos = getRelativeSeed(filtered);
      const teams = Object.keys(elos).map((team, idx) => ({
        seed: idx,
        name: team,
        code: team,
        elo: elos[team],
        logo: teamLogo(team),
        displayCode: team,
        initial_elo: elos[team],
        w: 0,
        l: 0,
      }));


      challengerResult = this.state.roundTeams[5];
      finalTeams = teams;
      // setPickResults('pickResults', 0, this.event, this.state.pickResults);
    } else if (this.state.tournament === TournamentChampions) {
      finalTeams = getPickResults('teams', 1, this.event);
    }

    if (finalTeams) {
      this.setState({
        ...this.TournamentStages[1],
        ...packTeam(finalTeams),
        challengerResult,
        scores: this._scores[TournamentLegends],
        // pickResults: getPickResults('pickResults', 1, this.event),
      }, () => {
        this.calculateMatchups(0, this.state.rounds + 1)
      });
    }*/
  };


}
