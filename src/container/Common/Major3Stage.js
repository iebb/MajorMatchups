import {PaperAirplaneIcon, QuestionMarkCircleIcon, TrophyIcon, UserGroupIcon} from "@heroicons/react/24/outline";
import React from 'react';
import Title from "../../components/BannerInsertion";
import {BasicUI} from "../../components/BasicUI";
import {NextMajorSlot} from "../../components/NextMajorSlot";

import {AdvanceElimSeats, packTeam, setWinner, shuffle} from "../../libs/common/common";
import {FormatBinder} from "../../libs/common/formats/formats";
import {getPickResults, setPickResults} from "../../libs/common/storage";


export const TournamentChallenger = 0;
export const TournamentLegends = 1;
export const TournamentChampions = 2;

export class Major3Stage extends React.Component {
  nextMajorSlot = true;

  state = {
    teams: [[], false, false, false, false, false],
    roundTeams: [[],[],[],[],[],[],[],[],[],],
    matches: [false, false, false, false, false, false],
    tournament: 0,
    tournamentType: 0,
    legends: false,
    scores: {},
    tiebreakers: {},
    tiebreakerResults: {},
    pickResults: {}, // getPickResults('pickResults', 0, this.event),
    lockResults: {},
    seats: AdvanceElimSeats,
    rounds: 0,
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
  };

  getTab = () => {
    return this.state.tournament;
  };

  calculateMatchups = (s, e) => {
    this.setState(FormatBinder[this.state.tournamentType].bind(this)(s, e));
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
      finalTeams = [
        ...this.TournamentStages[1].initialTeams, // directly to legends
        ...teamsAdvanced
      ];
      // setPickResults('pickResults', 0, this.event, this.state.pickResults);
    } else if (this.state.tournament === TournamentChampions) {
      finalTeams = getPickResults('teams', 1, this.event);
    }

    if (finalTeams) {
      this.setState({
        ...this.TournamentStages[1],
        ...packTeam(finalTeams),
        challengerResult,
        scores: this._scores[TournamentLegends],
        // pickResults: getPickResults('pickResults', 1, this.event),
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

      // console.log(teamsAdvanced.map(x => ({
      //   code: x.code,
      //   name: x.name,
      //   seed: x.seed,
      //   region: x.region,
      //   description: x.description,
      // })));

      legendResult = this.state.roundTeams[5];
      // setPickResults('pickResults', 1, this.event, this.state.pickResults);
      setPickResults('teams', 1, this.event, this.state.teams[0]);
      this.setState({
        ...this.TournamentStages[2],
        ...packTeam(teamsAdvanced),
        legendResult,
        scores: this._scores[TournamentChampions],
        // pickResults: getPickResults('pickResults', 2, this.event),
      }, () => {
        this.calculateMatchups(0, this.state.rounds + 1)
      });
    }

  };

  init = (tStage) => {
    const stageConfig = this.TournamentStages[tStage];
    this.setState({
      ...stageConfig,
      ...packTeam(stageConfig.teams),
      scores: this._scores[tStage],
      // pickResults: getPickResults('pickResults', tStage, this.event),
    }, () => {
      this.calculateMatchups(0, this.state.rounds + 1)
    });

  };

  recalculate = (conflictPicks = true) => {
    this.setState({
      scores: this._scores[this.state.tournament]
    }, () => {
      this.calculateMatchups(0, this.state.rounds + 1)
    });

    /*
    if (conflictPicks) {
      const pickResults = getPickResults('pickResults', this.state.tournament, this.event);
      for(const s of Object.keys(this._scores[this.state.tournament])) {
        try {
          const ssp = s.split("-");
          delete pickResults[ssp[1] + "-" + ssp[0]];
        } catch {

        }
        delete pickResults[s];
      }
      setPickResults('pickResults', this.state.tournament, this.event, pickResults);
      console.log("clearing", this.state.tournament);
      if (this.state.tournament > 0) {
        for(let i = 0; i < this.state.tournament; i++) {
          console.log("clearing", i);
          setPickResults('pickResults', i, this.event, {});
        }
      }



      this.setState({
        scores: this._scores[this.state.tournament],
        pickResults
      }, () => {
        this.calculateMatchups(0, this.state.rounds + 1)
      });

    } else {
      this.setState({
        scores: this._scores[this.state.tournament]
      }, () => {
        this.calculateMatchups(0, this.state.rounds + 1)
      });
    }

     */

  }

  componentDidMount() {
    if (this.loadScores) {
      this.loadScores().then(() => {
        this.init(this.currentStage);
      });
    } else {
      this.init(this.currentStage);
    }
    this.setWinner = setWinner.bind(this);
    this.shuffle = shuffle.bind(this);
  }

  render() {
    const icons = [
      UserGroupIcon,
      PaperAirplaneIcon,
      TrophyIcon,
      QuestionMarkCircleIcon,
    ];
    const tabs = [
      ...this.TournamentStages.filter(x => (x.id <= this.currentStage + 1 || x.id <= this.state.tournament + 1)).map(ts => (
        {
          value: ts.id,
          label: ts.name,
          active: this.state.tournament === ts.id,
          icon: icons[ts.id],
          onClick:() => ts.id <= this.currentStage ? this.init(ts.id) : {
            1: this.advance,
            2: this.advance2,
          }[ts.id]()
        }
      )),
    ]
    return (
      <div className="page-container">
        <Title
          title={this.title}
          isMajor
        />
        <BasicUI
          tabs={tabs}
          state={this.state}
          stage={this.getTab()}
          shuffle={this.shuffle}
          advance={
            {
              1: this.advance,
              2: this.advance2,
            }[this.state.tournament + 1]
          }
        />
        {
          // this.nextMajorSlot && (
          //   <NextMajorSlot state={this.state} />
          // )
        }
      </div>
    );
  }
}
