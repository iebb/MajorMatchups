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
import {PaperAirplaneIcon, TrophyIcon, UserGroupIcon} from '@heroicons/react/24/outline';

const TournamentChallenger = 0;
const TournamentLegends = 1;
const TournamentChampions = 2;

const teamLogo = (code) => `https://img.majors.im/go/paris2023/${code}_glitter_large.png?w=3`;


const TournamentStages = [
  {
    id: 0,
    ...pack(initialDataChallenger, teamLogo),
    name: "Challengers",
    determined: true,
    tournament: TournamentChallenger,
    tournamentType: 0,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    seats: AdvanceElimSeats,
    winsToAdvance: 3,
    losesToEliminate: 3,
    rounds: 5,
    pickemTags: ["picks_224"],
  },
  {
    id: 1,
    ...pack(finalDataLegends, teamLogo),
    name: "Legends",
    determined: false,
    tournament: TournamentLegends,
    tournamentType: 0,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    advanceMode: 1,
    seats: AdvanceElimSeats,
    winsToAdvance: 3,
    losesToEliminate: 3,
    rounds: 5,
    pickemTags: ["picks_225"],
  },
  {
    id: 2,
    ...pack(finalDataChampions, teamLogo),
    name: "Champions",
    determined: false,
    tournament: TournamentChampions,
    tournamentType: 2,
    tournamentFormat: "KNOCKOUT",
    advanceMode: 2,
    seats: ChampionSeats,
    losesToEliminate: 1,
    rounds: 3,
    pickemTags: [],
  },
];

export default class Paris2023 extends React.PureComponent {
  event = "23paris";
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
    losesToEliminate: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    event: "23paris",
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
    this.init(0);

    // fetch('https://result-api.majors.im/event_20.json')
    //   .then((resp) => resp.json())
    //   .then((resp) => {
    //     this._scores = {
    //       0: resp[1],
    //       1: resp[2],
    //       2: resp[3],
    //     };
    //     this.setState({scores: this._scores[this.state.tournament]}, () => {
    //       this.calculateMatchups(0, this.state.rounds + 1)
    //     });
    //   });
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
        losesToEliminate: 3,
        rounds: 5,
        pickemTags: [],
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
        losesToEliminate: 1,
        rounds: 3,
        pickemTags: [],
        legends: false,
        pickResults: getPickResults('pickResults', 2, this.event),
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

        <div className="page-container">
          <Title
            title="BLAST.tv Paris 2023 Major Simulator"
            isMajor
          />
          <BasicUI
            tabs={tabs}
            state={this.state}
            stage={this.getStage()}
            pickemTags={this.state.pickemTags}
            shuffle={this.shuffle}
            advance={
              this.state.tournament === 0 ? this.advance : this.state.tournament === 1 ? this.advance2 : null
            }
          />
          <NextMajorSlot state={this.state} />
      </div>
    );
  }
}
