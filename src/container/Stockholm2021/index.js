/* eslint-disable global-require */

import React from 'react';
import { Image } from 'semantic-ui-react';
import { initialData } from './initial_data';

const copy = (x) => JSON.parse(JSON.stringify(x));

const TournamentChallenger = 1;
// const TournamentLegends = 2;

let results = {};
let gamescores = {};

const teamLogo = (code) => `/images/stockh2021/${code}.png`;

export default class Stockholm2021 extends React.PureComponent {
  state = {
    teams: initialData.teams,
    matches: initialData.matches,
    tournament: 3,
    legends: false,
    modified: true,
    scores: [],
  };

  init = (_) => {
    results = {};
    gamescores = {};
    fetch('https://major.ieb.im/api/?scores=18')
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp["1"]) {
          const scores = resp["1"];
          for (const key of Object.keys(scores)) {
            const val = scores[key];
            gamescores[key] = val;
            let key2 = key.split('-');
            gamescores[key2[1] + '-' + key2[0]] = val.map(vals => [vals[1], vals[0]]);
          }
          this.setState({
            teams: initialData.teams,
            matches: [false, false, false, false, false, false],
            tournament: 3,
            legends: false,
            modified: true,
            scores: true,
          });
        }
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
      teams = stateTeams[stage].sort((x, y) => {
        if (x.buchholz !== y.buchholz) {
          return y.buchholz - x.buchholz;
        }
        return x.seed - y.seed;
      });
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
            let picked = team1.seed <= team2.seed ? 1 : -1; // 1 for A win and -1 for B win
            if (Math.random() < 0.2) {
              picked *= -1;
            }
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
              let teamA = 0;
              let teamB = 0;
              const gs = gamescores[`${team1.code}-${team2.code}`];
              console.log(`${team1.code}-${team2.code}`, gs);
              for(const sco of gs) {
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
              score[0] = gs.map(x => `${x[0]}`).join(" / ")
              score[1] = gs.map(x => `${x[1]}`).join(" / ")
              if (teamA !== teamB) {
                picked = teamA > teamB ? 1 : -1;
                result = picked
              }
            }


            mat.push({ pool, match: m.length, team1, team2, picked, result, score });
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
      teams = stateTeams[stage].sort((x, y) => x.buchholz - y.buchholz);
    }


    const elim = teams.filter((x) => x.l === 3).sort((x, y) => y.w - x.w);
    const adv = teams.filter((x) => x.w === 3).sort((x, y) => -y.l + x.l);



    const setWinner = (match, picked) => {
      if (match.picked === picked) return;
      // if (match.result) return;

      stageMatches = stageMatches.map((y) =>
        y.match !== match.match || y.pool !== match.pool ? y : { ...y, picked },
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
                <span className="team-box-text">#{team.seed}</span>
              </div>
            </div>
            <div className="team-box down">
              <div className="team-box-split b">
                <span className="team-box-text">ADV</span>
              </div>
            </div>
            {
              stage >= 1 && (
                <>
                  <div className="team-box down">
                    <div className="team-box-split b">
                      <span className="team-box-text">{team.buchholz} B</span>
                    </div>
                  </div>
                  <div className="team-box down">
                    <div className="team-box-split b">
                <span className="team-box-text">
                  {
                    team.opponents.map(opp =>
                      <Image className="team-logo-small" src={teamLogo(opp)} alt={opp} title={opp} />
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
              {this.state.scores && (
                <>
                  <div className="team-box down">
                    <div className="team-box-split b">
                      <span className={`team-box-text ${x.result < 0 ? 'lose' : x.result > 0 ? 'win' : ''}`}>
                        {x.score[0]}
                      </span>
                    </div>
                    <div className="team-box-split b">
                      <span className={`team-box-text ${x.result > 0 ? 'lose' : x.result < 0 ? 'win' : ''}`}>
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
                  <span className="team-box-text">#{x.team1.seed}</span>
                </div>
                <div className="team-box-split b">
                  <span className="team-box-text">#{x.team2.seed}</span>
                </div>
              </div>
              {
                stage >= 1 && (
                  <>
                    <div className="team-box down">
                      <div className="team-box-split b">
                        <span className="team-box-text">{x.team1.buchholz} B</span>
                      </div>
                      <div className="team-box-split b">
                        <span className="team-box-text">{x.team2.buchholz} B</span>
                      </div>
                    </div>
                    <div className="team-box down">
                      <div className="team-box-split b">
                  <span className="team-box-text">
                    {
                      x.team1.opponents.map(opp =>
                        <Image className="team-logo-small" src={teamLogo(opp)} alt={opp}  />
                      )
                    }
                  </span>
                      </div>
                      <div className="team-box-split b">
                  <span className="team-box-text">
                    {
                      x.team2.opponents.map(opp =>
                        <Image className="team-logo-small" src={teamLogo(opp)} alt={opp} />
                      )
                    }
                  </span>
                      </div>
                    </div>
                  </>
                )
              }
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
                <span className="team-box-text">#{team.seed}</span>
              </div>
            </div>
            <div className="team-box down">
              <div className="team-box-split b">
                <span className="team-box-text">ELIM</span>
              </div>
            </div>
            {
              stage >= 1 && (
                <>
                  <div className="team-box down">
                    <div className="team-box-split b">
                      <span className="team-box-text">{team.buchholz} B</span>
                    </div>
                  </div>
                  <div className="team-box down">
                    <div className="team-box-split b">
                <span className="team-box-text">
                  {
                    team.opponents.map(opp =>
                      <Image className="team-logo-small" src={teamLogo(opp)} alt={opp} title={opp} />
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
            <h1 className="title">PGL Stockholm Major 2021 Matchup Calculator</h1>
            <h3 className="title">Pick your Winner and get the Matchups!</h3>
          </div>
          <p style={{ fontSize: "150%" }}>
            <a href="https://press.pglesports.com/161255-the-buchholz-system-will-replace-the-tie-breaker-system-during-the-challengers-and-legends-stages">
              UPDATED - The Buchholtz System</a>
          </p>
          <p style={{ fontSize: "150%" }}>
            Buchholtz score is displayed below the seed.
          </p>
          <p>match results might be messed up due to the GOTV bug, live scores should work after Valve fixes the in-game GOTV</p>
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
          </p>
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
                <div key={"_" + round}>{this.getMatchUps(round)}</div>
              </>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
