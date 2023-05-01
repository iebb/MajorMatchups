/* eslint-disable global-require */

import React from 'react';
import { initialDataChallenger, initialDataLegends } from './initial_data';
import { ChallengerResults, LegendResults, Scores } from './scores';
import { AdvanceElimSeats, ChampionSeats, pack, setWinner, shuffle } from '../../../libs/common/common';
import { BasicUI } from '../../../components/BasicUI';
import { getPickResults, setPickResults } from '../../../libs/common/storage';
import { ordinal } from '../../../libs/plural';
import Title from '../../../components/BannerInsertion';
import { PaperAirplaneIcon, TrophyIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { FormatBinder, Formats } from '../../../libs/common/formats/formats';

const TournamentChallenger = 0;
const TournamentLegends = 1;
const TournamentChampions = 2;

const teamLogo = (code) => {
  return code.indexOf("#") !== -1 ?
    `https://majors.im/images/regions/${code.split("#")[0]}.png?r=2`
    :
  `https://majors.im/images/paris2023_rmr/${code}.png`;
}


const TournamentStages = [
  {
    id: 0,
    ...pack(initialDataChallenger, teamLogo),
    name: "Challengers",
    tournament: TournamentChallenger,
    tournamentType: Formats.SwissBuchholtz,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    seats: AdvanceElimSeats,
    icon: UserGroupIcon,
    rounds: 5,
  },
  // {
  //   id: 1,
  //   ...pack(finalDataLegends, teamLogo),
  //   name: "Legends",
  //   tournament: TournamentLegends,
  //   tournamentType: 0,
  //  tournamentFormat: "SWISS_BUCHHOLTZ",
  //   advanceMode: 1,
  //   icon: PaperAirplaneIcon,
  //   seats: AdvanceElimSeats,
  //   rounds: 5,
  // },
  // {
  //   id: 2,
  //   ...pack(finalDataChampions, teamLogo),
  //   name: "Champions",
  //   tournament: TournamentChampions,
  //   tournamentType: 2,
  //   tournamentFormat: "KNOCKOUT",
  //   advanceMode: 2,
  //   icon: PaperAirplaneIcon,
  //   seats: ChampionSeats,
  //   loseToEliminate: 1,
  //   rounds: 3,
  // },
];

export default class Paris2023Provisional extends React.PureComponent {
  event = "23par_prov";
  _scores = Scores;
  state = {
    teams: [[], false, false, false, false, false],
    roundTeams: [[],[],[],[],[],[],[],[],[],],
    matches: [false, false, false, false, false, false],
    tournament: 0,
    tournamentType: Formats.SwissBuchholtz,
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
    showDescription: 1,
    event: "23par_prov",
    challengerResult: ChallengerResults,
    legendResult: LegendResults,
  };

  getStage = () => {
    return this.state.tournament;
  };



  calculateMatchups = (s, e) => {
    this.setState(FormatBinder[this.state.tournamentType].bind(this)(s, e));
  };

  componentDidMount() {
    this.setWinner = setWinner.bind(this);
    this.shuffle = shuffle.bind(this);
    this.init(0);

    // clearInterval(window.fetchInterval);
    //
    // window.fetchInterval = setInterval(() => {
    //   fetch('https://score-service.deta.dev/fetch_results/event_19')
    //     .then((resp) => resp.json())
    //     .then((resp) => {
    //       this._scores = {
    //         0: resp[1],
    //         1: resp[2],
    //         2: resp[3],
    //       };
    //       this.setState({scores: this._scores[this.state.tournament]}, () => {
    //         this.calculateMatchups(0, this.state.rounds + 1)
    //       });
    //     })
    // }, 30000)
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
        description: `${x.l}L, ${x.buchholtz}B, #${x.seed}`,
        l: 0, w: 0, buchholtz: 0, seed: _idx + 9, opponents: [],
        buchholtzBreakdown: [],
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
        tournamentType: 0,
        tournamentFormat: "SWISS_BUCHHOLTZ",
        scores: this._scores[TournamentLegends],
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
        description: `${x.l}L, ${x.buchholtz}B, #${x.seed}`,
        l: 0, w: 0, buchholtz: 0, seed: _idx + 1, opponents: [],
        buchholtzBreakdown: [],
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
        tournamentType: 2,
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
              <img className="team-logo" src={r.icon} alt={r.name} />
              <div className="team-logo-bg-container">
                <img className="team-logo-bg" src={team.logo} alt={team.name} title={team.name} />
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
  render() {

    const tabs = [
      ...TournamentStages.map(ts => (
        {
          value: ts.id,
          label: ts.name,
          active: this.state.tournament === ts.id,
          icon: UserGroupIcon,
          onClick:() => this.init(ts.id)
        }
      )),
      ...(
        this.state.tournament < 0 ? [] : [
          {
            value: 1,
            label: "Legends",
            icon: PaperAirplaneIcon,
            active: this.state.tournament === 1,
            onClick: () => this.advance()
          }
        ]
      ),
      ...(
        this.state.tournament < 1 ? [] : [
          {
            value: 2,
            label: "Champions",
            icon: TrophyIcon,
            active: this.state.tournament === 2,
            onClick: () => this.advance2()
          }
        ]
      )
    ]

    return (
      <div className="outer">
        <div className="page-container">
          <Title
            title="BLAST.tv Paris 2023 Major Simulator (Provisional)"
          />
          <BasicUI
            tabs={tabs}
            state={this.state}
            stage={this.getStage()}
            shuffle={this.shuffle}
            advance={
              this.state.tournament === 0 ? this.advance : this.state.tournament === 1 ? this.advance2 : null
            }
          />
          <div className="pt-4">
            {
              this.state.tournament >= 1 && this.renderNMS()
            }
          </div>
        </div>
      </div>
    );
  }
}
