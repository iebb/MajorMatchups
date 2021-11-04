/* eslint-disable global-require */

import React from 'react';
import { Image, Menu } from 'semantic-ui-react';
import { getRelativeSeed, rankingSeed } from './initial_seed';
import { FinalResults } from './final_results';

const copy = (x) => JSON.parse(JSON.stringify(x));

const qs = [0.7333, 0.1365, 1.065e-2, 2.69e-4, -2.078e-5, -1.549e-6, 4.29e-9, 1.831e-9];

const teams = [];

let results = {};
let gamescores = {};

const teamLogo = (code) => `/images/berlin2019/${code}.png`;

export default class Berlin2019 extends React.PureComponent {
  state = {
    teams: [copy(teams), false, false, false, false, false],
    matches: [false, false, false, false, false, false],
    elo: true,
    legends: false,
    scores: false,
  };

  init = (tournament) => {
    results = {};
    gamescores = {};

    fetch('https://major.ieb.im/api/?tournament=' + tournament)
      .then((resp) => resp.json())
      .then((resp) => {
        const teams = resp.teams.map((team) => ({ ...team, w: 0, l: 0 }));
        let scores = false;
        if (resp.data) {
          for (const round of resp.data.matches) {
            if (round.length) {
              for (const match of round) {
                results[match.team1.code + '-' + match.team2.code] = match.result;
              }
            }
          }
        }
        if (resp.scores) {
          for (const key of Object.keys(FinalResults[tournament])) {
            const val = FinalResults[tournament][key];
            gamescores[key] = val;
            let key2 = key.split('-');
            gamescores[key2[1] + '-' + key2[0]] = val.map(vals => [vals[1], vals[0]]);
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
  };

  restore = () => {
    if (this.savedData) {
      this.setState(JSON.parse(this.savedData));
    }
  };

  advance = () => {
    this.savedData = JSON.stringify(this.state);
    const advancedTeams = this.state.teams[5].filter((x) => x.w === 3).map((x) => x.code);
    const filtered = rankingSeed.filter((x) => x.length === 3 || advancedTeams.indexOf(x[0]) !== -1);
    const elos = getRelativeSeed(filtered);
    const teams = Object.keys(elos).map((team, idx) => ({
      seed: idx,
      name: team,
      code: team,
      elo: elos[team],
      w: 0,
      l: 0,
    }));
    results = {};
    this.setState({
      teams: [teams, false, false, false, false, false],
      matches: [false, false, false, false, false, false],
      refresh: true,
      legends: true,
    });
  };

  componentDidMount() {
    this.init(2);
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

  calculateDeltaElo = (team1, team2) => {
    const dElo = team1.elo - team2.elo;
    return qs.map((v, idx) => v * dElo ** idx).reduce((a, b) => a + b);
  };

  formatSign = (val) => (
    <>
      {val > 0 && '+'}
      {val.toFixed(2)}
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
          const exchange = qs.map((v, idx) => v * x ** idx).reduce((a, b) => a + b);
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
          return !this.previouslyMatchedUp(stage, team.seed, team1.seed);
        });

        if (!team2cands.length) return false;
        for (let c = team2cands.length - 1; c >= 0; c -= 1) {
          const team2 = team2cands[c];
          const mat = copy(m);
          // let picked = (Math.random() * (1.2**(team1.elo - team2.elo)) <= 0.5) ? 1 : -1; // 1 for A win and -1 for B win
          let picked = team1.elo <= team2.elo ? 1 : -1; // 1 for A win and -1 for B win
          let result = 0;

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


          let score = [['TBA'], ['TBA']];
          if (`${team1.code}-${team2.code}` in gamescores) {
            let teamA = 0;
            let teamB = 0;
            const gs = gamescores[`${team1.code}-${team2.code}`];
            console.log(gs);
            for(const sco of gs) {
              console.log("sco", sco);
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
                <Image className="team-logo" src={teamLogo(team.code)} alt={team.name} title={team.name} />
              </div>
            </div>
            <div className="team-box down">
              <div className="team-box-split b">
                <span className="team-box-text">{team.elo.toFixed(2)}</span>
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
                  <Image className="team-logo" src={teamLogo(x.team1.code)} alt={x.team1.name} title={x.team1.name} />
                </div>
                <div className={`team-box-split b ${pickB} ${resultB}`} onClick={() => setWinner(x, -1)}>
                  <Image className="team-logo" src={teamLogo(x.team2.code)} alt={x.team2.name} title={x.team2.name} />
                </div>
              </div>
              <div className="team-box down">
                <div className="team-box-split b">
                  <span className="team-box-text">{x.team1.elo.toFixed(2)}</span>
                </div>
                <div className="team-box-split b">
                  <span className="team-box-text">{x.team2.elo.toFixed(2)}</span>
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
                <Image className="team-logo" src={teamLogo(team.code)} alt={team.name} title={team.name} />
              </div>
            </div>
            <div className="team-box down">
              <div className="team-box-split b">
                <span className="team-box-text">{team.elo.toFixed(2)}</span>
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
            <h1 className="title">StarLadder Berlin Major 2019 Matchups</h1>
            <h2>
              <a href="https://www.twitch.tv/starladder_cs_en/squad">Twitch Stream</a>
            </h2>
            <p>
              <a href="https://www.reddit.com/r/GlobalOffensive/comments/ctaz3j/the_starladder_berlin_majors_matchup_simulator/">
                reddit thread
              </a>
              <span style={{ margin: 10 }}>·</span>
              <a href="https://twitter.com/intent/tweet?text=StarLadder Berlin Major ELO Calculator @ https://berlin.wa.vg/ by @CyberHono">
                tweet
              </a>
            </p>
            <p>Tip: Match outcomes can be changed by clicking on the Losing Team</p>
          </div>
          <div style={{ marginTop: 50 }}>
            <Menu pointing secondary inverted compact size="huge" style={{ border: 'none' }}>
              <Menu.Item name="Challengers Stage" active={this.state.tournament === 1} onClick={() => this.init(1)} />
              <Menu.Item
                name="Legends Stage"
                active={this.state.tournament === 2}
                onClick={() => this.init(2) /* this.advance() */}
              />
            </Menu>
          </div>
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
        </div>
      </div>
    );
  }
}
