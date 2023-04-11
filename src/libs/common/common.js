import { setPickResults } from './storage';

export const pack = (teams, teamLogo) => {
  return {
    teams: [
      teams.map(t => ({
        l: 0,
        w: 0,
        opponents: [],
        buchholtz: t.buchholtz || 0,
        buchholtzBreakdown: [],
        ...t,
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


export const copy = (x) => JSON.parse(JSON.stringify(x));
export const getWinnerFromScore = (scores) => {
  let teamA = 0;
  let teamB = 0;
  for(const sco of scores) {
    if (sco[0] !== sco[1]) {
      if (sco[0] > 15 || sco[1] > 15) {
        if (sco[0] - sco[1] >= 2 && sco[0] % 3 === 1) {
          teamA ++;
        } else if (sco[1] - sco[0] >= 2 && sco[1] % 3 === 1) {
          teamB ++;
        }
      }
    }
  }
  return [teamA - teamB, Math.max(teamA, teamB)]
}

export const AdvanceElimSeats = [
  { status: "advanced", until: 8, abbrev: "A", statusPositioned: true },
  { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
];

export const ChampionSeats = [
  { status: "champion", until: 1, abbrev: "C", statusPositioned: true },
  { status: "runner-up", until: 2, abbrev: "R", statusPositioned: true },
  { status: "semifinalist", until: 4, abbrev: "SF", statusPositioned: false, statusDisplay: "SF" },
  { status: "quarterfinalist", until: 8, abbrev: "QF", statusPositioned: false, statusDisplay: "QF" },
];

export const getStatus = (standing, seats=AdvanceElimSeats) => {
  for(const seat of seats) {
    if (standing <= seat.until) {
      return seat;
    }
  }
  return seats[seats.length - 1]
}

export function setWinner(match, picked)  {
  const { pickResults, lockResults } = this.state;
  const { suffix } = match;
  pickResults[`${match.team1.code}-${match.team2.code}` + suffix] = picked;
  pickResults[`${match.team2.code}-${match.team1.code}` + suffix] = -picked;

  const currentRound = match.stage || (match.team1.l + match.team1.w);

  if (match.picked === picked) {
    if (lockResults[`${match.team1.code}-${match.team2.code}` + suffix]) {
      delete lockResults[`${match.team1.code}-${match.team2.code}` + suffix];
      delete lockResults[`${match.team2.code}-${match.team1.code}` + suffix];
    } else {
      lockResults[`${match.team1.code}-${match.team2.code}` + suffix] = picked;
      lockResults[`${match.team2.code}-${match.team1.code}` + suffix] = -picked;
    }
    this.setState({ pickResults, lockResults }, () => {
      this.calculateMatchups(currentRound, this.state.rounds + 1)
    })
    return;
  }

  setPickResults('pickResults', this.getStage ? this.getStage() : 0, this.event, pickResults);
  this.setState({ pickResults }, () => {
    this.calculateMatchups(currentRound, this.state.rounds + 1)
  })
}

export function setTiebreakerWinner(t1, t2) {
  const tbc = t1.tiebreakerConfig;
  const tbr = this.state.tiebreakerResults;
  const gamescores = this.state.scores || [];

  if (`${t1.code}-${t2.code}#1` in gamescores) {
    const gs = gamescores[`${t1.code}-${t2.code}#1`];
    const [winner, ] = getWinnerFromScore(gs);
    tbr[tbc.id] = [t1.code, t2.code, gs.map(x => x[0]), gs.map(x => x[1]), winner < 0]; // not winner
  } else if (`${t2.code}-${t1.code}#1` in gamescores) {
    const gs = gamescores[`${t2.code}-${t1.code}#1`];
    const [winner, ] = getWinnerFromScore(gs);
    tbr[tbc.id] = [t1.code, t2.code, gs.map(x => x[1]), gs.map(x => x[0]), winner > 0]; // is winner
  } else {
    tbr[tbc.id] = [t1.code, t2.code, [], [], true];
  }

  this.setState({ tiebreakerResults: tbr}, () => {
    this.calculateMatchups(0, this.state.rounds + 1)
  });
}

export function shuffle(currentRound) {
  const { pickResults } = this.state;
  const roundMatch = this.state.matches[currentRound];
  for(const match of roundMatch) {
    if (!match.result && !match.locked) {
      const p = Math.random() > 0.5 ? 1 : -1;
      pickResults[`${match.team1.code}-${match.team2.code}`] = p;
      pickResults[`${match.team2.code}-${match.team1.code}`] = -p;
    }
  }
  this.setState({ pickResults }, () => {
    this.calculateMatchups(currentRound, this.state.rounds + 1)
  })
}
