/* eslint-disable global-require */

import React from 'react';
import {Image, Menu} from 'semantic-ui-react';
import {initialDataChallenger, initialDataLegends, finalDataLegends} from './initial_data';
import {ChallengerResults, LegendResults, Scores} from './scores';
import {
  AdvanceElimSeats,
  ChampionSeats,
  copy,
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
import sponsorLogo from "../../images/sponsor/rio_sb.svg";

const TournamentChallenger = 0;
const TournamentLegends = 1;
const TournamentChampions = 2;

const teamLogo = (code) => `https://majors.im/images/rio2022/${code}_glitter_large.png`;


const TournamentStages = [
  {
    id: 0,
    ...pack(initialDataChallenger, teamLogo),
    name: "Challengers",
    tournament: TournamentChallenger,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    seats: AdvanceElimSeats,
    rounds: 5,
    pickemTags: ["picks_215"],
  },
  {
    id: 1,
    ...pack(finalDataLegends, teamLogo),
    name: "Legends",
    tournament: TournamentLegends,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    advanceMode: 1,
    seats: AdvanceElimSeats,
    rounds: 5,
    pickemTags: ["picks_216"],
  },
  // {
  //   id: 1,
  //   ...pack(finalDataLegends, teamLogo),
  //   name: "Legends",
  //   tournament: TournamentLegends,
  //   tournamentFormat: "SWISS_BUCHHOLTZ",
  //   advanceMode: 1,
  //   seats: AdvanceElimSeats,
  //   rounds: 5,
  // },
  // {
  //   id: 2,
  //   ...pack(finalDataChampions, teamLogo),
  //   name: "Champions",
  //   tournament: TournamentChampions,
  //   tournamentFormat: "KNOCKOUT",
  //   advanceMode: 2,
  //   seats: ChampionSeats,
  //   loseToEliminate: 1,
  //   rounds: 3,
  // },
];

export default class Rio2022 extends React.PureComponent {
  event = "22rio";
  _scores = Scores;
  state = {
    teams: [[], false, false, false, false, false],
    roundTeams: [[],[],[],[],[],[],[],[],[],],
    matches: [false, false, false, false, false, false],
    tournament: 0,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    legends: false,
    scores: {},
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
    event: "22rio",
    challengerResult: ChallengerResults,
    legendResult: LegendResults,
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
    this.init(1);

    fetch('https://result-api.majors.im/event_20.json')
      .then((resp) => resp.json())
      .then((resp) => {
        this._scores = {
          0: resp[1],
          1: resp[2],
          2: resp[3],
        };
        this.setState({scores: this._scores[this.state.tournament]}, () => {
          this.calculateMatchups(0, this.state.rounds + 1)
        });
      });
  }

  init = (tStage) => {
    this.setState({
      ...TournamentStages[tStage],
      scores: this._scores[tStage],
      pickResults: getPickResults('pickResults', tStage, this.event),
    }, () => {
      this.calculateMatchups(0, this.state.rounds + 1)
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
        buchholzBreakdown: [],
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
        scores: this._scores[TournamentLegends],
        seats: AdvanceElimSeats,
        loseToEliminate: 3,
        rounds: 5,
        pickemTags: ["picks_216"],
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
        buchholzBreakdown: [],
      }))

      legendResult = this.state.roundTeams[5];
      setPickResults('pickResults', 1, this.event, this.state.pickResults);
      setPickResults('teams', 1, this.event, this.state.teams[0]);
      this.setState({
        ...pack(teamsAdvanced, teamLogo),
        legendResult,
        matches: [false, false, false, false, false, false],
        tournament: TournamentChampions,
        scores: this._scores[TournamentChampions],
        tournamentFormat: "KNOCKOUT",
        seats: ChampionSeats,
        loseToEliminate: 1,
        rounds: 3,
        pickemTags: [],
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
      EU: { name: "EU", icon: "https://majors.im/images/regions/eu1.png" },
      AM: { name: "AM", icon: "https://majors.im/images/regions/am.png" },
      AP: { name: "AP", icon: "https://majors.im/images/regions/asia.png" },
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
    const s = this.getStage();
    if (s >= 2) return null;
    const groupId = 206 + s;

    const { stats, total } = pickStats;

    const tournamentPickTotal = total[groupId];
    if (!tournamentPickTotal) return null;
    const tournamentPickStats = stats[groupId];

    const advance = {}
    const threeZero = {}
    const zeroThree = {}

    for (const k of Object.keys(tournamentPickStats)) {
      advance[k] = tournamentPickStats[k]['Adv'] / tournamentPickTotal;
      threeZero[k] = tournamentPickStats[k]['3-0'] / tournamentPickTotal;
      zeroThree[k] = tournamentPickStats[k]['0-3'] / tournamentPickTotal;
    }

    const m = (team, _) => {
      return (
        <div key={team.code} className={`team one`}>
          <div className="team-box down">
            <div className="team-box-split b">
                <span className="team-box-text" title="3-0" style={{ color: "#ffc40a" }}>{(threeZero[team.code] * 100.0).toFixed(1)}%</span>
            </div>
          </div>
          <div className="team-box down">
            <div className="team-box-split b">
                <span className="team-box-text" title="Remaining 7 Advancing Teams" style={{ color: "#5eb1f6" }}>{(advance[team.code] * 100.0).toFixed(1)}%</span>
            </div>
          </div>
          <div className="team-box down">
            <div className="team-box-split b">
                <span className="team-box-text" title="0-3" style={{ color: "#8e8e8e" }}>{(zeroThree[team.code] * 100.0).toFixed(1)}%</span>
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
          Pick'em Stats (Detail: <a href="https://pick.ieb.im/stats">https://pick.ieb.im/stats</a>)
        </h1>
        <div>
          {rt.sort((y, x) => advance[x.code] - advance[y.code]).map(m)}
        </div>
      </div>
    )
  }


  render() {
    return (
      <div className="outer">
        <div className="page-container">
          <div className="title-container">
            <h1 className="title">IEM Rio Major 2022 Matchup Calculator</h1>
            <p style={{ fontSize: 18, marginTop: -16 }}>
              Sponsored by <a href="https://cutt.ly/eBejmLo"><img src={sponsorLogo} alt="Sportsbet.io" style={{ maxHeight: 20, marginLeft: 10 }}/></a>
            </p>
            <h3 style={{ color: 'yellow' }}>
              Place and Track Pick'ems: <a href="https://pick.majors.im/" target="_blank">pick.majors.im</a>
            </h3>
          </div>
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
            <span style={{ margin: 10 }}>·</span>
            <a href="https://weibo.com/u/1940682383">
              weibo
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
              /*
              this.state.tournament >= 0 && (
                <Menu.Item
                  key="adv-2"
                  name="Legends"
                  active={this.state.tournament === 1}
                  onClick={() => this.advance()}
                />
              )*/
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
            pickemTags={this.state.pickemTags}
            shuffle={this.shuffle}
            advance={
              this.state.tournament === 0 ? this.advance : this.state.tournament === 1 ? this.advance2 : null
            }
          />
          <div style={{ marginTop: 20 }}>
            {
              this.renderPickStats()
            }
          </div>
          <div style={{ marginTop: 20 }}>
            {
              this.state.tournament >= 1 && this.renderNMS()
            }
          </div>
          <p style={{ fontSize: 18, marginTop: 36 }}>
            Sponsored by <a href="https://cutt.ly/eBejmLo"><img src={sponsorLogo} alt="Sportsbet.io" style={{ maxHeight: 20, marginLeft: 10 }}/></a>
          </p>
        </div>
      </div>
    );
  }
}
