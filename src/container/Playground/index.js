/* eslint-disable global-require */

import React from 'react';
import { Image, Menu } from 'semantic-ui-react';
import { finalDataChampions, finalDataLegends, initialDataChallenger, initialDataLegends } from './initial_data';
import {FinalResultsChallenger, FinalResultsChampions, FinalResultsLegends} from './final_results';

import * as d3 from "d3";

const copy = (x) => JSON.parse(JSON.stringify(x));

const TournamentChallenger = 1;
const TournamentLegends = 2;
const TournamentChampions = 3;

const teamLogo = (code) => `https://major.ieb.im/images/stockh2021/${code}.png`;

const color = d3.scaleOrdinal(d3.schemeDark2)
const background_color = "#23294d"

const _data = [
  [
    { id: 'A', is_single_node: true },
    { id: 'B', is_single_node: true },
    { id: 'C', is_single_node: true },
    { id: 'D', is_single_node: true },
    { id: 'E', is_single_node: true },
    { id: 'F', is_single_node: true },
    { id: 'G', is_single_node: true },
    { id: 'H', is_single_node: true },
  ],
  [
    { id: 'A-B', parents: ['A','B'] },
    { id: 'C-D', parents: ['C','D'] },
    { id: 'E-F', parents: ['E','F'] },
    { id: 'G-H', parents: ['G','H'] },
  ],
  [
    { id: 'A-C', parents: ['A-B','C-D'] },
    { id: 'B-D', parents: ['C-D','A-B'] },
    { id: 'E-G', parents: ['E-F','G-H'] },
    { id: 'F-H', parents: ['E-F','G-H'] },
  ],
]


const constructTangleLayout = (state, options={}) => {

  console.log(state);

  const padding = 8;
  const paddings_level = [8, 16, 16, 16, 16, 16, 16, 16];

  const node_single_height = 24;
  const node_height = 48;

  const node_width = 64;
  const bundle_width = 30;
  const level_y_padding = 16;
  const level_y_half_padding = 8;
  const metro_d = 10;
  const min_family_height = 22;

  const round_width = 200;

  options.c = options.c || 16;
  const c = options.c;
  options.bigc = options.bigc || node_width+c;



  const matches = state.matches;

  let nodeY = 0;
  const teams = state.teams[0].map(t => {
    nodeY += node_single_height + level_y_half_padding;
    return ({
      id: t['code'], ...t,
      is_single_node: true,
      height: node_single_height,
      padding: node_single_height,
      x: 0,
      y: nodeY,
    })
  })

  const teamPaths = {

  };

  teams.forEach(team => {
    teamPaths[team.code] = [{x: 0, y: team.y}]
  })


  const roundMatches = matches.map((round, round_idx) => {
    if (!round) return [];
    let nodeY = -level_y_padding;
    let relPos = 0;
    return round.map(match => {
      nodeY += node_height + level_y_padding;
      const x = (round_idx + 1) * round_width;
      const y = nodeY;

      teamPaths[match.team1.code].push({x, y: y - node_height / 3, pos: (relPos + 1) / 17})
      teamPaths[match.team2.code].push({x, y: y + node_height / 3, pos: (relPos + 2) / 17})
      relPos += 2;
      return ({
        id: match['pool'] + " - match " + match['match'],
        parents: [match.team1.code, match.team2.code],
        height: node_height,
        padding: node_height,
        x,
        y,
      })
    })
  }).flat()


  const nodes = [
    ...teams,
    ...roundMatches,
  ]

  const bundles = Object.keys(teamPaths).map(
    team => {
      const links = [];
      const paths = teamPaths[team];
      for(let i = 1; i < teamPaths[team].length; i++) {
        const source = paths[i];
        const target = paths[i-1];
        const c1 = Math.min(Math.abs((source.y - target.y) / 2), c);
        const rev = source.y < target.y ? -1 : 1;
        const u = source.pos;
        links.push({
          xs: source.x,
          xt: target.x,
          ys: source.y,
          yt: target.y,

          xb: source.x * u + target.x * (1-u),
          yb: source.y * u + target.y * (1-u),

          c1: c1,
          c2: c1,
          rev,
          y1: target.y + c1 * rev,
          y2: source.y - c1 * rev,
        })
      }

      return {
        id: "hero-*-navi",
        level: 1,
        links,
        color: color(team),
      }
    }
  );




  var layout = {
    width: d3.max(nodes, n => n.x) + node_width + 2 * padding,
    height: d3.max(nodes, n => n.y) + node_height / 2 + 2 * padding,
    node_height,
    node_width,
    bundle_width,
    level_y_padding,
    metro_d
  };

  console.log("NB", { nodes, bundles, layout });

  return { nodes, bundles, layout };

/*
  const levels = JSON.parse(JSON.stringify(__data));

  // precompute level depth
  levels.forEach((l, i) => l.forEach(n => (n.level = i)));

  var nodes = levels.reduce((a, x) => a.concat(x), []);
  var nodes_index = {};
  nodes.forEach(d => (nodes_index[d.id] = d));

  console.log(nodes_index);
  // objectification
  nodes.forEach(d => {
    d.parents = (d.parents === undefined ? [] : d.parents).map(
      p => nodes_index[p]
    );
  });

  console.log(nodes);
  console.log(levels);

  // precompute bundles
  levels.forEach((l, i) => {
    var index = {};
    l.forEach(n => {
      if (n.parents.length === 0) {
        return;
      }

      var id = n.parents
        .map(d => d.id)
        .sort()
        .join('-*-');

      if (id in index) {
        index[id].parents = index[id].parents.concat(n.parents);
      } else {
        index[id] = { id: id, parents: n.parents.slice(), level: i, span: i - d3.min(n.parents, p => p.level) };
      }
      n.bundle = index[id];

    });
    l.bundles = Object.keys(index).map(k => index[k]);
    l.bundles.forEach((b, i) => (b.i = i));
  });

  var links = [];
  nodes.forEach(d => {
    d.parents.forEach((p, _idx) =>
      links.push({ source: d, bundle: d.bundle, target: p, parent_i: _idx })
    );
  });

  var bundles = levels.reduce((a, x) => a.concat(x.bundles), []);

  console.log(bundles);

  // reverse pointer from parent to bundles
  bundles.forEach(b =>
    b.parents.forEach(p => {
      if (p.bundles_index === undefined) {
        p.bundles_index = {};
      }
      if (!(b.id in p.bundles_index)) {
        p.bundles_index[b.id] = [];
      }
      p.bundles_index[b.id].push(b);
    })
  );

  nodes.forEach(n => {
    if (n.bundles_index !== undefined) {
      n.bundles = Object.keys(n.bundles_index).map(k => n.bundles_index[k]).flat();
    } else {
      n.bundles_index = {};
      n.bundles = [];
    }

    console.log("n.bundles_index is", n.bundles_index);
    console.log("first bundle is", n.bundles);
    n.bundles.sort((a,b) => d3.descending(a.span, b.span))
    n.bundles.forEach((b, i) => {
      (b.i = i)
    });
  });

  links.forEach(l => {
    if (l.bundle.links === undefined) {
      l.bundle.links = [];
    }
    l.bundle.links.push(l);
  });

  // layout
  const padding = 8;
  const paddings_level = [8, 16, 16, 16, 16, 16, 16, 16];

  const node_single_height = 20;
  const node_height = 40;

  const node_width = 64;
  const bundle_width = 30;
  const level_y_padding = 16;
  const metro_d = 10;
  const min_family_height = 22;

  options.c = options.c || 16;
  const c = options.c;
  options.bigc = options.bigc || node_width+c;

  nodes.forEach(
    n => {
      n.height = n.is_single_node ? node_single_height : node_height;
      n.padding = n.is_single_node ? node_single_height : node_height;
    }
  );

  var x_offset = padding;
  var y_offset = padding;
  levels.forEach((l, level_i) => {
    x_offset += l.bundles.length * bundle_width;
    y_offset = paddings_level[level_i];
    y_offset += level_y_padding;
    l.forEach((n, i) => {
      n.x = n.level * node_width + x_offset;
      n.y = node_height + y_offset + n.height / 2;

      y_offset += n.height + n.height;
    });
  });

  var i = 0;
  levels.forEach(l => {
    l.bundles.forEach(b => {
      b.x = d3.max(b.parents, d => d.x) + node_width + (l.bundles.length - 1 - b.i) * bundle_width;
      b.y = i * node_height;
    });
    i += l.length;
  });


  links.forEach(l => {
    console.log("link is", l)
    l.xs = l.source.x;
    l.xt = l.target.x;

    l.xb = l.bundle.x;
    l.yb = l.bundle.y;

    l.color = l.source.color;

    console.log(l.target.bundles_index);
    l.yt =
      l.target.y +
      l.target.bundles_index[l.bundle.id][0].i * metro_d -
      (l.target.bundles.length * metro_d) / 2 +
      metro_d / 2;

    l.ys =
      l.source.y +
      l.parent_i * metro_d -
      (l.parents ? l.parents.length * metro_d : 0) / 2 -
      metro_d / 2;
    console.log(l.target.bundles_index[l.bundle.id]);

    const dc = Math.abs((l.yt - l.ys) / 2);
    l.c1 = l.source.level - l.target.level > 1 ? Math.min(options.bigc, l.xb-l.xt, l.yb-l.yt)-c : c;
    l.c2 = c;
    l.c1 = Math.min(dc, l.c1);
    l.c2 = Math.min(dc, l.c2);

    l.rev = l.ys < l.yt ? -1 : 1;
    l.y1 = l.yt + l.c1 * l.rev;
    l.y2 = l.ys - l.c2 * l.rev;


  });

  var layout = {
    width: d3.max(nodes, n => n.x) + node_width + 2 * padding,
    height: d3.max(nodes, n => n.y) + node_height / 2 + 2 * padding,
    node_height,
    node_width,
    bundle_width,
    level_y_padding,
    metro_d
  };

  console.log("NB", nodes, bundles);

  return { levels, nodes, nodes_index, links, bundles, layout };

 */
}

const renderChart = (data, options={}) => {
  options.color = options.color || ((d, i) => color(i))

  const tangleLayout = constructTangleLayout(JSON.parse(JSON.stringify(data)), options);

  return (
    <svg width={tangleLayout.layout.width} height={tangleLayout.layout.height} style={{
      backgroundColor: background_color
    }}>
      <style>{`
      text {
        font-family: sans-serif;
        font-size: 10px;
      }
      .node {
        stroke-linecap: round;
      }
      .link {
        fill: none;
      }`}</style>

      {tangleLayout.bundles.map((b, i) => {
        let d = b.links
          .map(
            l => `
      M${l.xt} ${l.yt}
      L${l.xb - l.c1} ${l.yt}
      A${l.c1} ${l.c1} 90 0 ${l.rev < 0 ? 0 : 1} ${l.xb} ${l.y1}
      L${l.xb} ${l.y2}
      A${l.c2} ${l.c2} 90 0 ${l.rev < 0 ? 1 : 0} ${l.xb + l.c2} ${l.ys}
      L${l.xs} ${l.ys}`
          )
          .join("");
        return [
          <path className="link" d={d} stroke={background_color} strokeWidth="5"/>,
          <path className="link" d={d} stroke={b.color} strokeWidth="2"/>
        ];
      })}

      {tangleLayout.nodes.map(
        n => [
          <path className="selectable node" data-id={n.id} stroke="black"
                strokeWidth="8" d={`M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`} />,
          <path className="node" stroke="white" strokeWidth="4"
                d={`M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`} />,
          <text className="selectable" data-id={n.id}
                x={n.x + 4} y={n.y - n.height / 2 - 4} stroke={background_color} strokeWidth="2">{n.id}</text>,
          <text x={n.x + 4} y={n.y - n.height / 2 - 4}>{n.id}</text>,
        ]
      )}
    </svg>
  );
}

export default class Playground extends React.PureComponent {
  state = {
    teams: [[], false, false, false, false, false],
    matches: [false, false, false, false, false, false],
    tournament: TournamentChallenger,
    advanceMode: 1,
    legends: false,
    modified: true,
    scores: {},
  };

  pack = (teams) => {
    return {
      teams: [
        teams.map(t => ({
          l: 0,
          w: 0,
          opponents: [],
          buchholz: 0,
          code: t.code,
          name: t.name,
          seed: t.seed,
          description: t.description,
        })),
        false,
        false,
        false,
        false,
        false,
        false
      ],
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

  setScores = (scores) => {
    const gamescores = {};
    for(const stage of Object.keys(scores)) {
      gamescores[stage] = {};
      for (const key of Object.keys(scores[stage])) {
        const val = scores[stage][key];
        gamescores[stage][key] = val;
        let key2 = key.split('-');
        gamescores[stage][key2[1] + '-' + key2[0]] = val.map(vals => [vals[1], vals[0]]);
      }
    }
    this.setState({ scores: gamescores })
  }




  componentDidMount() {
    this.initLegends();
    this.setScores({ 1: FinalResultsChallenger, 2: FinalResultsLegends, 3: FinalResultsChampions })

  }


  init = (_) => {
    this.setState({
      ...this.pack(initialDataChallenger),
      tournament: TournamentChallenger,
      advanceMode: 1,
      modified: true,
    });
  };

  initLegends = (_) => {
    this.setState({
      ...this.pack(finalDataLegends),
      tournament: TournamentLegends,
      advanceMode: 1,
      modified: true,
    });

  };
  initChampions = (_) => {
    this.setState({
      ...this.pack(finalDataChampions),
      tournament: TournamentChampions,
      advanceMode: 2,
      modified: true,
    });

  };

  advance = (_) => {
    if (this.state.tournament === TournamentChallenger && this.state.teams[5]) {
      const teamsAdvanced = this.state.teams[5].filter(x => x.w === 3).sort(
        (a, b) => {
          if (a.l !== b.l) return a.l - b.l;
          if (a.buchholz !== b.buchholz) return b.buchholz - a.buchholz;
          return a.seed - b.seed;
        }
      ).map((x, _idx) => ({
        ...x,
        description: `${x.l}L, ${x.buchholz}B, #${x.seed}`,
        l: 0,
        w: 0,
        opponents: [],
        buchholz: 0,
        seed: _idx + 9,
      }))

      const finalTeams = [...initialDataLegends, ...teamsAdvanced];
      this.setState({
        savedS1: [this.state.teams, this.state.matches],
        savedS2: null,
        ...this.pack(finalTeams),
        matches: [false, false, false, false, false, false],
        tournament: TournamentLegends,
        advanceMode: 1,
        legends: false,
        modified: true,
      });
    }

  };

  advance2 = (_) => {
    if (this.state.tournament === TournamentLegends && this.state.teams[5]) {
      const teamsAdvanced = this.state.teams[5].filter(x => x.w === 3).sort(
        (a, b) => {
          if (a.l !== b.l) return a.l - b.l;
          if (a.buchholz !== b.buchholz) return b.buchholz - a.buchholz;
          return a.seed - b.seed;
        }
      ).map((x, _idx) => ({
        ...x,
        description: `${x.l}L, ${x.buchholz}B, #${x.seed}`,
        l: 0,
        w: 0,
        opponents: [],
        buchholz: 0,
        seed: _idx + 1,
      }))

      this.setState({
        ...this.pack(teamsAdvanced),
        matches: [false, false, false, false, false, false],
        savedS2: [this.state.teams, this.state.matches],
        tournament: TournamentChampions,
        advanceMode: 2,
        legends: false,
        modified: true,
      });
    }

  };

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


      if (this.state.advanceMode === 1) {
        teams = stateTeams[stage].sort((x, y) => {
          if (x.buchholz !== y.buchholz) {
            return y.buchholz - x.buchholz;
          }
          return x.seed - y.seed;
        });
      } else {
        teams = stateTeams[stage]
      }

      remaining = this.state.advanceMode === 1 ?
        teams.filter((x) => x.w < 3 && x.l < 3): teams.filter((x) => x.l === 0);

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
        const gamescores = this.state.scores[this.state.tournament] || {};

        for (let c = team2cands.length - 1; c >= 0; c -= 1) {
          const team2 = team2cands[c];
          const mat = copy(m);
          let picked = team1.seed <= team2.seed ? 1 : -1; // 1 for A win and -1 for B win
          if (Math.random() < 0.2) {
            picked *= -1;
          }
          let result = 0;

          let score = [['TBA'], ['TBA']];

          if (`${team1.code}-${team2.code}` in gamescores) {
            let teamA = 0;
            let teamB = 0;
            const gs = gamescores[`${team1.code}-${team2.code}`];
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
            score[0] = gs.map(x => x[0])
            score[1] = gs.map(x => x[1])
            if (teamA !== teamB) {
              picked = teamA > teamB ? 1 : -1;
              if (this.state.advanceMode === 2) {
                if (teamA === 2 || teamB === 2) {
                  result = picked
                }
              } else {
                if (((team1.w === 2 || team1.l === 2) && (teamA === 2 || teamB === 2)) || (team1.w < 2 && team1.l < 2)) {
                  result = picked
                }
              }
            }
          }


          mat.push({ pool, match: m.length, team1, team2, picked, result, score });
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
      let override = false;
      for (const matches of stateMatches) {
        if (matches) {
          for (const match of matches) {
            if (match.picked !== match.result && match.result) {
              override = true;
            }
          }
        }
      }
      this.setState({
        teams: stateTeams, matches: stateMatches, refresh: false,
      });
    } else {
      stageMatches = stateMatches[stage];
      teams = stateTeams[stage].sort((x, y) => x.buchholz - y.buchholz);
    }


    const elim = teams.filter((x) => x.l === 3).sort((x, y) => {if (y.w - x.w) return y.w - x.w; return y.buchholz - x.buchholz});
    const adv = teams.filter((x) => x.w === 3).sort((x, y) => {if (y.l - x.l) return x.l - y.l; return y.buchholz - x.buchholz});



    const setWinner = (match, picked) => {
      if (match.picked === picked) return;

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
      <div key={stage}>
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
              (stage >= 1 && this.state.advanceMode === 1) && (
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
                      <Image className="team-logo-small" src={teamLogo(opp)} alt={opp} title={opp} key={opp} />
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
              {this.state.scores && x.score[0].map((p, idx) => (
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
                  <span className="team-box-text">#{x.team1.seed}</span>
                </div>
                <div className="team-box-split b">
                  <span className="team-box-text">#{x.team2.seed}</span>
                </div>
              </div>
              {
                stage >= 1 ? (this.state.advanceMode === 1) && (
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
                        <Image className="team-logo-small" src={teamLogo(opp)} alt={opp} key={opp}  />
                      )
                    }
                  </span>
                      </div>
                      <div className="team-box-split b">
                  <span className="team-box-text">
                    {
                      x.team2.opponents.map(opp =>
                        <Image className="team-logo-small" src={teamLogo(opp)} alt={opp} key={opp} />
                      )
                    }
                  </span>
                      </div>
                    </div>
                  </>
                ) : (

                  <div className="team-box down">
                    <div className="team-box-split b">
                      <span className="team-box-text descr">{x.team1.description}</span>
                    </div>
                    <div className="team-box-split b">
                      <span className="team-box-text descr">{x.team2.description}</span>
                    </div>
                  </div>
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
              (this.state.advanceMode === 1) && stage >= 1 && (
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
                      <Image className="team-logo-small" src={teamLogo(opp)} alt={opp} title={opp} key={opp} />
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
          <div className="outer">
            {
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
                {renderChart(this.state)}
              </svg>
            }
          </div>
          <div style={{ marginTop: 50 }}>
            <Menu pointing secondary inverted compact size="huge" style={{ border: 'none' }}>
              <Menu.Item
                name="Challengers Stage"
                active={this.state.tournament === TournamentChallenger}
                onClick={() => this.init(TournamentChallenger)}
              />
              <Menu.Item
                name={"Legends Stage"}
                active={this.state.tournament === TournamentLegends}
                onClick={() => this.initLegends()}
              />
              <Menu.Item
                name="Champion Stage"
                active={this.state.tournament === TournamentChampions}
                onClick={() => this.initChampions()}
              />
            </Menu>
          </div>
          <div className="main-container" style={{ display: 'none' }}>
            {(this.state.advanceMode === 1 ? [0, 1, 2, 3, 4, 5] : [0, 1, 2, 3]).map((round) => (
              <>
                <h1 className="round-title" key={round}>
                  {round === (this.state.advanceMode === 1 ? 5 : 3) ? `Final Results` : `Round ${round + 1}`}
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


