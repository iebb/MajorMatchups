/* eslint-disable global-require */

import React from 'react';
import { Menu } from 'semantic-ui-react';
import { initialDataChallenger, initialDataLegends } from './initial_data';
import { Scores } from './scores';
import {
  AdvanceElimSeats,
  ChampionSeats,
  pack,
  setTiebreakerWinner,
  setWinner,
  shuffle,
} from '../../libs/common/common';
import { SwissBuchholtz } from '../../libs/common/SwissBuchholtz';
import { Knockout } from '../../libs/common/Knockout';
import { BasicUI } from '../../libs/common/BasicUI';

const TournamentChallenger = 0;
const TournamentLegends = 1;
const TournamentChampions = 2;


const teamLogo = (code) => `https://major.ieb.im/images/antwerp2022_rmr/${code.split("|")[0]}.png`;


const TournamentStages = [
  {
    id: 0,
    ...pack(initialDataChallenger, teamLogo),
    name: "Challengers",
    tournament: TournamentChallenger,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    modified: true,
    rounds: 5,
  },
  /*
  {
    id: 1,
    ...pack(finalDataLegends),
    name: "Legends",
    tournament: TournamentLegends,
    advanceMode: 1,
    modified: true,
    rounds: 5,
  },
  {
    id: 2,
    ...pack(finalDataChampions),
    name: "Champions",
    tournament: TournamentChampions,
    advanceMode: 2,
    modified: true,
    // rounds: 5,
  },

   */
];

export default class Antwerp2022 extends React.PureComponent {
  state = {
    teams: [[], false, false, false, false, false],
    roundTeams: [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    ],
    matches: [false, false, false, false, false, false],
    regionId: 0,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    legends: false,
    modified: true,
    scores: Scores,
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
    this.init(0);
  }

  init = (tStage) => {
    this.setState({
      ...TournamentStages[tStage],
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
        ...pack(finalTeams, teamLogo),
        matches: [false, false, false, false, false, false],
        tournament: TournamentLegends,
        tournamentFormat: "SWISS_BUCHHOLTZ",
        seats: AdvanceElimSeats,
        loseToEliminate: 3,
        modified: true,
        rounds: 5,
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
        ...pack(teamsAdvanced, teamLogo),
        matches: [false, false, false, false, false, false],
        tournament: TournamentChampions,
        tournamentFormat: "KNOCKOUT",
        seats: ChampionSeats,
        loseToEliminate: 1,
        rounds: 3,
        legends: false,
        modified: true,
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
            <h1 className="title">PGL Antwerp Major 2022 Matchup Calculator</h1>
          </div>
          <h3 style={{ color: 'yellow'}}>
            Seeding updated based on rules from the <a href="https://counter-strike.net/csgo_major_supplemental_rulebook/#Final-Rankings-Major">Rulebook</a>.
            Should be correct now.
          </h3>
          <p>
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
          <Menu pointing secondary inverted compact size="huge" style={{ border: 'none' }}>
            {
              TournamentStages.map(ts => (
                <Menu.Item
                  key={ts.id}
                  name={ts.name}
                  active={this.state.tournament === ts.id}
                  onClick={() => this.init(ts.id)}
                />
              ))
            }
            {
              this.state.tournament >= 0 && (
                <Menu.Item
                  key="adv-1"
                  name="Legends"
                  active={this.state.tournament === 1}
                  onClick={() => this.advance()}
                />
              )
            }
            {
              this.state.tournament >= 1 && (
                <Menu.Item
                  key="adv-2"
                  name="Champions"
                  active={this.state.tournament === 2}
                  onClick={() => this.advance2()}
                />
              )
            }
          </Menu>
          <BasicUI state={this.state} shuffle={this.shuffle} />
        </div>
      </div>
    );
  }
}
