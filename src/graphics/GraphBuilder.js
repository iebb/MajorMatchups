import * as d3 from 'd3';
import React from 'react';


const background_color = "#23294d"

export default class GraphBuilder extends React.PureComponent {

  render = () => {

    const state = this.props.data;
    const padding = 8;

    const node_single_height = 24;
    const node_height = 48;

    const node_width = 64;
    const bundle_width = 30;
    const level_y_padding = 16;
    const level_y_half_padding = 8;
    const metro_d = 10;

    const round_width = 300;
    const level_padding_initial = 80;
    const level_padding_delta = 20;

    const radius = 20;

    const matches = state.matches;
    const roundTeams = state.roundTeams;
    const colorTeams = {};

    if (!matches[0]) return null;
    if (!roundTeams[0]) return null;

    let nodeY = level_padding_initial;
    const totalTeams = state.teams[0].length;
    const teams = state.teams[0].map((t, _idx) => {
      nodeY += node_single_height + level_y_half_padding;
      colorTeams[t['code']] = d3.interpolateWarm(_idx / (totalTeams - 1));
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

    let x;
    const roundMatches = matches.map((round, round_idx) => {
      if (!round) return [];
      const level_delta = level_padding_delta * Math.min(round_idx, 4) / 2;
      let nodeY = level_padding_initial - level_y_padding - level_delta;
      let relPos = 0;
      const pools = Math.max(new Set(round.map(match => match.pool)).size, 2)
      const delta = level_delta * 2 / (pools - 1);
      let lastPool = round[0] && round[0].pool;

      const teams = roundTeams[round_idx] || [];
      x = (round_idx + 1) * round_width;


      const advanced = teams.filter(t => t.adv).map(t => {
        nodeY += node_single_height + level_y_half_padding;
        const y = nodeY;
        teamPaths[t.code].push({x, y, pos: .5 + (relPos + 1) / 34})
        relPos += 1;
        return ({
          id: t.code,
          ...t,
          name1: `${t.w}-${t.l} / ${t.tiebreakerStats?t.tiebreakerStats>0?"Won Tiebreaker":"Lost Tiebreaker":t.ordinalStanding}`,
          is_single_node: true,
          height: node_single_height,
          padding: node_single_height,
          x,
          y: y + 5,
        })
      })


      const matches = round.map(match => {
        if (match) {
          nodeY += node_height + level_y_padding;
          if (match.pool !== lastPool) nodeY += delta;
          lastPool = match.pool;

          const y = nodeY;

          teamPaths[match.team1.code].push({x, y: y - node_height / 8, pos: .5 + (relPos + 1) / 34})
          teamPaths[match.team2.code].push({x, y: y + node_height / 8, pos: .5 + (relPos + 2) / 34})
          relPos += 2;
          return ({
            id: match.pool + " - match " + match['match'],
            name: `${match.pool} Match`,
            name1: match.team1.name,
            name2: match.team2.name,
            parents: [match.team1.code, match.team2.code],
            height: node_height,
            padding: node_height,
            x,
            y,
          })
        }
      })

      nodeY += node_height + level_y_padding;


      const eliminated = teams.filter(t => t.elim).map(t => {
        const y = nodeY;
        teamPaths[t.code].push({x, y, pos: (relPos + 1) / 17})
        relPos += 1;
        nodeY += node_single_height + level_y_half_padding;
        return ({
          id: t.code,
          ...t,
          name1: `${t.w}-${t.l} / ${t.tiebreakerStats?t.tiebreakerStats>0?"Won Tiebreaker":"Lost Tiebreaker":t.ordinalStanding}`,
          is_single_node: true,
          height: node_single_height,
          padding: node_single_height,
          x,
          y: y + 5,
        })
      })

      return [...advanced, ...matches, ...eliminated]
    }).flat()

    const finalRound = roundTeams[roundTeams.length - 1];
    const finalStatus = new Set(finalRound.map(x => x.status));


    const level_delta = level_padding_delta * 2 / 2;
    nodeY = level_padding_initial - level_y_padding - level_delta;

    const finalRounds = Array.from(finalStatus).map(status => {
      const nextX = x + round_width;
      const statusTeams = finalRound.filter(x => x.status === status);
      const cnt = statusTeams.length;
      const height = node_single_height * cnt;


      nodeY += (level_y_padding) * cnt;
      const y = nodeY;


      nodeY += (node_single_height) * cnt;
      let d = 0;
      for(const t of statusTeams) {
        teamPaths[t.code].push({x: nextX, y: y + (d - cnt / 2 + .5) * node_single_height * 0.5, pos: .9})
        d++;
      }

      return ({
        id: status,
        name: status,
        height,
        padding: node_single_height,
        x: nextX,
        y,
      })
    })


    const nodes = [
      ...teams,
      ...roundMatches,
      ...finalRounds
    ]

    const bundles = Object.keys(teamPaths).map(
      team => {
        const links = [];
        const paths = teamPaths[team];
        for(let i = 1; i < teamPaths[team].length; i++) {
          const source = paths[i];
          const target = paths[i-1];
          let c1 = Math.min(Math.abs((source.y - target.y) / 2), radius);
          if (c1 < 5) {
            source.y = target.y;
            c1 = 0;
          }
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
          links,
          color: colorTeams[team],
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

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        style={{ height: 720 }}
      >
        <svg
          width={layout.width}
          height={layout.height}
          style={{
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

          {bundles.map((b, _) => {
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

          {nodes.map(
            n => [
              <path className="selectable node" data-id={n.id} stroke="black"
                    strokeWidth="8" d={`M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`} />,
              <path className="node" stroke="white" strokeWidth="4"
                    d={`M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`} />,
              <text x={n.x + 4} y={n.y - n.height / 2 + 4}>{n.name}</text>,
              n.name1 && <text x={n.x + 4} y={n.y - n.height / 2 + 16}>{n.name1}</text>,
              n.name2 && <text x={n.x + 4} y={n.y - n.height / 2 + 40}>{n.name2}</text>,
            ]
          )}
        </svg>
      </svg>
    );
  }

}
