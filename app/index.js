/* eslint-disable global-require */

import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Button, Divider, Image } from 'semantic-ui-react';

const AppWrapper = styled.div`
  max-width: 95%;
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

const copy = x => JSON.parse(JSON.stringify(x));

const a = 0.021753748235229346;
const h = 4.390432425972247;
const x0 = 18;
const w = 9.28979408575035;

const qa = 0.684356436340377;
const qb = 0.13764045664874308;
const qc = 0.011391235484420453;
const qd = 0.0002490984538751953;
const qe = -0.000024713775867179225;
const qf = -0.000001256769333477871;

const challengers = [
  { type: 'graffiti', seed: 1, name: 'Fnatic', code: 'fntc', elo: 1.79, w: 0, l: 0 },
  { type: 'graffiti', seed: 2, name: 'NRG Esports', code: 'nrg', elo: 2.46, w: 0, l: 0 },
  { type: 'graffiti', seed: 3, name: 'Cloud9', code: 'c9', elo: 3.29, w: 0, l: 0 },
  { type: 'graffiti', seed: 4, name: 'Ninjas in Pyjamas', code: 'nip', elo: 3.33, w: 0, l: 0 },
  { type: 'graffiti', seed: 5, name: 'ENCE', code: 'ence', elo: 3.91, w: 0, l: 0 },
  { type: 'graffiti', seed: 6, name: 'Vitality', code: 'vita', elo: 6.0, w: 0, l: 0 },
  { type: 'graffiti', seed: 7, name: 'G2 Esports', code: 'g2', elo: 6.79, w: 0, l: 0 },
  { type: 'graffiti', seed: 8, name: 'AVANGAR', code: 'avg', elo: 8.15, w: 0, l: 0 },
  { type: 'graffiti', seed: 9, name: 'Renegades', code: 'ren', elo: 8.36, w: 0, l: 0 },
  { type: 'graffiti', seed: 10, name: 'Vega Squadron', code: 'vega', elo: 9.75, w: 0, l: 0 },
  { type: 'graffiti', seed: 11, name: 'TYLOO', code: 'tyl', elo: 9.85, w: 0, l: 0 },
  { type: 'graffiti', seed: 12, name: 'Team Spirit', code: 'spir', elo: 10.69, w: 0, l: 0 },
  { type: 'graffiti', seed: 13, name: 'FURIA Esports', code: 'furi', elo: 12.0, w: 0, l: 0 },
  { type: 'graffiti', seed: 14, name: 'Grayhound', code: 'gray', elo: 13.57, w: 0, l: 0 },
  { type: 'graffiti', seed: 15, name: 'Winstrike Team', code: 'wins', elo: 13.62, w: 0, l: 0 },
  { type: 'graffiti', seed: 16, name: 'ViCi Gaming', code: 'vici', elo: 14.07, w: 0, l: 0 },
];

const legends = [
  { type: 'foil', seed: 1, name: 'Astralis', code: 'astr', elo: 1, w: 0, l: 0 },
  { type: 'foil', seed: 2, name: 'Team Liquid', code: 'liq', elo: 2, w: 0, l: 0 },
  { type: 'foil', seed: 3, name: 'Natus Vincere', code: 'navi', elo: 3.5, w: 0, l: 0 },
  { type: 'foil', seed: 4, name: 'MIBR', code: 'mibr', elo: 3.67, w: 0, l: 0 },
  { type: 'foil', seed: 5, name: 'FaZe Clan', code: 'faze', elo: 3.79, w: 0, l: 0 },
  { type: 'foil', seed: 6, name: 'NRG Esports', code: 'nrg', elo: 5.31, w: 0, l: 0 },
  { type: 'foil', seed: 7, name: 'BIG', code: 'big', elo: 7.5, w: 0, l: 0 },
  { type: 'foil', seed: 8, name: 'ENCE eSports', code: 'ence', elo: 7.64, w: 0, l: 0 },
  { type: 'foil', seed: 9, name: 'Renegades', code: 'ren', elo: 9.62, w: 0, l: 0 },
  { type: 'foil', seed: 10, name: 'Team Vitality', code: 'vita', elo: 10, w: 0, l: 0 },
  { type: 'foil', seed: 11, name: 'Ninjas in Pyjamas', code: 'nip', elo: 10.67, w: 0, l: 0 },
  { type: 'foil', seed: 12, name: 'HellRaisers', code: 'hlr', elo: 11.62, w: 0, l: 0 },
  { type: 'foil', seed: 13, name: 'Cloud9', code: 'c9', elo: 11.71, w: 0, l: 0 },
  { type: 'foil', seed: 14, name: 'G2 Esports', code: 'g2', elo: 12.36, w: 0, l: 0 },
  { type: 'foil', seed: 15, name: 'AVANGAR', code: 'avg', elo: 13.15, w: 0, l: 0 },
  { type: 'foil', seed: 16, name: 'compLexity Gaming', code: 'col', elo: 15, w: 0, l: 0 },
];

const results = window.matchResults || [];

export default class App extends React.PureComponent {
  state = {
    teams: [copy(legends), false, false, false, false, false],
    matches: [false, false, false, false, false, false],
  };

  previouslyMatchedUp(stage, tA, tB) {
    for (let i = 0; i < stage; i += 1) {
      for (const match of this.state.matches[i]) {
        if (match.t1.seed === tA && match.t2.seed === tB) return true;
        if (match.t2.seed === tA && match.t1.seed === tB) return true;
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
      if (!stateTeams[stage]) {
        if (!stateMatches[stage - 1]) return false;

        const teamsT = stateTeams[stage - 1].filter(team => team.w === 3 || team.l === 3);

        for (const match of stateMatches[stage - 1]) {
          const x = (match.t1.elo - match.t2.elo) * (match.result === 0 ? 1 : -1);
          // const exchange = a + h * Math.exp((-(x - x0) * (x - x0)) / (2 * w * w));
          const exchange = ((((qf * x + qe) * x + qd) * x + qc) * x + qb) * x + qa;
          if (match.result === 0) {
            teamsT.push({ ...match.t1, elo: match.t1.elo - exchange, w: match.t1.w + 1 });
            teamsT.push({ ...match.t2, elo: match.t2.elo + exchange, l: match.t2.l + 1 });
          } else {
            teamsT.push({ ...match.t1, elo: match.t1.elo + exchange, l: match.t1.l + 1 });
            teamsT.push({ ...match.t2, elo: match.t2.elo - exchange, w: match.t1.w + 1 });
          }
        }
        stateTeams[stage] = teamsT;
      }
      teams = stateTeams[stage].sort((x, y) => x.elo - y.elo);
      remaining = teams.filter(x => x.w < 3 && x.l < 3);
      const remainingTeams = copy(remaining);
      const matchups = [];
      const pools = Array.from(new Set(remainingTeams.map(t => `${t.w}-${t.l}`))).sort((x, y) => {
        const ax = x.split('-');
        const ay = y.split('-');
        const vx = parseInt(ax[0], 10) * 10 - parseInt(ax[1], 10);
        const vy = parseInt(ay[0], 10) * 10 - parseInt(ay[1], 10);
        return vy - vx;
      });

      for (const pool of pools) {
        const poolTeams = remainingTeams.filter(team => pool === `${team.w}-${team.l}`);

        const dfs = (p, m, mref) => {
          if (!p.length) {
            for (const match of m) {
              mref.push(match);
            }
            return true;
          }

          const teamA = p[0];
          const teamBcands = p.filter(team => {
            if (team.seed === teamA.seed) return false;
            return !this.previouslyMatchedUp(stage, team.seed, teamA.seed);
          });

          if (!teamBcands.length) return false;
          for (let c = teamBcands.length - 1; c >= 0; c -= 1) {
            const teamB = teamBcands[c];
            const mat = copy(m);
            let matchResult = teamA.elo >= teamB.elo ? 1 : 0;
            let isFinished = 0;
            if (teamA.type === 'foil') {
              if (`${teamA.code}-${teamB.code}` in results) {
                matchResult = results[`${teamA.code}-${teamB.code}`];
                isFinished = 1;
              } else if (`${teamB.code}-${teamA.code}` in results) {
                matchResult = 1 - results[`${teamB.code}-${teamA.code}`];
                isFinished = 1;
              }
            }
            mat.push({ match: m.length, t1: teamA, t2: teamB, result: matchResult, pool, isFinished, matchResult });
            const nPoolTeams = copy(p.filter(x => x.seed !== teamA.seed && x.seed !== teamB.seed));
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
    const elimadv = teams.filter(x => x.w === 3 || x.l === 3).sort((x, y) => y.w * 5 - x.w * 5 - y.l + x.l);

    return (
      <div>
        {stageMatches.map(x => (
          <div
            key={`match-${x.pool}-${x.match}`}
            style={{
              float: 'left',
              width: 144,
              marginTop: 3,
              marginBottom: 3,
              marginLeft: 5,
              marginRight: 5,
            }}
          >
            <p style={{ textAlign: 'center' }}>
              <b>{x.pool} Pool</b>
            </p>
            <Button
              color={
                x.result === 0
                  ? x.isFinished && x.matchResult === x.result
                    ? 'teal'
                    : 'green'
                  : x.isFinished && x.matchResult === x.result
                    ? 'grey'
                    : null
              }
              style={{
                padding: 2,
                marginRight: 5,
                width: 64,
              }}
              onClick={() => {
                stageMatches = stageMatches.map(
                  y => (y.match !== x.match || y.pool !== x.pool ? y : { ...y, result: 0 }),
                );
                stateMatches[stage] = stageMatches;
                for (let p = stage + 1; p < 6; p += 1) {
                  stateTeams[p] = false;
                  stateMatches[p] = false;
                }
                this.setState({ teams: stateTeams, matches: stateMatches, refresh: true });
              }}
            >
              <Image
                src={require(`images/teams/${x.t1.code}_${x.t1.type}.png`)}
                alt={x.t1.name}
                size="medium"
                circular
              />
              {x.t1.elo.toFixed(2)}
            </Button>
            <Button
              color={
                x.result === 1
                  ? x.isFinished && x.matchResult === x.result
                    ? 'teal'
                    : 'green'
                  : x.isFinished && x.matchResult === x.result
                    ? 'grey'
                    : null
              }
              style={{
                width: 64,
                padding: 2,
              }}
              onClick={() => {
                stageMatches = stageMatches.map(
                  y => (y.match !== x.match || y.pool !== x.pool ? y : { ...y, result: 1 }),
                );
                stateMatches[stage] = stageMatches;
                for (let p = stage + 1; p < 6; p += 1) {
                  stateTeams[p] = false;
                  stateMatches[p] = false;
                }
                this.setState({ teams: stateTeams, matches: stateMatches, refresh: true });
              }}
            >
              <Image
                src={require(`images/teams/${x.t2.code}_${x.t2.type}.png`)}
                alt={x.t2.name}
                size="medium"
                circular
              />
              {x.t2.elo.toFixed(2)}
            </Button>
          </div>
        ))}
        {elimadv.map((team, idx) => (
          <div
            key={team.seed}
            style={{
              float: 'left',
              marginTop: 3,
              marginBottom: 3,
              marginLeft: idx % 2 ? 1 : 5,
              marginRight: idx % 2 ? 12 : 1,
            }}
          >
            <p style={{ textAlign: 'center' }}>
              <b>
                {team.w}-{team.l}
              </b>
            </p>
            <Button
              color={team.w === 3 ? 'blue' : 'red'}
              style={{
                width: 64,
                padding: 2,
              }}
            >
              <Image
                src={require(`images/teams/${team.code}_${team.type}.png`)}
                alt={team.name}
                size="medium"
                circular
              />
              {team.elo.toFixed(2)}
            </Button>
          </div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <AppWrapper>
        <Helmet titleTemplate="Elo Calculator" defaultTitle="Elo Calculator">
          <meta name="description" content="Elo Calculator" />
        </Helmet>

        <div style={{ marginTop: 15 }}>
          <h1>Katowice 2019 Elo Calculator</h1>
          <p>
            <Button
              size="tiny"
              onClick={() =>
                this.setState({
                  teams: [copy(legends), false, false, false, false, false],
                  matches: [false, false, false, false, false, false],
                })
              }
            >
              Legends
            </Button>
            <Button
              size="tiny"
              onClick={() =>
                this.setState({
                  teams: [copy(challengers), false, false, false, false, false],
                  matches: [false, false, false, false, false, false],
                })
              }
            >
              Challengers
            </Button>
          </p>
          <p>{window.messages || ''}</p>
          <p>
            <a href="https://www.reddit.com/r/GlobalOffensive/comments/asf1sc/made_a_katowice_matchup_simulator_based_on_my/">
              reddit thread
            </a>
            <span style={{ marginLeft: 10, marginRight: 10 }}>&middot;</span>
            <a href="https://twitter.com/intent/tweet?text=https://wa.vg/katowice/ by @CyberHono">tweet</a>
          </p>
        </div>
        <Divider />
        <h3
          style={{
            margin: 0,
          }}
        >
          Round 1
        </h3>
        <div>{this.getMatchUps(0)}</div>
        <Divider />
        <h3
          style={{
            margin: 0,
          }}
        >
          Round 2
        </h3>
        <div>{this.getMatchUps(1)}</div>
        <Divider />
        <h3
          style={{
            margin: 0,
          }}
        >
          Round 3
        </h3>
        <div>{this.getMatchUps(2)}</div>
        <Divider />
        <h3
          style={{
            margin: 0,
          }}
        >
          Round 4
        </h3>
        <div>{this.getMatchUps(3)}</div>
        <Divider />
        <h3
          style={{
            margin: 0,
          }}
        >
          Round 5
        </h3>
        <div>{this.getMatchUps(4)}</div>
        <Divider />
        <h3
          style={{
            margin: 0,
          }}
        >
          Final Results
        </h3>
        <div>{this.getMatchUps(5)}</div>
        <Divider />
        <div
          style={{
            margin: 10,
          }}
        >
          <p>by ieb (@CyberHono) &copy; 2019 | BTC: 31yFyuKKJBWV8pw5DvoYy8M3dK3uMjBzSF | Email: ieb@outlook.my</p>
        </div>
      </AppWrapper>
    );
  }
}
