/* eslint-disable global-require */

import React from 'react';
import { finalDataChampions, finalDataLegends, initialDataChallenger, initialDataLegends } from './initial_data';
import { FinalResultsChallenger, FinalResultsChampions, FinalResultsLegends } from './final_results';
import { BasicUI } from '../../../components/BasicUI';
import { AdvanceElimSeats, ChampionSeats, pack, setWinner, shuffle } from '../../../libs/common/common';
import Title from '../../../components/BannerInsertion';
import { FormatBinder } from '../../../libs/common/formats/formats';
import { UserGroupIcon } from '@heroicons/react/24/outline';

const TournamentChallenger = 0;
const TournamentLegends = 1;
const TournamentChampions = 2;

const teamLogo = (code) => `https://majors.im/images/stockh2021/${code}.png`;
const scores = { 0: FinalResultsChallenger, 1: FinalResultsLegends, 2: FinalResultsChampions };

const TournamentStages = [
  {
    id: 0,
    ...pack(initialDataChallenger, teamLogo),
    name: "Challengers",
    tournament: TournamentChallenger,
    tournamentType: 0,
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
    tournamentType: 0,
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



export default class Stockholm2021 extends React.PureComponent {
  state = {
    teams: [[], false, false, false, false, false],
    roundTeams: [[],[],[],[],[],[],[],[],[],],
    matches: [false, false, false, false, false, false],
    tournament: TournamentChallenger,
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
    event: "21stockholm",
  };

  event = "21stockholm";

  getStage = () => {
    return this.state.tournament;
  };

  calculateMatchups = (s, e) => {
    this.setState(FormatBinder[this.state.tournamentType].bind(this)(s, e));
  };

  init = (tStage) => {
    this.setState({
      ...TournamentStages[tStage],
      // pickResults: getPickResults('pickResults', tStage, this.event),
    }, () => {
      this.calculateMatchups(0, this.state.rounds + 1)
    });
  };
  componentDidMount() {
    this.setWinner = setWinner.bind(this);
    this.shuffle = shuffle.bind(this);
    this.init(2);
  }

  advance = (_) => {
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
      ...TournamentStages.map(ts => (
        {
          value: ts.id,
          label: ts.name,
          active: this.state.tournament === ts.id,
          icon: UserGroupIcon,
          onClick:() => this.init(ts.id)
        }
      )),
    ]
    return (

        <div className="page-container">
          <Title
            title="PGL Stockholm Major 2021 Simulator"
            isMajor
            extras={[
              {
                title: "seeding rules",
                link: "https://press.pglesports.com/161255-the-buchholtz-system-will-replace-the-tie-breaker-system-during-the-challengers-and-legends-stages"
              }
            ]}
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
      </div>
    );
  }
}
