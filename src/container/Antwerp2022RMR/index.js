/* eslint-disable global-require */

import React from 'react';
import {Form, Image, Menu, Radio} from 'semantic-ui-react';
import {AME, EUA, EUB} from './initial_data';
import {ordinal} from "../../libs/plural";
import {plus_minus} from "../../libs/plus_minus";
import {Scores} from "./scores";
import GraphBuilder from '../../graphics/GraphBuilder';

const copy = (x) => JSON.parse(JSON.stringify(x));
const abbrevs = {
  "legend": "L",
  "challenger": "C",
  "contender": "O",
  "eliminated": "E",
}

const Regions = [
  {
    id: 0,
    name: "Americas",
    seeds: AME,
    seats: {
      legends: 1,
      challengers: 3,
      contenders: 6,
    },
    tiebreakers: {
      "3": [{teams: 1, id: "1/2", name: "1st/2nd Decider"}], // after round 3, 1st place and 2nd place,
      "5": [{teams: 7, id: "6/7/8", name: "8th Decider"}], // after round 5, 7th place and 8th place,
      "6": [{teams: 6, id: "6/7", name: "6th/7th Decider"}], // after round 6, 6th place and 7th place,
    },
    tiebreakerResults: {},
    rounds: 7,
  },
  {
    id: 1,
    name: "Europe A",
    seeds: EUA,
    seats: {
      legends: 4,
      challengers: 6,
      contenders: 8,
    },
    tiebreakers: {
      "4": [{teams: 4, id: "4/5", name: "4/5th Decider (Legend)"}],
    },
    rounds: 5,
  },
  {
    id: 2,
    name: "Europe B",
    seeds: EUB,
    seats: {
      legends: 3,
      challengers: 7,
      contenders: 8,
    },
    tiebreakers: {
      "4": [{teams: 3, id: "3/4", name: "3/4th Decider"}],
    },
    rounds: 5,
  },
];

const teamLogo = (code) => `https://major.ieb.im/images/antwerp2022_rmr/${code}.png`;

const getWinnerFromScore = (scores) => {
  let teamA = 0;
  let teamB = 0;
  for(const sco of scores) {
    if (sco[0] !== sco[1]) {
      if (sco[0] > 15 || sco[1] > 15) {
        if (sco[0] > sco[1]) {
          teamA ++;
        } else if (sco[1] > sco[0]) {
          teamB ++;
        }
      }
    }
  }
  return [teamA - teamB, Math.max(teamA, teamB)]
}


export default class Antwerp2022RMR extends React.PureComponent {
  state = {
    hideMatchUI: localStorage.hideMatchUI === "true" || false,
    hideDiagramUI: localStorage.hideDiagramUI === "true" || false,
    matchOnly: localStorage.matchOnly === "true" || false,
    eliminatedOnDiagram: localStorage.eliminatedOnDiagram === "true" || true,
    teams: [[], false, false, false, false, false],
    roundTeams: [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    ],
    matches: [false, false, false, false, false, false],
    regionId: 0,
    advanceMode: 1,
    legends: false,
    modified: true,
    scores: Scores,
    tiebreakers: {},
    tiebreakerResults: {},
    pickResults: {},
    seats: {
      legends: 0,
      challengers: 0,
      contenders: 0,
    },
    rounds: 0,
  };

  pack = (teams) => {
    return {
      teams: [
        teams.map(t => ({
          l: 0,
          w: 0,
          opponents: [],
          buchholz: 0,
          code: t.code,
          name: t.name,
          seed: t.seed,
          description: t.description,
          logo: teamLogo(t.code),
        })),
        false,
        false,
        false,
        false,
        false,
        false
      ],
      roundTeams: [],
      matches: [
        false,
        false,
        false,
        false,
        false,
        false,
      ]
    }
  }

  componentDidMount() {
    this.init(0)
  }

  init = (region) => {
    return fetch('https://score-service.deta.dev/fetch_results/ant21rmr')
      .then((resp) => resp.json())
      .then((resp) => {
        this.setState({
          ...this.pack(Regions[region].seeds),
          scores: resp,
          advanceMode: 1,
          regionId: region,
          modified: true,
          ...Regions[region],
        });
      }).then(
        () => this.calculateMatchups(0, this.state.rounds + 1)
      );
  };



  setWinner = (match, picked) => {
    if (match.picked === picked) return;
    const { pickResults } = this.state;
    pickResults[`${match.team1.code}-${match.team2.code}`] = picked;
    pickResults[`${match.team2.code}-${match.team1.code}`] = -picked;
    this.setState({ pickResults }, () => {
      this.calculateMatchups(0, this.state.rounds + 1)
    })
  };

  setTiebreakerWinner = (t1, t2) => {
    const tbc = t1.tiebreakerConfig;
    const tbr = this.state.tiebreakerResults;
    const gamescores = this.state.scores;

    if (`b-${t1.code}-${t2.code}` in gamescores) {
      const gs = gamescores[`b-${t1.code}-${t2.code}`];
      tbr[tbc.id] = [t1.code, t2.code, gs.map(x => x[0]), gs.map(x => x[1])];
    } else if (`b-${t2.code}-${t1.code}` in gamescores) {
      const gs = gamescores[`b-${t2.code}-${t1.code}`];
      tbr[tbc.id] = [t1.code, t2.code, gs.map(x => x[1]), gs.map(x => x[0])];
    } else {
      tbr[tbc.id] = [t1.code, t2.code, [], []];
    }


    this.setState({ tiebreakerResults: tbr}, () => {
      this.calculateMatchups(0, this.state.rounds + 1)
    });
  };

  calculateMatchups(fromStage, toStage) {

    const stateMatches = this.state.matches;
    const stateTeams = this.state.teams;
    const stateRoundTeams = copy(this.state.roundTeams);
    const { pickResults } = this.state;
    const gamescores = this.state.scores || {};


    let tiebreakers = this.state.tiebreakers;
    let tiebreakerResults = this.state.tiebreakerResults || {};

    const getStatus = standing => {
      if (standing <= this.state.seats.legends) return "legend";
      if (standing <= this.state.seats.challengers) return "challenger";
      if (standing <= this.state.seats.contenders) return "contender";
      return "eliminated";
    }

    let teams;
    let remaining;
    let stageMatches;

    const previouslyMatchedUp = (stage, tA, tB) => {
      for (let i = 0; i < stage; i += 1) {
        if (stateMatches[i]) {
          for (const match of stateMatches[i]) {
            if (match.team1.seed === tA && match.team2.seed === tB) return true;
            if (match.team2.seed === tA && match.team1.seed === tB) return true;
          }
        }
      }
      return false;
    }


    for(let stage = fromStage; stage < toStage; stage++) {
      const teamCompare = (x, y) => {
        if (y.l - x.l) return x.l - y.l;
        if (y.w - x.w) return y.w - x.w;

        if (x.w === 3 || x.l === 3) { // normal race over, go for tbs
          for(const s of Object.keys(tiebreakers)) {
            if (parseInt(s, 10) < stage) {
              for(const tb of tiebreakers[s]) {
                const tbr = tiebreakerResults[tb.id];
                if (tbr[0] === x.code && tbr[1] === y.code) {
                  return -1;
                }
                if (tbr[0] === y.code && tbr[1] === x.code) {
                  return 1;
                }
              }
            }
          }

        }

        if (y.buchholz - x.buchholz) return y.buchholz - x.buchholz;
        return x.seed - y.seed;
      };


      if (stage > 0) {
        const teamsT = stateTeams[stage - 1].filter((team) => team.w === 3 || team.l === 3);


        for (const match of stateMatches[stage - 1]) {
          const opponents1 = [...match.team1.opponents, match.team2.code];
          const opponents2 = [...match.team2.opponents, match.team1.code];

          if (match.picked === 1) {
            teamsT.push({ ...match.team1, opponents: opponents1, w: match.team1.w + 1 });
            teamsT.push({ ...match.team2, opponents: opponents2, l: match.team2.l + 1 });
          } else if (match.picked === -1) {
            teamsT.push({ ...match.team1, opponents: opponents1, l: match.team1.l + 1 });
            teamsT.push({ ...match.team2, opponents: opponents2, w: match.team1.w + 1 });
          }
        }

        const buchholzScore = {};
        for (const team of teamsT) {
          buchholzScore[team.code] = team.w - team.l;
        }
        for (const team of teamsT) {
          team.buchholz = team.opponents.map(x => buchholzScore[x]).reduce((x, y) => x+y, 0);
        }
        stateTeams[stage] = teamsT;
      }


      teams = stateTeams[stage].sort(teamCompare);

      remaining = teams.filter((x) => x.w < 3 && x.l < 3);

      const remainingTeams = copy(remaining);
      const matchups = [];
      const pools = Array.from(new Set(remainingTeams.map((t) => `${t.w}-${t.l}`))).sort((x, y) => {
        const ax = x.split('-');
        const ay = y.split('-');
        const vx = parseInt(ax[0], 10) * 10 - parseInt(ax[1], 10);
        const vy = parseInt(ay[0], 10) * 10 - parseInt(ay[1], 10);
        return vy - vx;
      });

      const dfs = (p, m, mref, pool) => {
        if (!p.length) {
          for (const match of m) {
            mref.push(match);
          }
          return true;
        }

        const team1 = p[0];
        const team2cands = p.filter((team) => {
          if (team.seed === team1.seed) return false;
          return !previouslyMatchedUp(stage, team.seed, team1.seed);
        });

        if (!team2cands.length) return false;

        for (let c = team2cands.length - 1; c >= 0; c -= 1) {
          const team2 = team2cands[c];
          const mat = [...m];
          let picked = team1.seed <= team2.seed ? 1 : -1; // 1 for A win and -1 for B win
          let result = 0;

          let score = [[], []];

          if (`${team1.code}-${team2.code}` in gamescores) {
            const gs = gamescores[`${team1.code}-${team2.code}`];
            score[0] = gs.map(x => x[0])
            score[1] = gs.map(x => x[1])
            const [winner, maxW] = getWinnerFromScore(gs);
            if (winner) {
              picked = winner > 0 ? 1 : -1;
              if (
                (team1.w < 2 && team1.l < 2) ||
                ((team1.w === 2 || team1.l === 2) && maxW === 2)
              ) {
                result = picked
              }
            }
          }

          if (`${team1.code}-${team2.code}` in pickResults) {
            picked = pickResults[`${team1.code}-${team2.code}`]
          }


          const _match = {
            pool,
            match: m.length,
            team1, team2,
            picked, result,
            score, stage,
            toggle: () => this.setWinner({picked, team1, team2}, -picked),
          };
          mat.push(_match);
          const nPoolTeams = copy(p.filter((x) => x.seed !== team1.seed && x.seed !== team2.seed));
          if (dfs(nPoolTeams, mat, mref, pool)) {
            return true;
          }
        }
        return false;
      };

      for (const pool of pools) {
        const poolTeams = remainingTeams.filter((team) => pool === `${team.w}-${team.l}`);
        dfs(poolTeams, [], matchups, pool);
      }

      stageMatches = matchups;
      stateMatches[stage] = stageMatches;

      const teamsSorted = teams.sort(teamCompare).map((x, idx) => ({...x, standing: idx+1}));

      stateRoundTeams[stage] = teamsSorted.map((x, idx) => {
        if (tiebreakers[stage]) {
          for (const tbs of tiebreakers[stage]) {
            // tbs.teams is the 1-based index
            const tb = tbs.teams === idx + 1 || tbs.teams === idx;
            if (tb) {
              let tbr = tiebreakerResults[tbs.id];
              const t1 = teamsSorted[tbs.teams - 1];
              const t2 = teamsSorted[tbs.teams];
              if (
                !tbr || !((tbr[0] === t1.code && tbr[1] === t2.code) || (tbr[0] === t2.code && tbr[1] === t1.code))
              ) {
                if (`b-${t1.code}-${t2.code}` in gamescores) {
                  const gs = gamescores[`b-${t1.code}-${t2.code}`];
                  const [winner, ] = getWinnerFromScore(gs);
                  tbr = tiebreakerResults[tbs.id] = winner > 0 ?
                    [t1.code, t2.code, gs.map(x => x[0]), gs.map(x => x[1])] :
                    [t2.code, t1.code, gs.map(x => x[1]), gs.map(x => x[0])];
                } else if (`b-${t2.code}-${t1.code}` in gamescores) {
                  const gs = gamescores[`b-${t2.code}-${t1.code}`];
                  const [winner, ] = getWinnerFromScore(gs);
                  tbr = tiebreakerResults[tbs.id] = winner < 0 ?
                    [t1.code, t2.code, gs.map(x => x[0]), gs.map(x => x[1])] :
                    [t2.code, t1.code, gs.map(x => x[1]), gs.map(x => x[0])];
                } else {
                  tbr = tiebreakerResults[tbs.id] = [t1.code, t2.code, [], []];
                }
              }

              const otherTeamId = tbs.teams === idx + 1 ? idx + 2 : idx;
              const otherTeam = tbs.teams === idx + 1 ? t2 : t1;
              const lostTeam = tbr[0] === x.code ? otherTeam : x;
              const winTeam = tbr[0] === x.code ? x : otherTeam;
              return ({
                ...x,
                standing: idx + 1,
                ordinalStanding: ordinal(idx+1),
                status: getStatus(idx+1),
                tiebreaker: true,
                tiebreakerStats: tbr[0] === x.code ? 1 : -1,
                tiebreakerScores: tbr[0] === x.code ? tbr[2]: tbr[3],
                tiebreakerOtherTeam: otherTeamId,
                tiebreakerConfig: tbs,
                elim: x.l === 3,
                adv: x.w === 3,
                currentRound: true,
                toggle: () => this.setTiebreakerWinner({
                  ...lostTeam,
                  tiebreakerConfig: tbs,
                }, winTeam),
              })
            }
          }
        }

        return ({
          ...x,
          standing: idx + 1,
          ordinalStanding: ordinal(idx+1),
          status: getStatus(idx+1),
          elim: x.l === 3,
          adv: x.w === 3,
          currentRound: x.w + x.l === stage,
        })
      });

    }

    this.setState({
      teams: stateTeams,
      tiebreakerResults,
      roundTeams: stateRoundTeams,
      matches: stateMatches,
    });

  }

  getMatchups(stage) {

    const stateMatches = this.state.matches;
    const stateRoundTeams = this.state.roundTeams;
    let { matchOnly, tiebreakerResults } = this.state;

    if (stage === this.state.rounds) matchOnly = false;


    const roundTeams = stateRoundTeams[stage];
    const stageMatches = stateMatches[stage];
    if (!roundTeams) return null;
    if (!stageMatches) return null;

    return (
      <div key={stage}>
        {roundTeams.filter(x => x.adv).filter(x => x.tiebreaker || !matchOnly).map((team, _) => (
          <div key={team.code} className={`team one ${team.status}`}>
            <div className="team-box up" style={
              team.tiebreaker ? { background: 'repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px)' } : {}
            }>
              <div className="team-box-split b">
                <span className="team-box-text">
                  {`${team.w}-${team.l}`} {team.tiebreaker && "TB"}
                </span>
              </div>
            </div>
            <div className="team-box down">
              <div className="team-box-split b" style={
                team.tiebreaker ? { background: 'repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px)' } : {}
              }>
                <span className="team-box-text">
                  {`${ordinal(team.standing)} (${abbrevs[team.status]})`}
                </span>
              </div>
            </div>
            {team.tiebreaker && team.tiebreakerScores && team.tiebreakerScores.map((p, idx) => (
              <div className="team-box down" key={idx + '_tbs'}>
                <div className="team-box-split b">
                      <span className={`team-box-text`}>
                        {p}
                      </span>
                </div>
              </div>
            ))}
            <div className="team-box med">
              {
                (team.tiebreaker) ? (
                  <div className={
                    `team-box-split b tb-${tiebreakerResults[team.tiebreakerConfig.id][0] === team.code ? "win" : "lose"}`
                  } onClick={() => this.setTiebreakerWinner(team, roundTeams[team.tiebreakerOtherTeam - 1])}>
                    <Image className="team-logo" src={teamLogo(team.code)} alt={team.name} title={team.name} />
                  </div>
                ) : (
                  <div className="team-box-split b">
                    <Image className="team-logo" src={teamLogo(team.code)} alt={team.name} title={team.name} />
                  </div>
                )
              }
            </div>
            <div className="team-box down">
              <div className="team-box-split b">
                <span className="team-box-text">#{team.seed}</span>
              </div>
            </div>
            {
              (stage >= 1 && this.state.advanceMode === 1) && (
                <>
                  <div className="team-box down">
                    <div className="team-box-split b">
                      <span className="team-box-text">{plus_minus(team.buchholz)}</span>
                    </div>
                  </div>
                  <div className="team-box down">
                    <div className="team-box-split b">
                <span className="team-box-text">
                  {
                    team.opponents.map(opp =>
                      <Image className="team-logo-small" src={teamLogo(opp)} alt={opp} title={opp} key={opp} />
                    )
                  }
                </span>
                    </div>
                  </div>
                </>
              )
            }
          </div>
        ))}

        {stageMatches.map((x) => {
          let pickA, pickB, resultA, resultB;
          if (x.picked === 1) {
            pickA = 'win';
            pickB = 'lose';
          } else if (x.picked === -1) {
            pickA = 'lose';
            pickB = 'win';
          }
          if (x.result === 1) {
            resultA = 'rs-win';
            resultB = 'rs-lose';
          } else if (x.result === -1) {
            resultA = 'rs-lose';
            resultB = 'rs-win';
          } else {
            resultA = '';
            resultB = '';
          }

          return (
            <div key={`match-${x.pool}-${x.match}`} className="team two">
              <div className="team-box up" style={{ background: `hsla(${100.0 * x.team1.w / (x.team1.w + x.team1.l)}, 100%, 50%, 0.5)` }}>
                <div className="team-box-split b">
                  <span className="team-box-text">{x.pool}</span>
                </div>
              </div>
              {this.state.scores && x.score[0].map((p, idx) => (
                <div className="team-box down" key={idx}>
                  <div className="team-box-split b">
                      <span className={`team-box-text ${x.score[0][idx] < x.score[1][idx] ? 'lose' :
                        x.score[1][idx] < x.score[0][idx] ? 'win' : ''}`}>
                        {x.score[0][idx]}
                      </span>
                  </div>
                  <div className="team-box-split b">
                      <span className={`team-box-text ${x.score[1][idx] < x.score[0][idx] ? 'lose' :
                        x.score[0][idx] < x.score[1][idx] ? 'win' : ''}`}>
                        {x.score[1][idx]}
                      </span>
                  </div>
                </div>
              ))}
              <div className="team-box med">
                <div className={`team-box-split b ${pickA} ${resultA}`} onClick={() => this.setWinner(x, 1)}>
                  <Image className="team-logo" src={teamLogo(x.team1.code)} alt={x.team1.name} title={x.team1.name} />
                </div>
                <div className={`team-box-split b ${pickB} ${resultB}`} onClick={() => this.setWinner(x, -1)}>
                  <Image className="team-logo" src={teamLogo(x.team2.code)} alt={x.team2.name} title={x.team2.name} />
                </div>
              </div>
              <div className="team-box down">
                <div className="team-box-split b">
                  <span className="team-box-text">#{x.team1.seed}</span>
                </div>
                <div className="team-box-split b">
                  <span className="team-box-text">#{x.team2.seed}</span>
                </div>
              </div>
              {
                stage >= 1 ? (this.state.advanceMode === 1) && (
                  <>
                    <div className="team-box down">
                      <div className="team-box-split b">
                        <span className="team-box-text">{plus_minus(x.team1.buchholz)}</span>
                      </div>
                      <div className="team-box-split b">
                        <span className="team-box-text">{plus_minus(x.team2.buchholz)}</span>
                      </div>
                    </div>
                    <div className="team-box down">
                      <div className="team-box-split b">
                  <span className="team-box-text">
                    {
                      x.team1.opponents.map(opp =>
                        <Image className="team-logo-small" src={teamLogo(opp)} alt={opp} key={opp}  />
                      )
                    }
                  </span>
                      </div>
                      <div className="team-box-split b">
                  <span className="team-box-text">
                    {
                      x.team2.opponents.map(opp =>
                        <Image className="team-logo-small" src={teamLogo(opp)} alt={opp} key={opp} />
                      )
                    }
                  </span>
                      </div>
                    </div>
                  </>
                ) : (

                  <div className="team-box down">
                    <div className="team-box-split b">
                      <span className="team-box-text descr">{x.team1.description}</span>
                    </div>
                    <div className="team-box-split b">
                      <span className="team-box-text descr">{x.team2.description}</span>
                    </div>
                  </div>
                )
              }
            </div>
          );
        })}
        {roundTeams.filter(x => x.elim).filter(x => x.tiebreaker || !matchOnly).map((team, _) => (
          <div key={team.code} className={`team one ${team.status}`}>
            <div className="team-box up">
              <div className="team-box-split b">
                <span className="team-box-text">
                  {team.w}-{team.l}
                </span>
              </div>
            </div>
            <div className="team-box down">
              <div className="team-box-split b">
                <span className="team-box-text">{ordinal(team.standing)} ({abbrevs[team.status]})</span>
              </div>
            </div>
            <div className="team-box med">
              <div className="team-box-split b">
                <Image className="team-logo" src={teamLogo(team.code)} alt={team.name} title={team.name} />
              </div>
            </div>
            <div className="team-box down">
              <div className="team-box-split b">
                <span className="team-box-text">#{team.seed}</span>
              </div>
            </div>
            {
              (this.state.advanceMode === 1) && stage >= 1 && (
                <>
                  <div className="team-box down">
                    <div className="team-box-split b">
                      <span className="team-box-text">{plus_minus(team.buchholz)}</span>
                    </div>
                  </div>
                  <div className="team-box down">
                    <div className="team-box-split b">
                <span className="team-box-text">
                  {
                    team.opponents.map(opp =>
                      <Image className="team-logo-small" src={teamLogo(opp)} alt={opp} title={opp} key={opp} />
                    )
                  }
                </span>
                    </div>
                  </div>
                </>
              )
            }
          </div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div className="outer">
        <div className="page-container">
          <div className="title-container">
            <h1 className="title">PGL Antwerp RMR 2022 Matchup Calculator</h1>
          </div>
          <p>
            <a href="https://www.reddit.com/r/GlobalOffensive/comments/qef216/the_matchup_simulator_again/">
              reddit thread
            </a>
            <span style={{ margin: 10 }}>·</span>
            <a href="https://discord.gg/KYNbRYrZGe">
              discord server
            </a>
            <span style={{ margin: 10 }}>·</span>
            <a href="https://twitter.com/intent/tweet?text=Major Matchup Calculator @ https://major.ieb.im/ by @CyberHono">
              tweet
            </a>
            <span style={{ margin: 10 }}>·</span>
            <a href="https://steamcommunity.com/id/iebbbb">
              steam profile
            </a>
          </p>
          <div style={{ marginTop: 20 }}>
            <Menu pointing secondary inverted compact size="huge" style={{ border: 'none' }}>
              {
                Regions.map(region => (
                  <Menu.Item
                    key={region.id}
                    name={region.name}
                    active={this.state.regionId === region.id}
                    onClick={() => this.init(region.id)}
                  />
                ))
              }
            </Menu>
            <Form style={{ marginTop: 20 }} inverted>
              <Form.Field>
                <div style={{ margin: 10, display: "inline-block" }}>
                  <Radio toggle onChange={
                    (e, {checked}) =>
                    {
                      this.setState({ matchOnly: checked })
                      localStorage.matchOnly = checked
                    }
                  } label="Matches Only" checked={this.state.matchOnly} />
                </div>
                <div style={{ margin: 10, display: "inline-block" }}>
                  <Radio toggle onChange={
                    (e, {checked}) =>
                    {
                      this.setState({ hideMatchUI: checked })
                      localStorage.hideMatchUI = checked
                    }
                  } label="Hide Match UI" checked={this.state.hideMatchUI} />
                </div>
                <div style={{ margin: 10, display: "inline-block" }}>
                  <Radio toggle onChange={
                    (e, {checked}) =>
                    {
                      this.setState({ hideDiagramUI: checked })
                      localStorage.hideDiagramUI = checked
                    }
                  } label="Hide Diagram UI" checked={this.state.hideDiagramUI} />
                </div>
              </Form.Field>
            </Form>
          </div>
          {
            !this.state.hideMatchUI && (
              <div className="main-container">
                {Array.from(Array(this.state.rounds + 1).keys()).map((round) => (
                  <>
                    <h1 className="round-title" key={round}>
                      {round === (this.state.rounds) ? `Final Results` : `Round ${round + 1}`}
                    </h1>
                    <div key={"_" + round}>{this.getMatchups(round)}</div>
                  </>
                ))}
              </div>
            )
          }
          {
            !this.state.hideDiagramUI && (
              <div className="main-container">
                <h1 className="round-title">
                  Diagram
                </h1>
                <Form style={{ marginTop: 20 }} inverted>
                  <Form.Field>
                    <div style={{ margin: 10, display: "inline-block" }}>
                      <Radio toggle onChange={
                        (e, {checked}) =>
                        {
                          this.setState({ eliminatedOnDiagram: checked })
                          localStorage.eliminatedOnDiagram = checked
                        }
                      } label="Show Eliminated" checked={this.state.eliminatedOnDiagram} />
                    </div>
                    <div style={{ margin: 10, display: "inline-block" }}>
                      <Radio toggle onChange={
                        (e, {checked}) =>
                        {
                          this.setState({ straightCorner: checked })
                          localStorage.straightCorner = checked
                        }
                      } label="Straight Corners" checked={this.state.straightCorner} />
                    </div>
                    <div style={{ margin: 10, display: "inline-block" }}>
                      <Radio toggle onChange={
                        (e, {checked}) =>
                        {
                          this.setState({ tight: checked })
                          localStorage.tight = checked
                        }
                      } label="Vertical Overlapping" checked={this.state.tight} />
                    </div>
                  </Form.Field>
                </Form>
                <div className="main-container" style={{ overflowX: "scroll" }}>
                  <GraphBuilder
                    data={this.state}
                    eliminatedOnDiagram={this.state.eliminatedOnDiagram}
                    straightCorner={this.state.straightCorner}
                    tight={this.state.tight}
                  />
                </div>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}
