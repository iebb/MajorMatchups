/* eslint-disable global-require */

import {TrophyIcon, UserGroupIcon} from '@heroicons/react/24/outline';
import React from 'react';
import Title from '../../../components/BannerInsertion';
import {BasicUI} from '../../../components/BasicUI';
import {
  AdvanceElimSeats,
  ChampionSeats,
  getWinnerFromScoreGeneric,
  pack,
  setWinner,
  shuffle,
} from '../../../libs/common/common';
import {FormatBinder, Formats} from '../../../libs/common/formats/formats';
import {FinalResultsChampions, FinalResultsPlayoff} from "./final_results";
import {initialDataChallenger} from './initial_data';

const TournamentChallenger = 0;
const TournamentChampions = 1;

const teamLogo = (code) => `https://img.majors.im/r6/atl23/${code}.png`;
// const scores = { 0: FinalResultsPlayoff, 1: FinalResultsChampions };

const TournamentStages = [
  {
    id: 0,
    determined: true,
    ...pack(initialDataChallenger, teamLogo),
    name: "Playoffs",
    tournament: TournamentChallenger,
    tournamentType: Formats.SwissBuchholtzR1P,
    seats: AdvanceElimSeats,
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderToWin: 1,
    advancerToWin: 1,
    deciderToWin: 2,
    rounds: 5,
    scores: FinalResultsPlayoff,
  },
  {
    id: 1,
    // ...pack(finalDataChampions, teamLogo),
    determined: false,
    name: "Finals",
    tournament: TournamentChampions,

    tournamentType: 2,
    tournamentFormat: "KNOCKOUT",
    seats: ChampionSeats,
    winsToAdvance: 3,
    losesToEliminate: 1,
    nonDeciderToWin: 2,
    deciderToWin: 2,
    rounds: 3,
    scores: FinalResultsChampions,
  },
];



export default class R6ATL23 extends React.PureComponent {
  state = {
    teams: [[], false, false, false, false, false],
    roundTeams: [[],[],[],[],[],[],[],[],[],],
    matches: [false, false, false, false, false, false],
    tournament: TournamentChallenger,
    tournamentType: Formats.SwissBuchholtzR1P,
    round1Preventions: {
      'virt-wolv': 1,
      'faze-ninj': 1,
      'soni-dark': 1,
      'faze-wolv': 1,
    },
    scores: {},
    tiebreakers: {},
    tiebreakerResults: {},
    pickResults: {},
    lockResults: {},
    seats: AdvanceElimSeats,
    rounds: 0,
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    event: "23r6atl",
  };

  event = "23r6atl";

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

    // return fetch('/r6_scores')
    //   .then((resp) => resp.json())
    //   .then((resp) => {
    //     this.setState({
    //       ...TournamentStages[TournamentChallenger],
    //       ...pack(initialDataChallenger, teamLogo),
    //       scores: resp.results,
    //     }, () => {
    //       this.calculateMatchups(0, this.state.rounds + 1)
    //     });
    //   });
  }


  init = (_) => {
    this.setState({
      ...TournamentStages[TournamentChallenger],
      ...pack(initialDataChallenger, teamLogo),
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

        <div className="page-container">
          <Title
            title="BLAST R6 Major Atlanta 2023 Simulator"
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
    );
  }
}
