/* eslint-disable global-require */

import {PaperAirplaneIcon, UserGroupIcon} from "@heroicons/react/24/outline";
import {Tab, Tabs, TabsHeader} from "@material-tailwind/react";
import React from 'react';
import Title from '../../../components/BannerInsertion';
import {FinalResults} from './final_results';

const teamLogo = (code) => `https://img.majors.im/go/katowice2019/${code}.png`;


const copy = x => JSON.parse(JSON.stringify(x));

const qa = 0.684356436340377;
const qb = 0.13764045664874308;
const qc = 0.011391235484420453;
const qd = 0.0002490984538751953;
const qe = -0.000024713775867179225;
const qf = -0.000001256769333477871;



const challengers = [
  { type: 'graffiti', seed: 1, name: 'Fnatic', code: 'fntc', elo: 25/14, w: 0, l: 0 },
  { type: 'graffiti', seed: 2, name: 'NRG Esports', code: 'nrg', elo: 32/13, w: 0, l: 0 },
  { type: 'graffiti', seed: 3, name: 'Cloud9', code: 'c9', elo: 46/14, w: 0, l: 0 },
  { type: 'graffiti', seed: 4, name: 'Ninjas in Pyjamas', code: 'nip', elo: 50/15, w: 0, l: 0 },
  { type: 'graffiti', seed: 5, name: 'ENCE', code: 'ence', elo: 43/11, w: 0, l: 0 },
  { type: 'graffiti', seed: 6, name: 'Vitality', code: 'vita', elo: 6, w: 0, l: 0 },
  { type: 'graffiti', seed: 7, name: 'G2 Esports', code: 'g2', elo: 95/14, w: 0, l: 0 },
  { type: 'graffiti', seed: 8, name: 'AVANGAR', code: 'avg', elo: 106/13, w: 0, l: 0 },
  { type: 'graffiti', seed: 9, name: 'Renegades', code: 'ren', elo: 117/14, w: 0, l: 0 },
  { type: 'graffiti', seed: 10, name: 'Vega Squadron', code: 'vega', elo: 117/12, w: 0, l: 0 },
  { type: 'graffiti', seed: 11, name: 'TYLOO', code: 'tyl', elo: 128/13, w: 0, l: 0 },
  { type: 'graffiti', seed: 12, name: 'Team Spirit', code: 'spir', elo: 139/13, w: 0, l: 0 },
  { type: 'graffiti', seed: 13, name: 'FURIA Esports', code: 'furi', elo: 12, w: 0, l: 0 },
  { type: 'graffiti', seed: 14, name: 'Grayhound', code: 'gray', elo: 190/14, w: 0, l: 0 },
  { type: 'graffiti', seed: 15, name: 'Winstrike Team', code: 'wins', elo: 177/13, w: 0, l: 0 },
  { type: 'graffiti', seed: 16, name: 'ViCi Gaming', code: 'vici', elo: 197/14, w: 0, l: 0 },
];

const legends = [
  { type: 'foil', seed: 1, name: 'Astralis', code: 'astr', elo: 1, w: 0, l: 0 },
  { type: 'foil', seed: 2, name: 'Team Liquid', code: 'liq', elo: 2, w: 0, l: 0 },
  { type: 'foil', seed: 3, name: 'Natus Vincere', code: 'navi', elo: 3.5, w: 0, l: 0 },
  { type: 'foil', seed: 4, name: 'MIBR', code: 'mibr', elo: 55/15, w: 0, l: 0 },
  { type: 'foil', seed: 5, name: 'FaZe Clan', code: 'faze', elo: 53/14, w: 0, l: 0 },
  { type: 'foil', seed: 6, name: 'NRG Esports', code: 'nrg', elo: 69/13, w: 0, l: 0 },
  { type: 'foil', seed: 7, name: 'BIG', code: 'big', elo: 7.5, w: 0, l: 0 },
  { type: 'foil', seed: 8, name: 'ENCE eSports', code: 'ence', elo: 107/14, w: 0, l: 0 },
  { type: 'foil', seed: 9, name: 'Renegades', code: 'ren', elo: 125/13, w: 0, l: 0 },
  { type: 'foil', seed: 10, name: 'Team Vitality', code: 'vita', elo: 10, w: 0, l: 0 },
  { type: 'foil', seed: 11, name: 'Ninjas in Pyjamas', code: 'nip', elo: 160/15, w: 0, l: 0 },
  { type: 'foil', seed: 12, name: 'HellRaisers', code: 'hlr', elo: 151/13, w: 0, l: 0 },
  { type: 'foil', seed: 13, name: 'Cloud9', code: 'c9', elo: 164/14, w: 0, l: 0 },
  { type: 'foil', seed: 14, name: 'G2 Esports', code: 'g2', elo: 173/14, w: 0, l: 0 },
  { type: 'foil', seed: 15, name: 'AVANGAR', code: 'avg', elo: 171/13, w: 0, l: 0 },
  { type: 'foil', seed: 16, name: 'compLexity Gaming', code: 'col', elo: 15, w: 0, l: 0 },
];

let gamescores = {};

export default class Katowice2019 extends React.PureComponent {
  state = {
    teams: [false, false, false, false, false, false],
    matches: [false, false, false, false, false, false],
    elo: true,
    legends: false,
    scores: true,
    tournament: 2,
  };


  init(tournament) {
    for (const key of Object.keys(FinalResults[tournament])) {
      const val = FinalResults[tournament][key];
      gamescores[key] = val;
      let key2 = key.split('-');
      gamescores[key2[1] + '-' + key2[0]] = val.map(vals => [vals[1], vals[0]]);
    }
    this.setState({
      teams: [copy(tournament === 1 ? challengers : legends), false, false, false, false, false],
      matches: [false, false, false, false, false, false],
      tournament: tournament,
    })
  }

  componentDidMount() {
    this.init(1);
  }


  previouslyMatchedUp(stage, tA, tB) {
    for (let i = 0; i < stage; i += 1) {
      for (const match of this.state.matches[i]) {
        if (match.team1.seed === tA && match.team2.seed === tB) return true;
        if (match.team2.seed === tA && match.team1.seed === tB) return true;
      }
    }
    return false;
  }

  calculateDeltaEloX = (x) => {
    /*
    y_{1}\sim\frac{l}{1+ak^{x_{1}}}
    https://www.desmos.com/calculator/pljbjjix32
    l=4.98409
    a=6.28829
    k=0.793961
    */
    const l= 5;
    const a= 6.3;
    const k= 0.794;
    return l / (1 + a * Math.pow(k, x));
  };

  calculateDeltaElo = (team1, team2) => {
    return this.calculateDeltaEloX(team1.elo - team2.elo);
  };

  formatSign = (val) => (
    <>
      {val > 0 && '+'}
      {val.toFixed(3)}
    </>
  );

  getMatchUps(stage) {
    // console.log("calculating matchup for round", stage);
    const stateMatches = JSON.parse(JSON.stringify(this.state.matches));
    const stateTeams = JSON.parse(JSON.stringify(this.state.teams));
    let teams;
    let remaining;
    let stageMatches;
    if (this.state.refresh || !stateMatches[stage]) {
      if (!stateTeams[stage]) {
        if (!stateMatches[stage - 1]) return false;

        const teamsT = stateTeams[stage - 1].filter((team) => team.w === 3 || team.l === 3);

        for (const match of stateMatches[stage - 1]) {
          const x = (match.team1.elo - match.team2.elo) * match.picked;
          const exchange = this.calculateDeltaEloX(x);
          if (match.picked === 1) {
            teamsT.push({ ...match.team1, elo: match.team1.elo - exchange, w: match.team1.w + 1 });
            teamsT.push({ ...match.team2, elo: match.team2.elo + exchange, l: match.team2.l + 1 });
          } else if (match.picked === -1) {
            teamsT.push({ ...match.team1, elo: match.team1.elo + exchange, l: match.team1.l + 1 });
            teamsT.push({ ...match.team2, elo: match.team2.elo - exchange, w: match.team1.w + 1 });
          }
        }
        stateTeams[stage] = teamsT;
      }
      teams = stateTeams[stage].sort((x, y) => x.elo - y.elo);
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

      for (const pool of pools) {
        const poolTeams = remainingTeams.filter((team) => pool === `${team.w}-${team.l}`);

        const dfs = (p, m, mref) => {
          if (!p.length) {
            for (const match of m) {
              mref.push(match);
            }
            return true;
          }

          const team1 = p[0];
          const team2cands = p.filter((team) => {
            if (team.seed === team1.seed) return false;
            return !this.previouslyMatchedUp(stage, team.seed, team1.seed);
          });

          if (!team2cands.length) return false;
          for (let c = team2cands.length - 1; c >= 0; c -= 1) {
            const team2 = team2cands[c];
            const mat = copy(m);
            // let picked = (Math.random() * (1.2**(team1.elo - team2.elo)) <= 0.5) ? 1 : -1; // 1 for A win and -1 for B win
            let picked = team1.elo <= team2.elo ? 1 : -1; // 1 for A win and -1 for B win
            let result = 0;


            let score = [[], []];
            if (`${team1.code}-${team2.code}` in gamescores) {
              let teamA = 0;
              let teamB = 0;
              const gs = gamescores[`${team1.code}-${team2.code}`];
              for (const sco of gs) {
                if (sco[0] !== sco[1]) {
                  if (sco[0] > 15 || sco[1] > 15) {
                    if (sco[0] > sco[1]) {
                      teamA++;
                    } else if (sco[1] > sco[0]) {
                      teamB++;
                    }
                  }
                }
              }
              score[0] = gs.map(x => x[0])
              score[1] = gs.map(x => x[1])
              if (teamA !== teamB) {
                picked = teamA > teamB ? 1 : -1;
                if (((team1.w === 2 || team1.l === 2) && (teamA === 2 || teamB === 2)) || (team1.w < 2 && team1.l < 2)) {
                  result = picked
                }
              }
            }

            const deltaElo =
              picked === 1
                ? this.calculateDeltaElo(team1, team2)
                : picked === -1
                  ? -this.calculateDeltaElo(team2, team1)
                  : 0;

            mat.push({ pool, match: m.length, team1, team2, picked, result, deltaElo, score });
            const nPoolTeams = copy(p.filter((x) => x.seed !== team1.seed && x.seed !== team2.seed));
            if (dfs(nPoolTeams, mat, mref)) {
              return true;
            }
          }
          return false;
        };
        dfs(poolTeams, [], matchups);
      }
      stageMatches = matchups;
      stateMatches[stage] = stageMatches;
      this.setState({ teams: stateTeams, matches: stateMatches, refresh: false });
    } else {
      stageMatches = stateMatches[stage];
      teams = stateTeams[stage].sort((x, y) => x.elo - y.elo);
    }
    const elim = teams.filter((x) => x.l === 3).sort((x, y) => y.w - x.w);
    const adv = teams.filter((x) => x.w === 3).sort((x, y) => -y.l + x.l);

    const setWinner = (match, picked) => {
      if (match.picked === picked) return;
      // if (match.result) return;

      const deltaElo =
        picked === 1
          ? this.calculateDeltaElo(match.team1, match.team2)
          : picked === -1
            ? -this.calculateDeltaElo(match.team2, match.team1)
            : 0;

      stageMatches = stageMatches.map((y) =>
        y.match !== match.match || y.pool !== match.pool ? y : { ...y, picked, deltaElo },
      );
      stateMatches[stage] = stageMatches;
      for (let p = stage + 1; p < 6; p += 1) {
        stateTeams[p] = false;
        stateMatches[p] = false;
      }
      this.setState({ teams: stateTeams, matches: stateMatches, refresh: true });
    };

    return (
      <div>
        {adv.map((team, _) => (
          <div key={team.code} className="team one advanced">
            <div className="team-box up">
              <div className="team-box-split b">
                <span className="team-box-text">
                  {team.w}-{team.l}
                </span>
              </div>
            </div>
            <div className="team-box med">
              <div className="team-box-split b">
                <img className="team-logo" src={teamLogo(team.code)} alt={team.name} title={team.name} />
              </div>
            </div>
            <div className="team-box down">
              <div className="team-box-split b">
                <span className="team-box-text">{team.elo.toFixed(3)}</span>
              </div>
            </div>
            <div className="team-box down">
              <div className="team-box-split b">
                <span className="team-box-text">ADV</span>
              </div>
            </div>
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
              <div className="team-box up">
                <div className="team-box-split b">
                  <span className="team-box-text">{x.pool}</span>
                </div>
              </div>
              {x.score[0].map((p, idx) => (
                <>
                  <div className="team-box down">
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
                </>
              ))}
              <div className="team-box med">
                <div className={`team-box-split b ${pickA} ${resultA}`} onClick={() => setWinner(x, 1)}>
                  <img className="team-logo" src={teamLogo(x.team1.code)} alt={x.team1.name} title={x.team1.name} />
                </div>
                <div className={`team-box-split b ${pickB} ${resultB}`} onClick={() => setWinner(x, -1)}>
                  <img className="team-logo" src={teamLogo(x.team2.code)} alt={x.team2.name} title={x.team2.name} />
                </div>
              </div>
              <div className="team-box down">
                <div className="team-box-split b">
                  <span className="team-box-text">{x.team1.elo.toFixed(3)}</span>
                </div>
                <div className="team-box-split b">
                  <span className="team-box-text">{x.team2.elo.toFixed(3)}</span>
                </div>
              </div>
              <div className="team-box down" onClick={() => this.setState({ elo: !this.state.elo })}>
                <div className="team-box-split b">
                  <span className={`team-box-text ${x.deltaElo < 0 ? 'lose' : x.deltaElo > 0 ? 'win' : ''}`}>
                    {this.state.elo ? this.formatSign(-x.deltaElo) : (-x.deltaElo + x.team1.elo).toFixed(2)}
                  </span>
                </div>
                <div className="team-box-split b">
                  <span className={`team-box-text ${x.deltaElo > 0 ? 'lose' : x.deltaElo < 0 ? 'win' : ''}`}>
                    {this.state.elo ? this.formatSign(x.deltaElo) : (x.deltaElo + x.team2.elo).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {elim.map((team, _) => (
          <div key={team.code} className="team one eliminated">
            <div className="team-box up">
              <div className="team-box-split b">
                <span className="team-box-text">
                  {team.w}-{team.l}
                </span>
              </div>
            </div>
            <div className="team-box med">
              <div className="team-box-split b">
                <img className="team-logo" src={teamLogo(team.code)} alt={team.name} title={team.name} />
              </div>
            </div>
            <div className="team-box down">
              <div className="team-box-split b">
                <span className="team-box-text">{team.elo.toFixed(3)}</span>
              </div>
            </div>
            <div className="team-box down">
              <div className="team-box-split b">
                <span className="team-box-text">ELIM</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }


  render() {
    return (

        <div className="page-container">
          <Title
            title="IEM Katowice Major 2019 Simulator"
            sponsorLess
          />
          {/* Seeding: Teams rank each other */}
          <div className="pt-4">
            <div style={{ overflowX: "auto" }}>
              <Tabs
                key={this.state.tournament}
                value={this.state.tournament}
                id="tab"
                className="w-auto m-auto inline-block"
              >
                <TabsHeader className="whitespace-nowrap">
                  <Tab value={1} onClick={() => this.init(1)} className="w-auto">
                    <div className="flex items-center px-2">
                      {React.createElement(UserGroupIcon, { className: "w-5 h-5 mr-1" })}
                      Challengers Stage
                    </div>
                  </Tab>
                  <Tab value={2} onClick={() => this.init(2)} className="w-auto">
                    <div className="flex items-center px-2">
                      {React.createElement(PaperAirplaneIcon, { className: "w-5 h-5 mr-1" })}
                      Legends Stage
                    </div>
                  </Tab>
                </TabsHeader>
              </Tabs>
            </div>
          </div>
          <div className="main-container">
            {[0, 1, 2, 3, 4, 5].map((round) => (
              <>
                <h1 className="round-title" key={round}>
                  {round === 5 ? `Final Results` : `Round ${round + 1}`}
                </h1>
                <div key={`_${round}`}>{this.getMatchUps(round)}</div>
              </>
            ))}
          </div>
      </div>
    );
  }
}
