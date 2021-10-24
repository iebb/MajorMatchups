/* eslint-disable global-require */

import React from 'react';
import { Image } from 'semantic-ui-react';
import { initialData } from './initial_data';

const copy = (x) => JSON.parse(JSON.stringify(x));

const TournamentChallenger = 1;
const TournamentLegends = 2;

const teams = [];

const HOST = process.env.NODE_ENV === 'development' ? 'https://berlin.wa.vg/' : ''; //https://major.ieb.im/' : '';

let results = {};
let gamescores = {};

const teamLogo = (code) => `https://major.ieb.im/images/stockh2021/${code}.png`;

export default class Stockholm2021 extends React.PureComponent {
  state = {
    teams: initialData.teams,
    matches: initialData.matches,
    tournament: 3,
    legends: false,
    modified: true,
    scores: [],
  };

  init = (tournament) => {
    results = {};
    gamescores = {};

    this.setState({
      teams: initialData.teams,
      matches: [false, false, false, false, false, false],
      tournament: 3,
      legends: false,
      modified: true,
      scores: [],
    });

    /*
    fetch(HOST + '/api/teams.php?tournament=' + tournament)
      .then((resp) => resp.json())
      .then((resp) => {
        const teams = resp.teams.map((team) => ({ ...team, w: 0, l: 0 }));
        let scores = false;
        if (resp.data) {
          let beforeRound = 0;
          for (const round of resp.data.matches) {
            if (round.length) {
              for (const match of round) {
                results[match.team1.code + '-' + match.team2.code] = match.result;
              }
            }
          }
        }
        if (resp.scores) {
          for (const key of Object.keys(resp.scores)) {
            const val = resp.scores[key];
            gamescores[key] = val;
            let key2 = key.split('-');
            gamescores[key2[1] + '-' + key2[0]] = [val[1], val[0]];
          }
          scores = true;
        }
        this.setState({
          teams: [teams, false, false, false, false, false],
          matches: [false, false, false, false, false, false],
          tournament: resp.tournament,
          legends: false,
          modified: false,
          scores,
        });
      });

    */
  };

  componentDidMount() {
    this.init(TournamentChallenger);
  }

  previouslyMatchedUp(stage, tA, tB) {
    for (let i = 0; i < stage; i += 1) {
      if (this.state.matches[i]) {
        for (const match of this.state.matches[i]) {
          if (match.team1.seed === tA && match.team2.seed === tB) return true;
          if (match.team2.seed === tA && match.team1.seed === tB) return true;
        }
      }
    }
    return false;
  }

  calculateDeltaElo = (team1, team2) => {
    return 0;
  };

  getMatchUps(stage) {
    const stateMatches = JSON.parse(JSON.stringify(this.state.matches));
    const stateTeams = JSON.parse(JSON.stringify(this.state.teams));
    let teams;
    let remaining;
    let stageMatches;
    if (this.state.refresh || !stateMatches[stage]) {

      if (stage > 0 && !stateTeams[stage]) {
        if (!stateMatches[stage - 1]) return false;

        const teamsT = stateTeams[stage - 1].filter((team) => team.w === 3 || team.l === 3);

        for (const match of stateMatches[stage - 1]) {
          const exchange = 0;
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

            let score = ['TBA', 'TBA'];
            /* played match */

            if (`${team1.code}-${team2.code}` in results) {
              result = results[`${team1.code}-${team2.code}`];
              if (result !== 0) {
                picked = result;
              }
            } else if (`${team2.code}-${team1.code}` in results) {
              result = -results[`${team2.code}-${team1.code}`];
              if (result !== 0) {
                picked = result;
              }
            }

            if (`${team1.code}-${team2.code}` in gamescores) {
              score = gamescores[`${team1.code}-${team2.code}`];
              if (score[0] !== score[1]) {
                picked = score[0] > score[1] ? 1 : -1;
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
      console.log("stateMatches", stateMatches);
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
      this.setState({ teams: stateTeams, matches: stateMatches, refresh: true, modified: true });
    };

    return (
      <div>
        {adv.map((team, idx) => (
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
                <Image className="team-logo" src={teamLogo(team.code)} alt={team.name} title={team.name} />
              </div>
            </div>
            <div className="team-box down">
              <div className="team-box-split b">
                <span className="team-box-text">#{team.elo}</span>
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
              {this.state.scores && (
                <>
                  <div className="team-box down">
                    <div className="team-box-split b">
                      <span className={`team-box-text ${x.deltaElo < 0 ? 'lose' : x.deltaElo > 0 ? 'win' : ''}`}>
                        {x.score[0]}
                      </span>
                    </div>
                    <div className="team-box-split b">
                      <span className={`team-box-text ${x.deltaElo > 0 ? 'lose' : x.deltaElo < 0 ? 'win' : ''}`}>
                        {x.score[1]}
                      </span>
                    </div>
                  </div>
                </>
              )}
              <div className="team-box med">
                <div className={`team-box-split b ${pickA} ${resultA}`} onClick={() => setWinner(x, 1)}>
                  <Image className="team-logo" src={teamLogo(x.team1.code)} alt={x.team1.name} title={x.team1.name} />
                </div>
                <div className={`team-box-split b ${pickB} ${resultB}`} onClick={() => setWinner(x, -1)}>
                  <Image className="team-logo" src={teamLogo(x.team2.code)} alt={x.team2.name} title={x.team2.name} />
                </div>
              </div>
              <div className="team-box down">
                <div className="team-box-split b">
                  <span className="team-box-text">#{x.team1.elo}</span>
                </div>
                <div className="team-box-split b">
                  <span className="team-box-text">#{x.team2.elo}</span>
                </div>
              </div>
            </div>
          );
        })}

        {elim.map((team, idx) => (
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
                <Image className="team-logo" src={teamLogo(team.code)} alt={team.name} title={team.name} />
              </div>
            </div>
            <div className="team-box down">
              <div className="team-box-split b">
                <span className="team-box-text">#{team.elo}</span>
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
      <div className="outer">
        <div className="page-container">
          <div className="title-container">
            <h1 className="title">PGL Major Stockholm 2021 Matchup Simulator</h1>
          </div>
          <p>Disclaimer: The matchup format hasn't been announced yet, and this website is only a seed-based one.</p>
          <p style={{ fontSize: "200%" }}>Correctness not guaranteed!</p>
          {
            /*

          <div style={{ marginTop: 50 }}>
            <Menu pointing secondary inverted compact size="huge" style={{ border: 'none' }}>
              <Menu.Item
                name="Challengers Stage"
                active={this.state.tournament === TournamentChallenger}
                onClick={() => this.init(TournamentChallenger)}
              />
              <Menu.Item
                name="Legends Stage with Your Pick"
                active={this.state.tournament === TournamentLegends}
                onClick={() => this.advance()}
              />
            </Menu>
          </div>
             */
          }
          <div className="main-container">
            {[0, 1, 2, 3, 4, 5].map((round) => (
              <>
                <h1 className="round-title" key={round}>
                  {round === 5 ? `Final Results` : `Round ${round + 1}`}
                </h1>
                <div>{this.getMatchUps(round)}</div>
              </>
            ))}
          </div>
          <div style={{ marginTop: 50, userSelect: 'text' }}>
            <p>
              by ieb (<a href="https://twitter.com/CyberHono">@CyberHono</a>) © 2019-21 | Email: ieb &lt;at&gt; outlook.my
              | 微博 <a href="https://www.weibo.com/jebwizoscar/">@电玩果</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
