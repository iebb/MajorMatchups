import { ordinal } from '../../plural';
import { copy, getStatus, getWinnerFromScore } from '../common';


export function DoubleElimination(fromStage, toStage) {
  const {state} = this;
  const stateMatches = state.matches;
  const stateTeams = state.teams;
  const stateRoundTeams = copy(state.roundTeams);
  const {
    pickResults, lockResults,
    winsToAdvance, loseToEliminate,
    nonDeciderBestOf,
    deciderBestOf, rounds
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
  let counter = {};

  for(let stage = 0; stage < fromStage; stage++) {
    for(const match of stateMatches[stage]) {
      const {team1, team2} = match;
      let ctr = (counter[`${team1.code}-${team2.code}`] || 0) + 1;
      counter[`${team1.code}-${team2.code}`] = counter[`${team2.code}-${team1.code}`] = ctr;
    }
  }
  for(let stage = fromStage; stage < toStage; stage++) {
    const teamCompare = (x, y) => {
      if (y.l - x.l) return x.l - y.l;
      if (y.w - x.w) return y.w - x.w;
      if (y.l < loseToEliminate) {
        if (!y._seed) y._seed = y.seed;
        if (!x._seed) x._seed = x.seed;
        if (x._seed - y._seed) return x._seed - y._seed;
      }
      return x.seed - y.seed;
    };


    if (stage > 0) {
      const teamsT = stateTeams[stage - 1].filter(
        (team) => team.w === winsToAdvance || team.l === loseToEliminate
      );

      for (const match of stateMatches[stage - 1]) {
        const opponents1 = [...match.team1.opponents, match.team2.code];
        const opponents2 = [...match.team2.opponents, match.team1.code];

        let _seed = Math.min(match.team1._seed, match.team2._seed);

        if (match.team1.l > 0 && _seed < 1000) {
          _seed = 1000 + _seed;
        }

        if (match.team2.code === null) { // same team, bye
          teamsT.push(match.team1);
        } else {
          if (match.picked === 1) {
            teamsT.push({ ...match.team1, opponents: opponents1, w: match.team1.w + (
                match.team1.l && stage > 2 && stage !== rounds ? 0.5 : 1
              ), _seed });
            teamsT.push({ ...match.team2, opponents: opponents2, l: match.team2.l + 1, _seed });
          } else if (match.picked === -1) {
            teamsT.push({ ...match.team1, opponents: opponents1, l: match.team1.l + 1, _seed });
            teamsT.push({ ...match.team2, opponents: opponents2, w: match.team2.w + (
                match.team2.l && stage > 2 && stage !== rounds ? 0.5 : 1
              ), _seed });
          }
        }
      }
      stateTeams[stage] = teamsT;
    }


    teams = stateTeams[stage].sort(teamCompare);

    remaining = teams.filter((x) => x.w < winsToAdvance && x.l < loseToEliminate);

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

      if (team2.code === null) {
        return {
          is_bye: true,
          id: 0,
          team1,
          team2,
          counter: 0,
          picked: 1,
          locked: 0,
          result: 1,
          score: [],
          stage,
          undetermined: false,
          setWinner: () => {},
          toggle: () => {},
        };
      }



      let picked = team1.seed <= team2.seed ? 1 : -1; // 1 for A win and -1 for B win ;
      let result = 0;

      let score = [[], []];
      let undetermined = false;

      let ctr = (counter[`${team1.code}-${team2.code}`] || 0) + 1;
      counter[`${team1.code}-${team2.code}`] = counter[`${team2.code}-${team1.code}`] = ctr;

      if (`${team1.code}-${team2.code}#${ctr}` in gamescores) {
        const gs = gamescores[`${team1.code}-${team2.code}#${ctr}`];
        score[0] = gs.map(x => x[0])
        score[1] = gs.map(x => x[1])
        const [winner, maxW] = getWinnerFromScore(gs);
        if (winner) {
          picked = winner > 0 ? 1 : -1;
          if (
            ((team1.w === winsToAdvance - 1 || team1.l === loseToEliminate - 1) && maxW >= deciderBestOf) ||
            (team1.w < winsToAdvance - 1 && team1.l < loseToEliminate - 1 && maxW >= nonDeciderBestOf)
          ) {
            result = picked
          }
        } else {
          undetermined = true;
        }
      } else if (`${team2.code}-${team1.code}#${ctr}` in gamescores) {
        const gs = gamescores[`${team2.code}-${team1.code}#${ctr}`];
        score[1] = gs.map(x => x[0])
        score[0] = gs.map(x => x[1])
        const [winner, maxW] = getWinnerFromScore(gs);
        if (winner) {
          picked = winner < 0 ? 1 : -1;
          if (
            ((team1.w === winsToAdvance - 1 || team1.l === loseToEliminate - 1) && maxW >= deciderBestOf) ||
            (team1.w < winsToAdvance - 1 && team1.l < loseToEliminate - 1 && maxW >= nonDeciderBestOf)
          ) {
            result = picked
          }
        } else {
          undetermined = true;
        }
      } else {
        undetermined = true;
      }

      if (`${team1.code}-${team2.code}#${ctr}` in pickResults) {
        if (picked !== pickResults[`${team1.code}-${team2.code}#${ctr}`]) {
          undetermined = true;
        }
        picked = pickResults[`${team1.code}-${team2.code}#${ctr}`]
      }

      let locked = false;
      if (`${team1.code}-${team2.code}#${ctr}` in lockResults) {
        locked = true;
      }

      return {
        id: ++globalID,
        team1, team2,
        counter: ctr,
        picked, locked, result,
        score, stage,
        undetermined,
        setWinner: (pick) => this.setWinner({
          picked, team1, team2, suffix: `#${ctr}`, stage,
        }, pick),
        toggle: () => this.setWinner({
          picked, team1, team2, suffix: `#${ctr}`, stage,
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

      if (poolTeams.length) {
        const team1 = poolTeams.pop();
        matchups.push({
          pool,
          ...makeMatch(team1, {
            code: null,
            opponents: [],
            w: 0, l: 0,
          })
        });
      }

    }

    stageMatches = matchups;
    stateMatches[stage] = stageMatches;

    const teamsSorted = teams.sort(teamCompare).map((x, idx) => ({...x, standing: idx+1}));
    const roundTeams = teamsSorted.map((x, idx) => {
      return ({
        ...x,
        standing: idx + 1,
        ordinalStanding: ordinal(idx+1),
        ...getStatus(idx+1, state.seats),
        elim: x.l === loseToEliminate,
        adv: x.w === winsToAdvance,
        currentRound: x.w + x.l === stage,
      })
    })

    stateRoundTeams[stage] = roundTeams;

  }

  return {
    teams: stateTeams,
    roundTeams: stateRoundTeams,
    matches: stateMatches,
  };
}


