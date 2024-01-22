import {ordinal} from '../../plural';
import {copy, getStatus, getWinnerFromScoreCS2} from '../common';

export function SwissBuchholtzTB_2024(fromStage, toStage, winnerFn=getWinnerFromScoreCS2) {
  const {state} = this;
  const stateMatches = state.matches;
  const stateTeams = state.teams;
  const stateRoundTeams = copy(state.roundTeams);
  const {
    pickResults, lockResults,
    winsToAdvance,
    nonDeciderToWin,
    deciderToWin,
    tiebreakers,
  } = state;

  let { advancerToWin } = state;
  let { losesToEliminate } = state;
  let { buchholtzLockIns } = state;
  let { defaultSuffix } = state;

  if (!losesToEliminate) {
    losesToEliminate = winsToAdvance;
  }
  if (!advancerToWin) {
    advancerToWin = deciderToWin;
  }
  if (!buchholtzLockIns) {
    buchholtzLockIns = [];
  }
  if (!defaultSuffix) {
    defaultSuffix = "";
  }

  const gamescores = state.scores || {};

  let tiebreakerResults = state.tiebreakerResults || {};

  let teams;
  let remaining;
  let stageMatches;
  let globalID = 0;

  if (fromStage > 0) {
    const s = stateMatches[fromStage - 1];
    globalID = s[s.length - 1].id;
  }

  const previouslyMatchedUp = (stage, tA, tB) => {
    for (let i = 0; i < stage; i += 1) {
      if (stateMatches[i]) {
        for (const match of stateMatches[i]) {
          if (match.team1.code === tA && match.team2.code === tB) return true;
          if (match.team2.code === tA && match.team1.code === tB) return true;
        }
      }
    }
    return false;
  }


  for(let stage = fromStage; stage < toStage; stage++) {
    const teamCompare = (x, y) => {
      if (y.l - x.l) return x.l - y.l;
      if (y.w - x.w) return y.w - x.w;

      if (x.w === winsToAdvance || x.l === losesToEliminate) { // normal race over, go for tbs
        for(const s of Object.keys(tiebreakers)) {
          if (parseInt(s, 10) < stage) {
            for(const tb of tiebreakers[s]) {
              const tbr = tiebreakerResults[tb.id];
              if (tbr.team1 === x.code && tbr.team2 === y.code) {
                return -tbr.picked;
              }
              if (tbr.team2 === x.code && tbr.team1 === y.code) {
                return tbr.picked;
              }
            }
          }
        }

      }
      if (stage > 0) {
        if (y.buchholtz - x.buchholtz) return y.buchholtz - x.buchholtz;
      }

      const invertedSeed = s => s > 8 ? 25 - s : s;
      if (stage === 0) {
        return invertedSeed(x.seed) - invertedSeed(y.seed);
      }
      return x.seed - y.seed;
    };


    if (stage > 0) {
      const teamsT = stateTeams[stage - 1].filter((team) => team.w === winsToAdvance || team.l === losesToEliminate);


      for (const match of stateMatches[stage - 1]) {
        if (match.is_tiebreaker) {
          continue;
        }
        const opponents1 = [...match.team1.opponents, match.team2.code];
        const opponents2 = [...match.team2.opponents, match.team1.code];

        if (match.picked === 1) {
          teamsT.push({ ...match.team1, opponents: opponents1, w: match.team1.w + 1 });
          teamsT.push({ ...match.team2, opponents: opponents2, l: match.team2.l + 1 });
        } else if (match.picked === -1) {
          teamsT.push({ ...match.team1, opponents: opponents1, l: match.team1.l + 1 });
          teamsT.push({ ...match.team2, opponents: opponents2, w: match.team2.w + 1 });
        }
      }

      const buchholtzScore = {};
      for (const team of teamsT) {
        buchholtzScore[team.code] = team.w - team.l;
      }
      for (const team of teamsT) {
        if (!team.buchholtzLocked) {
          const initialB = team.buchholtz_offset || 0;
          team.buchholtz = initialB + team.opponents.map(x => buchholtzScore[x]).reduce((x, y) => x+y, 0);
          team.buchholtzBreakdown = team.opponents.map(x => ({
            code: x,
            b: buchholtzScore[x],
          }))
          if (buchholtzLockIns.indexOf(`${team.w}-${team.l}`) !== -1) {
            team.buchholtzLocked = 1;
          }
        }
      }
      stateTeams[stage] = teamsT;
    }


    teams = stateTeams[stage].sort(teamCompare);

    remaining = teams.filter((x) => x.w < winsToAdvance && x.l < losesToEliminate);

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
      let team2cands = p.filter((team) => {
        if (team.code === team1.code) return false;
        return !previouslyMatchedUp(stage, team.code, team1.code);
      });

      for (let c = team2cands.length - 1; c >= 0; c -= 1) {
        const team2 = team2cands[c];
        const mat = [...m];
        let picked = team1.seed <= team2.seed ? 1 : -1; // 1 for A win and -1 for B win ;
        let result = 0;

        let score = [[], []];
        let undetermined = false;

        let matchToWin = nonDeciderToWin;
        if (team1.l === losesToEliminate - 1) {
          matchToWin = deciderToWin
        } else if (team1.w === winsToAdvance - 1) {
          matchToWin = advancerToWin
        }

        const suffix = defaultSuffix;

        console.log(`${team1.code}-${team2.code}` + suffix, gamescores);

        if (`${team1.code}-${team2.code}` + suffix in gamescores) {
          const gs = gamescores[`${team1.code}-${team2.code}` + suffix];
          score[0] = gs.map(x => x[0])
          score[1] = gs.map(x => x[1])
          const [winner, maxW] = winnerFn(gs);
          if (winner) {
            picked = winner > 0 ? 1 : -1;
            if (maxW >= matchToWin) {
              result = picked
            }
          } else {
            undetermined = true;
          }
        } else if (`${team2.code}-${team1.code}` + suffix in gamescores) {
          const gs = gamescores[`${team2.code}-${team1.code}` + suffix];
          score[1] = gs.map(x => x[0])
          score[0] = gs.map(x => x[1])
          const [winner, maxW] = winnerFn(gs);
          if (winner) {
            picked = winner < 0 ? 1 : -1;
            if (maxW >= matchToWin) {
              result = picked
            }
          } else {
            undetermined = true;
          }
        } else {
          undetermined = true;
        }

        if (`${team1.code}-${team2.code}` + suffix in pickResults) {
          if (picked !== pickResults[`${team1.code}-${team2.code}` + suffix]) {
            undetermined = true;
          }
          picked = pickResults[`${team1.code}-${team2.code}` + suffix]
        }

        let locked = false;
        if (`${team1.code}-${team2.code}` + suffix in lockResults) {
          locked = true;
        }

        const _match = {
          pool,
          id: -1,
          match: m.length,
          matchToWin,
          bestOf: matchToWin * 2 - 1,
          team1, team2,
          picked, locked, result,
          score, stage, suffix,
          undetermined,
          setWinner: (pick) => this.setWinner({
            picked, team1, team2, suffix
          }, pick),
          toggle: () => this.setWinner({
            picked, team1, team2, suffix
          }, -picked),
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

    stageMatches = matchups.map(x => ({...x, id: ++globalID}))
    stateMatches[stage] = stageMatches;

    const teamsSorted = teams.sort(teamCompare).map((x, idx) => ({
      ...x,
      standing: stage > 0 ? idx+1 : x.seed,
    }));

    stateRoundTeams[stage] = teamsSorted.map((x, idx) => {
      if (tiebreakers[stage]) {
        for (const tbs of tiebreakers[stage]) {
          // tbs.teams is the 1-based index
          const tb = tbs.teams - 1 === idx || tbs.teams === idx;
          if (tb) {
            let tbr = tiebreakerResults[tbs.id];
            // winner, loser, winner score, loser score, determined
            const t1 = teamsSorted[tbs.teams - 1];
            const t2 = teamsSorted[tbs.teams];
            if (
              !tbr
              || !((tbr.team1 === t1.code && tbr.team2 === t2.code)
                || (tbr.team1 === t2.code && tbr.team2 === t1.code))
            ) {
              if (`${t1.code}-${t2.code}#1` in gamescores) {
                const gs = gamescores[`${t1.code}-${t2.code}#1`];
                const [winner, ] = winnerFn(gs);
                tbr = tiebreakerResults[tbs.id] = {
                  team1: t1.code,
                  team2: t2.code,
                  scores: [gs.map(x => x[0]), gs.map(x => x[1])],
                  determined: 1,
                  result: winner,
                  picked: winner,
                }
              } else if (`${t2.code}-${t1.code}#1` in gamescores) {
                const gs = gamescores[`${t2.code}-${t1.code}#1`];
                const [winner, ] = winnerFn(gs);
                tbr = tiebreakerResults[tbs.id] = {
                  team1: t1.code,
                  team2: t2.code,
                  scores: [gs.map(x => x[1]), gs.map(x => x[0])],
                  determined: 1,
                  result: -winner,
                  picked: -winner,
                }
              } else {
                tbr = tiebreakerResults[tbs.id] = {
                  team1: t1.code,
                  team2: t2.code,
                  scores: [[], []],
                  determined: 0,
                  result: 0,
                  picked: 1,
                };
              }
            }

            const { picked, result, determined, scores } = tbr;

            const teamIdx = idx - (tbs.teams - 1); // 0 or 1
            const teamNegIdx = teamIdx === 0 ? 1 : -1; // 0 or 1

            const otherTeamId = teamIdx === 0 ? idx + 1 : idx;

            const setWinner = (pick) => {
              const tbrs = tiebreakerResults;
              tbrs[tbs.id].picked = pick;
              this.setState({ tiebreakerResults: tbrs }, () => {
                this.calculateMatchups(0, this.state.rounds + 1)
              });
            }
            const matchToWin = deciderToWin;

            if (teamIdx === 0) {
              // console.log(tbr);
              // console.log("picked, result", picked, result, "t1", x.code, "t2", otherTeam.code);
              stateMatches[stage].push({
                pool: tbs.name || `${x.w}-${x.l} Tiebreaker`,
                poolOrder: x.w * 100 - x.l + (tbs.offset || 0),
                id: ++globalID,
                match: -1,
                is_tiebreaker: true,
                matchToWin,
                bestOf: matchToWin * 2 - 1,
                team1: x,
                team2: t2,
                picked,
                locked: 0,
                result,
                score: scores,
                stage,
                suffix: "",
                setWinner,
                toggle: () => {
                  setWinner(-picked);
                },
              })
            }

            return ({
              ...x,
              standing: stage > 0 ? idx + 1 : x.seed,
              ...getStatus(idx+1, state.seats),
              ordinalStanding: ordinal(idx+1),
              tiebreaker: true,
              tiebreakerStats: teamNegIdx === picked, // 1 for win
              tiebreakerScores: scores[teamIdx],
              tiebreakerOtherScores: scores[1 - teamIdx],
              tiebreakerUndetermined: !determined,
              tiebreakerOtherTeam: otherTeamId,
              tiebreakerConfig: tbs,
              elim: x.l >= losesToEliminate,
              adv: x.w === winsToAdvance,
              currentRound: true,
              setTiebreakerWin: () => setWinner(teamNegIdx),
              toggle: () => {
                setWinner(-picked);
              },
            })
          }
        }
      }

      return ({
        ...x,
        standing: stage > 0 ? idx + 1 : x.seed,
        ...getStatus(idx+1, state.seats),
        ordinalStanding: ordinal(idx+1),
        elim: x.l >= losesToEliminate,
        adv: x.w === winsToAdvance,
        currentRound: x.w + x.l === stage,
      })
    });

  }


  if (state.resultTag) {
    localStorage[state.resultTag] = JSON.stringify(stateRoundTeams[stateRoundTeams.length - 1]);
  }

  return {
    teams: stateTeams,
    tiebreakerResults,
    roundTeams: stateRoundTeams,
    matches: stateMatches,
  };
}


