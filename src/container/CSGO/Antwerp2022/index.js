/* eslint-disable global-require */

import React from 'react';
import { finalDataChampions, finalDataLegends, initialDataChallenger, initialDataLegends } from './initial_data';
import { ChallengerResults, LegendResults, Scores } from './scores';
import { AdvanceElimSeats, ChampionSeats, pack, setWinner, shuffle } from '../../../libs/common/common';
import { Knockout } from '../../../libs/common/formats/Knockout';
import { BasicUI } from '../../../components/BasicUI';
import { getPickResults, setPickResults } from '../../../libs/common/storage';
import Title from '../../../components/BannerInsertion';
import { SwissBuchholtzTB } from '../../../libs/common/formats/SwissBuchholtzTB';
import { NextMajorSlot } from '../../../components/NextMajorSlot';
import { UserGroupIcon } from '@heroicons/react/24/outline';

const TournamentChallenger = 0;
const TournamentLegends = 1;
const TournamentChampions = 2;

const teamLogo = (code) => `https://img.majors.im/go/antwerp2022/${code}_large.png`;


const TournamentStages = [
  {
    id: 0,
    ...pack(initialDataChallenger, teamLogo),
    name: "Challengers",
    tournament: TournamentChallenger,
    tournamentType: 0,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    seats: AdvanceElimSeats,
    rounds: 5,
  },
  {
    id: 1,
    ...pack(finalDataLegends, teamLogo),
    name: "Legends",
    tournament: TournamentLegends,
    tournamentType: 0,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    advanceMode: 1,
    seats: AdvanceElimSeats,
    rounds: 5,
  },
  {
    id: 2,
    ...pack(finalDataChampions, teamLogo),
    name: "Champions",
    tournament: TournamentChampions,
    tournamentType: 2,
    tournamentFormat: "KNOCKOUT",
    advanceMode: 2,
    seats: ChampionSeats,
    loseToEliminate: 1,
    rounds: 3,
  },
];

export default class Antwerp2022 extends React.PureComponent {
  event = "22antwerp";
  _scores = Scores;
  state = {
    teams: [[], false, false, false, false, false],
    roundTeams: [[],[],[],[],[],[],[],[],[],],
    matches: [false, false, false, false, false, false],
    tournament: 0,
    tournamentType: 0,
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
    event: "22antwerp",
    challengerResult: ChallengerResults,
    legendResult: LegendResults,
  };

  getStage = () => {
    return this.state.tournament;
  };



  calculateMatchups = (s, e) => {
    if (this.state.tournamentType === 0) {
      this.setState(SwissBuchholtzTB.bind(this)(s, e));
    } else if (this.state.tournamentFormat === "KNOCKOUT") {
      this.setState(Knockout.bind(this)(s, e));
    } else {

    }
  };

  componentDidMount() {
    this.setWinner = setWinner.bind(this);
    this.shuffle = shuffle.bind(this);
    this.init(2);

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


    // fetch('https://score-service.deta.dev/fetch_results/event_19')
    //   .then((resp) => resp.json())
    //   .then((resp) => {
    //     this._scores = {
    //       0: resp[1],
    //       1: resp[2],
    //       2: resp[3],
    //     };
    //     this.setState({scores: this._scores[tStage]})
    //     // this.state.score = resp[tStage];
    //   }).then(
    //     () => this.calculateMatchups(0, this.state.rounds + 1)
    //   );

    // fetch('https://d8nswj.deta.dev/stats_cached/19')
    //   .then((resp) => resp.json())
    //   .then((resp) => {
    //     this.setState({
    //       pickStats: resp,
    //     });
    //   });

  };


  advance = (_) => {
    let finalTeams;
    let { challengerResult } = this.state
    if (this.state.tournament === TournamentChallenger) {
      const teamsAdvanced = this.state.roundTeams[5].filter(x => x.adv).map((x, _idx) => ({
        ...x,
        description: `${x.l}L, ${x.buchholtz}B, #${x.seed}`,
        l: 0, w: 0, buchholtz: 0, seed: _idx + 9, opponents: [],
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
            title="PGL Antwerp Major 2022 Simulator"
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
          {
            this.state.tournament >= 1 && (
              <NextMajorSlot state={this.state} />
            )
          }
      </div>
    );
  }
}
