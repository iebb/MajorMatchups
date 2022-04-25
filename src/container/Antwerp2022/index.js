/* eslint-disable global-require */

import React from 'react';
import {Image, Menu} from 'semantic-ui-react';
import {initialDataChallenger, initialDataLegends} from './initial_data';
import {Scores} from './scores';
import {
  AdvanceElimSeats,
  ChampionSeats,
  pack,
  setTiebreakerWinner,
  setWinner,
  shuffle,
} from '../../libs/common/common';
import {SwissBuchholtz} from '../../libs/common/SwissBuchholtz';
import {Knockout} from '../../libs/common/Knockout';
import {BasicUI} from '../../libs/common/BasicUI';
import {getPickResults, setPickResults} from "../../libs/common/storage";
import {SwissBuchholtzDup} from "../../libs/common/SwissBuchholtzDup";
import {ordinal} from "../../libs/plural";

const TournamentChallenger = 0;
const TournamentLegends = 1;
const TournamentChampions = 2;
const EVENT = "22antwerp";

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
    roundTeams: [[],[],[],[],[],[],[],[],[],],
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
    } else if (this.state.tournamentFormat === "SWISS_BUCHHOLTZ_DUP") {
      this.setState(SwissBuchholtzDup.bind(this)(s, e));
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
      pickResults: getPickResults('pickResults', 0, EVENT),
    }, () => {
      this.calculateMatchups(0, this.state.rounds + 1)
    });
  };


  advance = (_) => {
    let finalTeams;
    if (this.state.tournament === TournamentChallenger) {
      const teamsAdvanced = this.state.roundTeams[5].filter(x => x.adv).map((x, _idx) => ({
        ...x,
        description: `${x.l}L, ${x.buchholz}B, #${x.seed}`,
        l: 0, w: 0, buchholz: 0, seed: _idx + 9, opponents: [],
      }))
      finalTeams = [...initialDataLegends, ...teamsAdvanced];
      setPickResults('pickResults', 0, EVENT, this.state.pickResults);
    } else if (this.state.tournament === TournamentChampions) {
      finalTeams = getPickResults('teams', 1, EVENT);
    }
    if (finalTeams) {
      this.setState({
        ...pack(finalTeams, teamLogo),
        matches: [false, false, false, false, false, false],
        tournament: TournamentLegends,
        tournamentFormat: "SWISS_BUCHHOLTZ",
        seats: AdvanceElimSeats,
        loseToEliminate: 3,
        modified: true,
        rounds: 5,
        pickResults: getPickResults('pickResults', 1, EVENT),
      }, () => {
        this.calculateMatchups(0, this.state.rounds + 1)
      });
    }
  };

  advance2 = (_) => {
    if (this.state.tournament === TournamentLegends && this.state.roundTeams[5]) {
      const teamsAdvanced = this.state.roundTeams[5].filter(x => x.adv).map((x, _idx) => ({
        ...x,
        description: `${x.l}L, ${x.buchholz}B, #${x.seed}`,
        l: 0, w: 0, buchholz: 0, seed: _idx + 1, opponents: [],
      }))

      setPickResults('pickResults', 1, EVENT, this.state.pickResults);
      setPickResults('teams', 1, EVENT, this.state.teams[0]);
      this.setState({
        ...pack(teamsAdvanced, teamLogo),
        matches: [false, false, false, false, false, false],
        tournament: TournamentChampions,
        tournamentFormat: "KNOCKOUT",
        seats: ChampionSeats,
        loseToEliminate: 1,
        rounds: 3,
        legends: false,
        pickResults: getPickResults('pickResults', 2, EVENT),
      }, () => {
        this.calculateMatchups(0, this.state.rounds + 1)
      });
    }

  };

  renderNMS = () => {
    const result = this.state.roundTeams[5];
    if (!result) return null;

    const slots = [
      {standing: "-", region: "EU", cont: true},
      {standing: "-", region: "EU", cont: true},
      {standing: "-", region: "EU", cont: true},
      {standing: "-", region: "AM", cont: true},
      {standing: "-", region: "AM", cont: true},
      {standing: "-", region: "AM", cont: true},
      {standing: "-", region: "AP", cont: true},
      {standing: "-", region: "AP", cont: true},
    ]

    const regions = {
      EU: { name: "Europe", icon: "https://major.ieb.im/images/regions/eu1.png" },
      AM: { name: "Americas", icon: "https://major.ieb.im/images/regions/am.png" },
      AP: { name: "Asia/Pac", icon: "https://major.ieb.im/images/regions/ap.png" },
    }

    const m = (team, _) => {
      const r = regions[team.region];
      const status = team.cont ? "contenders" : (team.elim ? "challengers" : "legends");
      const statusText = team.cont ? "CONT" : (team.elim ? "CHAL" : "LEGEND");
      return (
        <div key={team.code} className={`team one ${status}`}>
          <div className="team-box up">
            <div className="team-box-split b">
                <span className="team-box-text">
                  {statusText}
                </span>
            </div>
          </div>
          <div className="team-box down">
            <div className="team-box-split b">
                <span className="team-box-text">
                  {team.standing >= 9 ? ordinal(team.standing) : team.standing < 9 ? "1st-8th" : "17-24th"}
                </span>
            </div>
          </div>
          <div className="team-box down">
            <div className="team-box-split b">
                <span className="team-box-text">
                  {r.name}
                </span>
            </div>
          </div>
          <div className="team-box med">
            <div className="team-box-split b">
              <Image className="team-logo" src={r.icon} />
            </div>
          </div>
        </div>
      )
    };


    return (
      <div className='main-container'>
        <h1 className='round-title'>
          Next Major Slot Allocations
        </h1>
        <div>
          {result.filter(x => x.adv).map(m)}
        </div>
        <div>
          {result.filter(x => x.elim).map(m)}
        </div>
        <div>
          {slots.map(m)}
        </div>
      </div>
    )
  }


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
          <div style={{ marginTop: 20 }}>
            {
              this.state.tournament === 1 && this.renderNMS()
            }
          </div>
        </div>
      </div>
    );
  }
}
