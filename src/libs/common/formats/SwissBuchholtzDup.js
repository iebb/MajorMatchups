import { ordinal } from '../../plural';
import { copy, getStatus, getWinnerFromScore } from '../common';

export function SwissBuchholtzDup(fromStage, toStage) {
  const {state} = this;
  const stateMatches = state.matches;
  const stateTeams = state.teams;
  const stateRoundTeams = copy(state.roundTeams);
  const {
    pickResults, lockResults,
    winsToAdvance,
    nonDeciderBestOf, deciderBestOf,
    tiebreakers
  } = state;
  const gamescores = state.scores || {};

  let tiebreakerResults = state.tiebreakerResults || {};

  let teams;
  let remaining;
  let stageMatches;

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

      if (x.w === winsToAdvance || x.l === winsToAdvance) { // normal race over, go for tbs
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
      const teamsT = stateTeams[stage - 1].filter((team) => team.w === winsToAdvance || team.l === winsToAdvance);


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
        team.buchholzBreakdown = team.opponents.map(x => ({
          code: x,
          b: buchholzScore[x],
        }))
      }
      stateTeams[stage] = teamsT;
    }


    teams = stateTeams[stage].sort(teamCompare);

    remaining = teams.filter((x) => x.w < winsToAdvance && x.l < winsToAdvance);

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

      let isDup = false;

      if (!team2cands.length) {
        team2cands = p.filter((team) => {
          return (team.seed !== team1.seed);
        });
        isDup = true;
      }

      for (let c = team2cands.length - 1; c >= 0; c -= 1) {
        const team2 = team2cands[c];
        const mat = [...m];
        let picked = team1.seed <= team2.seed ? 1 : -1; // 1 for A win and -1 for B win ;
        let result = 0;

        let score = [[], []];
        const suffix = isDup ? "_" : ""
        let undetermined = false;

        if (`${team1.code}-${team2.code}` + suffix in gamescores) {
          const gs = gamescores[`${team1.code}-${team2.code}` + suffix];
          score[0] = gs.map(x => x[0])
          score[1] = gs.map(x => x[1])
          const [winner, maxW] = getWinnerFromScore(gs);
          if (winner) {
            picked = winner > 0 ? 1 : -1;
            if (
              ((team1.w === winsToAdvance - 1 || team1.l === winsToAdvance - 1) && maxW === deciderBestOf) ||
              (team1.w < winsToAdvance - 1 && team1.l < winsToAdvance - 1 && maxW === nonDeciderBestOf)
            ) {
              result = picked
            }
          } else {
            undetermined = true;
          }
        } else if (`${team2.code}-${team1.code}` + suffix in gamescores) {
          const gs = gamescores[`${team2.code}-${team1.code}` + suffix];
          score[1] = gs.map(x => x[0])
          score[0] = gs.map(x => x[1])
          const [winner, maxW] = getWinnerFromScore(gs);
          if (winner) {
            picked = winner < 0 ? 1 : -1;
            if (
              ((team1.w === winsToAdvance - 1 || team1.l === winsToAdvance - 1) && maxW === deciderBestOf) ||
              (team1.w < winsToAdvance - 1 && team1.l < winsToAdvance - 1 && maxW === nonDeciderBestOf)
            ) {
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
          isDup,
          pool,
          match: m.length,
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
              if (`${t1.code}-${t2.code}#1` in gamescores) {
                const gs = gamescores[`${t1.code}-${t2.code}#1`];
                const [winner, ] = getWinnerFromScore(gs);
                tbr = tiebreakerResults[tbs.id] = winner !== 0 ? (
                  winner > 0 ?
                    [t1.code, t2.code, gs.map(x => x[0]), gs.map(x => x[1]), false] :
                    [t2.code, t1.code, gs.map(x => x[1]), gs.map(x => x[0]), false]
                ) : [t1.code, t2.code, [], [], true];
              } else if (`${t2.code}-${t1.code}#1` in gamescores) {
                const gs = gamescores[`${t2.code}-${t1.code}#1`];
                const [winner, ] = getWinnerFromScore(gs);
                tbr = tiebreakerResults[tbs.id] = winner !== 0 ? (
                  winner < 0 ?
                    [t1.code, t2.code, gs.map(x => x[0]), gs.map(x => x[1]), false] :
                    [t2.code, t1.code, gs.map(x => x[1]), gs.map(x => x[0]), false]
                ) : [t1.code, t2.code, [], [], true];
              } else {
                tbr = tiebreakerResults[tbs.id] = [t1.code, t2.code, [], [], true];
              }
            }

            const otherTeamId = tbs.teams === idx + 1 ? idx + 2 : idx;
            const otherTeam = tbs.teams === idx + 1 ? t2 : t1;
            const lostTeam = tbr[0] === x.code ? otherTeam : x;
            const winTeam = tbr[0] === x.code ? x : otherTeam;
            return ({
              ...x,
              standing: idx + 1,
              ...getStatus(idx+1, state.seats),
              ordinalStanding: ordinal(idx+1),
              tiebreaker: true,
              tiebreakerStats: tbr[0] === x.code ? 1 : -1,
              tiebreakerScores: tbr[0] === x.code ? tbr[2]: tbr[3],
              tiebreakerOtherScores: tbr[0] === x.code ? tbr[3]: tbr[2],
              tiebreakerUndetermined: tbr[4],
              tiebreakerOtherTeam: otherTeamId,
              tiebreakerConfig: tbs,
              elim: x.l === winsToAdvance,
              adv: x.w === winsToAdvance,
              currentRound: true,
              setTiebreakerWin: () => this.setTiebreakerWinner({
                ...x,
                tiebreakerConfig: tbs,
              }, otherTeam),
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
        ...getStatus(idx+1, state.seats),
        ordinalStanding: ordinal(idx+1),
        elim: x.l === winsToAdvance,
        adv: x.w === winsToAdvance,
        currentRound: x.w + x.l === stage,
      })
    });

  }

  return {
    teams: stateTeams,
    tiebreakerResults,
    roundTeams: stateRoundTeams,
    matches: stateMatches,
  };
}


