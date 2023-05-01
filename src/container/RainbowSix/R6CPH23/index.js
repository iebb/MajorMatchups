/* eslint-disable global-require */

import React from 'react';
import { finalDataChampions, initialDataChallenger } from './initial_data';
import { BasicUI } from '../../../components/BasicUI';
import {
  AdvanceElimSeats,
  ChampionSeats,
  getWinnerFromScoreGeneric,
  pack,
  setWinner,
  shuffle,
} from '../../../libs/common/common';
import Title from '../../../components/BannerInsertion';
import { TrophyIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { FormatBinder } from '../../../libs/common/formats/formats';

const TournamentChallenger = 0;
const TournamentChampions = 1;

const teamLogo = (code) => `https://sox.pm/logos/${code}.png`;
const scores = { 0: { }, 1: { } };

const TournamentStages = [
  {
    id: 0,
    determined: true,
    ...pack(initialDataChallenger, teamLogo),
    name: "Playoffs",
    tournament: TournamentChallenger,
    tournamentType: 0,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    seats: AdvanceElimSeats,
    winsToAdvance: 3,
    loseToEliminate: 3,
    nonDeciderBestOf: 1,
    deciderBestOf: 2,
    rounds: 5,
    scores: scores[TournamentChallenger],
  },
  {
    id: 1,
    ...pack(finalDataChampions, teamLogo),
    determined: false,
    name: "Finals",
    tournament: TournamentChampions,
    advanceMode: 2,
    tournamentType: 2,
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



export default class R6CPH23 extends React.PureComponent {
  state = {
    teams: [[], false, false, false, false, false],
    roundTeams: [[],[],[],[],[],[],[],[],[],],
    matches: [false, false, false, false, false, false],
    tournament: TournamentChallenger,
    tournamentType: 0,
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
    event: "23r6cph",
  };

  event = "23r6cph";

  getStage = () => {
    return this.state.tournament;
  };

  calculateMatchups = (s, e) => {
    this.setState(FormatBinder[this.state.tournamentType].bind(this)(s, e, getWinnerFromScoreGeneric));
  };

  componentDidMount() {
    this.setWinner = setWinner.bind(this);
    this.shuffle = shuffle.bind(this);
    this.init();

    return fetch('/r6_scores')
      .then((resp) => resp.json())
      .then((resp) => {
        this.setState({
          ...TournamentStages[TournamentChallenger],
          ...pack(initialDataChallenger, teamLogo),
          scores: resp.results,
        }, () => {
          this.calculateMatchups(0, this.state.rounds + 1)
        });
      });
  }k


  init = (_) => {
    this.setState({
      ...TournamentStages[TournamentChallenger],
      ...pack(initialDataChallenger, teamLogo),
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


  advance2 = (_) => {
    if (this.state.tournament === TournamentChallenger && this.state.teams[5]) {
      const teamsAdvanced = this.state.teams[5].filter(x => x.w === 3).sort(
        (a, b) => {
          if (a.l !== b.l) return a.l - b.l;
          if (a.buchholtz !== b.buchholtz) return b.buchholtz - a.buchholtz;
          return a.seed - b.seed;
        }
      ).map((x, _idx) => ({
        ...x,
        description: `${x.l}L, ${x.buchholtz}B, #${x.seed}`,
        l: 0,
        w: 0,
        opponents: [],
        buchholtz: 0,
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

    const tabs = [
      ...TournamentStages.filter(x => x.determined).map(ts => (
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
            label: "Finals",
            icon: TrophyIcon,
            active: this.state.tournament === TournamentChampions,
            onClick: () => this.advance2()
          }
        ]
      )
    ]

    return (
      <div className="outer">
        <div className="page-container">
          <Title
            title="BLAST R6 Major Copenhagen 2023 Simulator"
            sponsorLess
          />
          <BasicUI
            tabs={tabs}
            state={this.state}
            stage={this.getStage()}
            shuffle={this.shuffle}
            advance={
              this.state.tournament === 0 ? this.advance2 : null
            }
          />
        </div>
      </div>
    );
  }
}