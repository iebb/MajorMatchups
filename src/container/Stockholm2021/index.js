/* eslint-disable global-require */

import React from 'react';
import { Menu } from 'semantic-ui-react';
import { finalDataChampions, finalDataLegends, initialDataChallenger, initialDataLegends } from './initial_data';
import { FinalResultsChallenger, FinalResultsChampions, FinalResultsLegends } from './final_results';
import { BasicUI } from '../../libs/common/BasicUI';
import { SwissBuchholtz } from '../../libs/common/SwissBuchholtz';
import { Knockout } from '../../libs/common/Knockout';
import {
  AdvanceElimSeats,
  ChampionSeats,
  pack,
  setTiebreakerWinner,
  setWinner,
  shuffle,
} from '../../libs/common/common';

const TournamentChallenger = 0;
const TournamentLegends = 1;
const TournamentChampions = 2;

const teamLogo = (code) => `https://major.ieb.im/images/stockh2021/${code}.png`;
const scores = { 0: FinalResultsChallenger, 1: FinalResultsLegends, 2: FinalResultsChampions };

const TournamentStages = [
  {
    id: 0,
    ...pack(initialDataChallenger, teamLogo),
    name: "Challengers",
    tournament: TournamentChallenger,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    winsToAdvance: 3,
    loseToEliminate: 3,
    nonDeciderBestOf: 1,
    deciderBestOf: 2,
    rounds: 5,
    scores: scores[TournamentChallenger],
  },
  {
    id: 1,
    ...pack(finalDataLegends, teamLogo),
    name: "Legends",
    tournament: TournamentLegends,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    winsToAdvance: 3,
    loseToEliminate: 3,
    nonDeciderBestOf: 1,
    deciderBestOf: 2,
    rounds: 5,
    scores: scores[TournamentLegends],
  },
  {
    id: 2,
    ...pack(finalDataChampions, teamLogo),
    name: "Champions",
    tournament: TournamentChampions,
    advanceMode: 2,
    tournamentFormat: "KNOCKOUT",
    seats: ChampionSeats,
    winsToAdvance: 3,
    loseToEliminate: 1,
    nonDeciderBestOf: 2,
    deciderBestOf: 2,
    rounds: 3,
    scores: scores[TournamentChampions],
  },
];



export default class Stockholm2021 extends React.PureComponent {
  state = {
    teams: [[], false, false, false, false, false],
    roundTeams: [[],[],[],[],[],[],[],[],[],],
    matches: [false, false, false, false, false, false],
    tournament: TournamentChallenger,
    modified: true,
    scores: {},
    tiebreakers: {},
    tiebreakerResults: {},
    pickResults: {},
    lockResults: {},
    seats: AdvanceElimSeats,
    rounds: 0,
    winsToAdvance: 3,
    loseToEliminate: 3,
    nonDeciderBestOf: 1,
    deciderBestOf: 2,
  };

  calculateMatchups = (s, e) => {
    if (this.state.tournamentFormat === "SWISS_BUCHHOLTZ") {
      this.setState(SwissBuchholtz.bind(this)(s, e));
    } else if (this.state.tournamentFormat === "KNOCKOUT") {
      this.setState(Knockout.bind(this)(s, e));
    } else {

    }
  };

  componentDidMount() {
    this.setWinner = setWinner.bind(this);
    this.setTiebreakerWinner = setTiebreakerWinner.bind(this);
    this.shuffle = shuffle.bind(this);
    this.initChampions();
  }


  init = (_) => {
    this.setState({
      ...TournamentStages[TournamentChallenger],
      ...pack(initialDataChallenger, teamLogo),
    }, () => {
      this.calculateMatchups(0, this.state.rounds + 1)
    });
  };

  initLegends = (_) => {
    this.setState({
      ...TournamentStages[TournamentLegends],
      ...pack(finalDataLegends, teamLogo),
    }, () => {
      this.calculateMatchups(0, this.state.rounds + 1)
    });

  };
  initChampions = (_) => {
    this.setState({
      ...TournamentStages[TournamentChampions],
      ...pack(finalDataChampions, teamLogo),
    }, () => {
      this.calculateMatchups(0, this.state.rounds + 1)
    });

  };

  advance = (_) => {
    if (this.state.tournament === TournamentChallenger && this.state.teams[5]) {
      const teamsAdvanced = this.state.teams[5].filter(x => x.w === 3).sort(
        (a, b) => {
          if (a.l !== b.l) return a.l - b.l;
          if (a.buchholz !== b.buchholz) return b.buchholz - a.buchholz;
          return a.seed - b.seed;
        }
      ).map((x, _idx) => ({
        ...x,
        description: `${x.l}L, ${x.buchholz}B, #${x.seed}`,
        l: 0,
        w: 0,
        opponents: [],
        buchholz: 0,
        seed: _idx + 9,
      }))

      const finalTeams = [...initialDataLegends, ...teamsAdvanced];
      this.setState({
        ...TournamentStages[TournamentLegends],
        ...pack(finalTeams, teamLogo),
        matches: [false, false, false, false, false, false],
      }, () => {
        this.calculateMatchups(0, this.state.rounds + 1)
      });
    }

  };

  advance2 = (_) => {
    if (this.state.tournament === TournamentLegends && this.state.teams[5]) {
      const teamsAdvanced = this.state.teams[5].filter(x => x.w === 3).sort(
        (a, b) => {
          if (a.l !== b.l) return a.l - b.l;
          if (a.buchholz !== b.buchholz) return b.buchholz - a.buchholz;
          return a.seed - b.seed;
        }
      ).map((x, _idx) => ({
        ...x,
        description: `${x.l}L, ${x.buchholz}B, #${x.seed}`,
        l: 0,
        w: 0,
        opponents: [],
        buchholz: 0,
        seed: _idx + 1,
      }))

      this.setState({
        ...TournamentStages[TournamentChampions],
        ...pack(teamsAdvanced, teamLogo),
        matches: [false, false, false, false, false, false],
      }, () => {
        this.calculateMatchups(0, this.state.rounds + 1)
      });
    }

  };

  render() {
    return (
      <div className="outer">
        <div className="page-container">
          <div className="title-container">
            <h1 className="title">PGL Stockholm Major 2021 Matchup Calculator</h1>
          </div>
          <p style={{ fontSize: "120%" }}>
            <a href="https://press.pglesports.com/161255-the-buchholz-system-will-replace-the-tie-breaker-system-during-the-challengers-and-legends-stages">
              UPDATED - The Buchholtz System</a>
          </p>
          <p style={{ fontSize: "100%" }}>
            Share this website to your friends :D
          </p>
          <p>
            <a href="https://www.reddit.com/r/GlobalOffensive/comments/qef216/the_matchup_simulator_again/">
              reddit thread
            </a>
            <span style={{ margin: 10 }}>·</span>
            <a href="https://discord.gg/KYNbRYrZGe">
              feedback(discord)
            </a>
            <span style={{ margin: 10 }}>·</span>
            <a href="https://twitter.com/CyberHono">
              twitter
            </a>
            <span style={{ margin: 10 }}>·</span>
            <a href="https://steamcommunity.com/id/iebbbb">
              steam profile
            </a>
          </p>
          <div style={{ marginTop: 20 }}>
            <Menu pointing secondary inverted compact size="huge" style={{ border: 'none' }}>
              <Menu.Item
                name="Challengers"
                active={this.state.tournament === TournamentChallenger}
                onClick={() => this.init(TournamentChallenger)}
              />
              <Menu.Item
                name={"Legends"}
                active={this.state.tournament === TournamentLegends}
                onClick={() => this.initLegends()}
              />
              <Menu.Item
                name="Champions"
                active={this.state.tournament === TournamentChampions}
                onClick={() => this.initChampions()}
              />
            </Menu>
          </div>
          <BasicUI state={this.state} shuffle={this.shuffle} />
        </div>
      </div>
    );
  }
}
