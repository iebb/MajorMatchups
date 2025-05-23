import { PaperAirplaneIcon, QuestionMarkCircleIcon, TrophyIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import React from 'react';
import Title from '../../components/BannerInsertion';
import { BasicUI } from '../../components/BasicUI';

import {AdvanceElimSeats, pack, packTeam, setWinner, shuffle} from '../../libs/common/common';
import { FormatBinder } from '../../libs/common/formats/formats';
import { getPickResults, setPickResults } from '../../libs/common/storage';


export const TournamentStage1 = 0;
export const TournamentStage2 = 1;
export const TournamentStage3 = 2;
export const TournamentStage4 = 3;

export class Major4Stage extends React.Component {
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

  addTeamLogo = (t) => {
    if (this.teamLogo) {
      return t.map(x => ({
        logo: this.teamLogo(x.code),
        displayCode: x.code,
        ...x,
      }))
    } else {
      return t.map(x => ({
        displayCode: x.code,
        ...x,
      }))
    }
  }

  advance = (_) => {
    let finalTeams;
    let { challengerResult } = this.state
    if (this.state.tournament === TournamentStage1 && this.state.roundTeams[5]) {
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
      // console.log(finalTeams);
      // setPickResults('pickResults', 0, this.event, this.state.pickResults);
    } else if (this.state.tournament !== TournamentStage2) {
      finalTeams = getPickResults('teams', 1, this.event);
    }

    if (finalTeams) {
      this.setState({
        ...this.TournamentStages[1],
        ...packTeam(this.addTeamLogo(finalTeams)),
        challengerResult,
        scores: this._scores[TournamentStage2],
        // pickResults: getPickResults('pickResults', 1, this.event),
      }, () => {
        console.log(this.state);
        this.calculateMatchups(0, this.state.rounds + 1)
      });
    }
  };

  advance2 = (_) => {
    let finalTeams;
    let { legendResult } = this.state
    if (this.state.tournament === TournamentStage2 && this.state.roundTeams[5]) {
      const teamsAdvanced = this.state.roundTeams[5].filter(x => x.adv).map((x, _idx) => ({
        ...x,
        description: `${x.l}L, ${x.buchholtz}B, #${x.seed}`,
        l: 0, w: 0, buchholtz: 0, seed: _idx + 9, opponents: [],
        buchholtzBreakdown: [],
      }))

      legendResult = this.state.roundTeams[5];
      finalTeams = [
        ...this.TournamentStages[2].initialTeams, // directly to legends
        ...teamsAdvanced
      ];
      // setPickResults('pickResults', 1, this.event, this.state.pickResults);

      setPickResults('teams', 1, this.event, this.state.teams[0]);
    } else if (this.state.tournament !== TournamentStage3) {
      finalTeams = getPickResults('teams', 2, this.event);
    }

    this.setState({
      ...this.TournamentStages[2],
      ...packTeam(this.addTeamLogo(finalTeams)),
      legendResult,
      scores: this._scores[TournamentStage3],
      // pickResults: getPickResults('pickResults', 2, this.event),
    }, () => {
      console.log(this.state);
      this.calculateMatchups(0, this.state.rounds + 1)
    });

  };

  advance3 = (_) => {
    let { stage3Result } = this.state
    if (this.state.tournament === TournamentStage3 && this.state.roundTeams[5]) {
      const teamsAdvanced = this.state.roundTeams[5].filter(x => x.adv).map((x, _idx) => ({
        ...x,
        description: `${x.l}L, ${x.buchholtz}B, #${x.seed}`,
        l: 0, w: 0, buchholtz: 0, seed: _idx + 1, opponents: [],
        buchholtzBreakdown: [],
      }))
      //
      // console.log(teamsAdvanced.map(x => ({
      //   code: x.code,
      //   name: x.name,
      //   seed: x.seed,
      //   region: x.region,
      //   description: x.description,
      // })));

      stage3Result = this.state.roundTeams[5];
      // setPickResults('pickResults', 1, this.event, this.state.pickResults);
      setPickResults('teams', 2, this.event, this.state.teams[0]);
      this.setState({
        ...this.TournamentStages[3],
        ...packTeam(this.addTeamLogo(teamsAdvanced)),
        stage3Result,
        scores: this._scores[TournamentStage4],
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
      ...packTeam(this.addTeamLogo(stageConfig.teams)),
      scores: this.fetchedScore ? this.fetchedScore[tStage] : this._scores[tStage],
      matches_metadata: this.fetchedMatch ? this.fetchedMatch[tStage] : null,
      // pickResults: getPickResults('pickResults', tStage, this.event),
    }, () => {
      this.calculateMatchups(0, this.state.rounds + 1)
    });

    const fetchScores = (bypassCache = false) => {

      if (this.fetch_matches) {

        this.fetch_matches((matches_metadata) => {
          if (this.fetch_scores) {
            if (bypassCache || !this.fetchedScore) {
              this.fetch_scores((resp) => {
                this.fetchedScore = {...resp, ...this._scores};
                this.fetchedMatch = matches_metadata;
                this.setState({
                  ...stageConfig,
                  ...packTeam(this.addTeamLogo(stageConfig.teams)),
                  scores: {...resp[tStage], ...this._scores},
                  matches_metadata: matches_metadata[tStage],
                }, () => this.calculateMatchups(0, this.state.rounds + 1));
              });
            }
          }
        });

      } else {

        if (this.fetch_scores) {
          if (bypassCache || !this.fetchedScore) {
            this.fetch_scores((resp) => {
              this.fetchedScore = {...resp, ...this._scores};
              this.setState({
                ...stageConfig,
                ...packTeam(this.addTeamLogo(stageConfig.teams)),
                scores: {...resp[tStage], ...this._scores},
              }, () => this.calculateMatchups(0, this.state.rounds + 1));
            });
          }
        }
      }
    }

    fetchScores(false);

    if (window.timer) {
      clearInterval(window.timer);
    }

    window.autorefresh = () => {
      if (window.timer) {
        clearInterval(window.timer);
      }
      window.timer = setInterval(() => fetchScores(true), 15 * 1000);
    }

  };

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
            3: this.advance3,
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
              3: this.advance3,
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
