/* eslint-disable global-require */

import React from 'react';
import {Image, Menu} from 'semantic-ui-react';
import {initialDataChallenger, initialDataLegends} from './initial_data';
import {Scores} from './scores';
import {
  AdvanceElimSeats,
  ChampionSeats, copy,
  pack,
  setTiebreakerWinner,
  setWinner,
  shuffle,
} from '../../libs/common/common';
import {SwissBuchholtz} from '../../libs/common/formats/SwissBuchholtz';
import {Knockout} from '../../libs/common/formats/Knockout';
import {BasicUI} from '../../libs/common/BasicUI';
import {getPickResults, setPickResults} from "../../libs/common/storage";
import {SwissBuchholtzDup} from "../../libs/common/formats/SwissBuchholtzDup";
import {ordinal} from "../../libs/plural";

const TournamentChallenger = 0;
const TournamentLegends = 1;
const TournamentChampions = 2;

const teamLogo = (code) => `https://major.ieb.im/images/antwerp2022/${code}_large.png`;


const TournamentStages = [
  {
    id: 0,
    ...pack(initialDataChallenger, teamLogo),
    name: "Challengers",
    tournament: TournamentChallenger,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    seats: AdvanceElimSeats,
    rounds: 5,
  },
  /*
  {
    id: 1,
    ...pack(finalDataLegends),
    name: "Legends",
    tournament: TournamentLegends,
    advanceMode: 1,
    seats: ChampionSeats,
    rounds: 5,
  },
  {
    id: 2,
    ...pack(finalDataChampions),
    name: "Champions",
    tournament: TournamentChampions,
    advanceMode: 2,
    seats: ChampionSeats,
    // rounds: 5,
  },

   */
];

export default class Antwerp2022 extends React.PureComponent {
  event = "22antwerp";

  state = {
    teams: [[], false, false, false, false, false],
    roundTeams: [[],[],[],[],[],[],[],[],[],],
    matches: [false, false, false, false, false, false],
    tournament: 0,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    legends: false,
    scores: Scores,
    tiebreakers: {},
    tiebreakerResults: {},
    pickResults: getPickResults('pickResults', 0, this.event),
    lockResults: {},
    seats: AdvanceElimSeats,
    rounds: 0,
    winsToAdvance: 3,
    loseToEliminate: 3,
    nonDeciderBestOf: 1,
    deciderBestOf: 2,
    event: "22antwerp",
  };

  getStage = () => {
    return this.state.tournament;
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
      pickResults: getPickResults('pickResults', tStage, this.event),
    }, () => {
      this.calculateMatchups(0, this.state.rounds + 1)
    });

    fetch('https://score-service.deta.dev/get_picks/22antwerp')
      .then((resp) => resp.json())
      .then((resp) => {
        this.setState({
          pickStats: resp.results,
        });
      });
  };


  advance = (_) => {
    let finalTeams;
    let { challengerResult } = this.state
    if (this.state.tournament === TournamentChallenger) {
      const teamsAdvanced = this.state.roundTeams[5].filter(x => x.adv).map((x, _idx) => ({
        ...x,
        description: `${x.l}L, ${x.buchholz}B, #${x.seed}`,
        l: 0, w: 0, buchholz: 0, seed: _idx + 9, opponents: [],
      }))
      challengerResult = this.state.roundTeams[5];
      finalTeams = [...initialDataLegends, ...teamsAdvanced];
      setPickResults('pickResults', 0, this.event, this.state.pickResults);
    } else if (this.state.tournament === TournamentChampions) {
      finalTeams = getPickResults('teams', 1, this.event);
    }
    if (finalTeams) {
      this.setState({
        ...pack(finalTeams, teamLogo),
        challengerResult,
        matches: [false, false, false, false, false, false],
        tournament: TournamentLegends,
        tournamentFormat: "SWISS_BUCHHOLTZ",
        seats: AdvanceElimSeats,
        loseToEliminate: 3,
        rounds: 5,
        pickResults: getPickResults('pickResults', 1, this.event),
      }, () => {
        this.calculateMatchups(0, this.state.rounds + 1)
      });
    }
  };

  advance2 = (_) => {
    let { legendResult } = this.state
    if (this.state.tournament === TournamentLegends && this.state.roundTeams[5]) {
      const teamsAdvanced = this.state.roundTeams[5].filter(x => x.adv).map((x, _idx) => ({
        ...x,
        description: `${x.l}L, ${x.buchholz}B, #${x.seed}`,
        l: 0, w: 0, buchholz: 0, seed: _idx + 1, opponents: [],
      }))

      legendResult = this.state.roundTeams[5];
      setPickResults('pickResults', 1, this.event, this.state.pickResults);
      setPickResults('teams', 1, this.event, this.state.teams[0]);
      this.setState({
        ...pack(teamsAdvanced, teamLogo),
        legendResult,
        matches: [false, false, false, false, false, false],
        tournament: TournamentChampions,
        tournamentFormat: "KNOCKOUT",
        seats: ChampionSeats,
        loseToEliminate: 1,
        rounds: 3,
        legends: false,
        pickResults: getPickResults('pickResults', 2, this.event),
      }, () => {
        this.calculateMatchups(0, this.state.rounds + 1)
      });
    }

  };

  renderNMS = () => {
    let legendResult, championResult;
    if (this.state.tournament === 1) {
      legendResult = this.state.roundTeams[5];
      if (!legendResult) return null;
      championResult = legendResult.filter(x => x.adv).map(x => ({...x, standings: "1st-8th"}))
    } else if (this.state.tournament === 2) {
      championResult = this.state.roundTeams[3];
      if (!championResult) return null;
      legendResult = this.state.legendResult;
    }


    const challengerResult = this.state.challengerResult;
    if (!legendResult || !championResult || !challengerResult) return null;


    const counters = {EU: 0, AM: 0, AP: 0};

    championResult = championResult.map(x => ({...x, status: "legends", regionCounter: ++counters[x.region]}));
    legendResult = legendResult.filter(
      x => x.elim
    ).map(x => ({...x, status: "challengers", regionCounter: ++counters[x.region]}));

    const losingTeamsinChallenger = this.state.challengerResult.filter(
      x => x.elim
    ).map(x => ({...x, status: "contenders"}));
    const challengerSlots = {EU:3, AM:3, AP:2}
    const regionOrders = ["EU", "AM", "AP"];
    for(const team of losingTeamsinChallenger) {
      if (challengerSlots[team.region] === 0) {
        for(const otherRegion of regionOrders) {
          if (challengerSlots[otherRegion] > 0) {
            team.region = otherRegion
            team.name += " / Slot Transferred to " + otherRegion
            break;
          }
        }
      }
      --challengerSlots[team.region];
      team.cont = true;
      team.standing += 8;
      team.regionCounter = ++counters[team.region]
    }

    const slots = losingTeamsinChallenger;

    const regions = {
      EU: { name: "EU", icon: "https://major.ieb.im/images/regions/eu1.png" },
      AM: { name: "AM", icon: "https://major.ieb.im/images/regions/am.png" },
      AP: { name: "AP", icon: "https://major.ieb.im/images/regions/asia.png" },
    }

    const m = (team, _) => {
      const r = regions[team.region];
      const status = team.status;
      return (
        <div key={team.code} className={`team one ${status}`}>
          <div className="team-box down">
            <div className="team-box-split b">
                <span className="team-box-text">
                  {team.standings || ordinal(team.standing)}
                </span>
            </div>
          </div>
          <div className="team-box down">
            <div className="team-box-split b">
                <span className="team-box-text">
                  {r.name} #{team.regionCounter}
                </span>
            </div>
          </div>
          <div className="team-box med">
            <div className="team-box-split b stacked-logo">
              <Image className="team-logo" src={r.icon} />
              <div className="team-logo-bg-container">
                <Image className="team-logo-bg" src={team.logo} alt={team.name} title={team.name} />
              </div>
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
          {championResult.map(m)}
        </div>
        <div>
          {legendResult.map(m)}
        </div>
        <div>
          {slots.map(m)}
        </div>
      </div>
    )
  }

  renderPickStats = () => {
    const { pickStats } = this.state;
    if (!this.state.pickStats || !this.state.roundTeams[this.state.rounds]) {
      return null;
    }
    const rt = copy(this.state.roundTeams[this.state.rounds]);
    const tournamentPickStats = pickStats[this.getStage()];

    const m = (team, _) => {
      return (
        <div key={team.code} className={`team one`}>
          <div className="team-box down">
            <div className="team-box-split b">
                <span className="team-box-text">
                  {tournamentPickStats[team.code]}%
                </span>
            </div>
          </div>
          <div className="team-box med">
            <div className="team-box-split b">
              <Image className="team-logo" src={team.logo} />
            </div>
          </div>
        </div>
      )
    };


    return (
      <div className='main-container'>
        <h1 className='round-title'>
          Everyone's Picks
        </h1>
        <div>
          {rt.sort((y, x) => tournamentPickStats[x.code] - tournamentPickStats[y.code]).map(m)}
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
          <h3>
            Seeding and NMS Based on <a href="https://counter-strike.net/csgo_major_supplemental_rulebook/#Final-Rankings-Major">2022 Rulebook</a>.
          </h3>
          <h2 style={{ color: 'yellow' }}>
            Place, share your Pick'ems online at <a href="https://pick.ieb.im/" style={{ color: 'yellow' }} target="_blank">pick.ieb.im</a>
          </h2>
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
          <BasicUI
            state={this.state}
            stage={this.getStage()}
            shuffle={this.shuffle}
          />
          <div style={{ marginTop: 20 }}>
            {
              this.state.tournament >= 1 && this.renderNMS()
            }
          </div>
        </div>
      </div>
    );
  }
}
