import { ordinal } from '../../plural';
import { copy, getStatus, getWinnerFromScoreCSGO } from '../common';


export function Knockout(fromStage, toStage, winnerFn=getWinnerFromScoreCSGO) {
  const {state} = this;
  const stateMatches = state.matches;
  const stateTeams = state.teams;
  const stateRoundTeams = copy(state.roundTeams);
  const {
    pickResults, lockResults,
    winsToAdvance, losesToEliminate, // should be 1 so
    deciderToWin,
  } = state; //   allowDups, tiebreakers
  const gamescores = state.scores || {};

  let teams;
  let remaining;
  let stageMatches;
  let globalID = 0;

  if (fromStage > 0) {
    const s = stateMatches[fromStage - 1];
    globalID = s[s.length - 1].id;
  }

  for(let stage = fromStage; stage < toStage; stage++) {
    const teamCompare = (x, y) => {
      if (y.l - x.l) return x.l - y.l;
      if (y.w - x.w) return y.w - x.w;
      if (y.l < losesToEliminate) {
        if (!y._seed) y._seed = y.seed;
        if (!x._seed) x._seed = x.seed;
        if (x._seed - y._seed) return x._seed - y._seed;
      }
      return x.seed - y.seed;
    };


    if (stage > 0) {

      const teamsT = stateTeams[stage - 1].filter((team) => team.w === winsToAdvance || team.l === losesToEliminate);

      for (const match of stateMatches[stage - 1]) {
        const opponents1 = [...match.team1.opponents, match.team2.code];
        const opponents2 = [...match.team2.opponents, match.team1.code];

        const _seed = Math.min(match.team1._seed, match.team2._seed);

        if (match.picked === 1) {
          teamsT.push({ ...match.team1, opponents: opponents1, w: match.team1.w + 1, _seed });
          teamsT.push({ ...match.team2, opponents: opponents2, l: match.team2.l + 1, _seed });
        } else if (match.picked === -1) {
          teamsT.push({ ...match.team1, opponents: opponents1, l: match.team1.l + 1, _seed });
          teamsT.push({ ...match.team2, opponents: opponents2, w: match.team2.w + 1, _seed });
        }
      }
      stateTeams[stage] = teamsT;
    }


    teams = stateTeams[stage].sort(teamCompare);

    remaining = teams.filter((x) => x.w < winsToAdvance && x.l < losesToEliminate);

    const remainingTeams = copy(remaining);
    const pools = Array.from(new Set(remainingTeams.map((t) => `${t.w}-${t.l}`))).sort((x, y) => {
      const ax = x.split('-');
      const ay = y.split('-');
      const vx = parseInt(ax[0], 10) * 10 - parseInt(ax[1], 10);
      const vy = parseInt(ay[0], 10) * 10 - parseInt(ay[1], 10);
      return vy - vx;
    });

    let idx = 0;
    const makeMatch = (team1, team2) => {
      let picked = team1.seed <= team2.seed ? 1 : -1; // 1 for A win and -1 for B win ;
      let result = 0;

      let score = [[], []];
      let undetermined = false;

      let matchToWin = deciderToWin;

      if (`${team1.code}-${team2.code}` in gamescores) {
        const gs = gamescores[`${team1.code}-${team2.code}`];
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
      } else if (`${team2.code}-${team1.code}` in gamescores) {
        const gs = gamescores[`${team2.code}-${team1.code}`];
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

      if (`${team1.code}-${team2.code}` in pickResults) {
        if (picked !== pickResults[`${team1.code}-${team2.code}`]) {
          undetermined = true;
        }
        picked = pickResults[`${team1.code}-${team2.code}`]
      }

      let locked = false;
      if (`${team1.code}-${team2.code}` in lockResults) {
        locked = true;
      }

      return {
        id: ++globalID,
        match: idx++,
        matchToWin,
        bestOf: matchToWin * 2 - 1,
        team1, team2,
        picked, locked, result,
        score, stage,
        undetermined,
        setWinner: (pick) => this.setWinner({
          picked, team1, team2, suffix: "",
        }, pick),
        toggle: () => this.setWinner({
          picked, team1, team2, suffix: "",
        }, -picked),
      };
    }

    const matchups = [];
    for (const pool of pools) {
      const poolTeams = remainingTeams.filter((team) => pool === `${team.w}-${team.l}`);
      while (poolTeams.length > 1 && poolTeams.length % 2 === 0) {
        const team1 = poolTeams.shift();
        const team2 = poolTeams.pop();
        matchups.push({pool, ...makeMatch(team1, team2)});
      }
    }

    stageMatches = matchups;
    stateMatches[stage] = stageMatches;

    const teamsSorted = teams.sort(teamCompare).map((x, idx) => ({...x, standing: idx+1}));

    stateRoundTeams[stage] = teamsSorted.map((x, idx) => {
      return ({
        ...x,
        standing: idx + 1,
        ordinalStanding: ordinal(idx+1),
        ...getStatus(idx+1, state.seats),
        elim: x.l === losesToEliminate,
        adv: x.w === winsToAdvance,
        currentRound: x.w + x.l === stage,
      })
    });

  }

  return {
    teams: stateTeams,
    roundTeams: stateRoundTeams,
    matches: stateMatches,
  };
}


