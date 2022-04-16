import * as d3 from 'd3';
import React from 'react';


const background_color = "#23294d"

export default class GraphBuilder extends React.PureComponent {

  render = () => {

    const state = this.props.data;
    const eliminatedOnDiagram = this.props.eliminatedOnDiagram;
    const straightCorner = this.props.straightCorner;
    const posBase = 0.7;
    const tight = this.props.tight ? 0 : 0.02;

    const padding = 8;
    const tightness = tight;
    const node_point_height = 10;
    const node_single_height = 24;
    const node_height = 48;

    const node_width = 64;
    const bundle_width = 30;
    const level_y_padding = 16;
    const level_y_half_padding = 8;
    const metro_d = 10;

    const round_width = 200;
    const tbo_round_width = 120;
    const level_padding_initial = 100;
    const level_padding_delta = 40;

    const radius = 20;

    const matches = state.matches;
    const roundTeams = state.roundTeams;
    const colorTeams = {};



    if (!matches[0]) return null;
    if (!roundTeams[0]) return null;

    let nodeY = level_padding_initial - level_y_half_padding;

    const _teams = matches[0].map(x => [x.team1, x.team2]).flat();

    const totalTeams = _teams.length;
    const teams = _teams.map((t, _idx) => {
      const y = nodeY;
      nodeY += node_single_height + level_y_half_padding;
      colorTeams[t['code']] = t.seed <= totalTeams / 2 ?
        d3.interpolateCool(0.2 + 0.8 * (totalTeams / 2 - t.seed) / (totalTeams / 2)) :
        d3.interpolateWarm(0.2 + 0.8 * (totalTeams - t.seed) / (totalTeams / 2));
      return ({
        id: t['code'], ...t,
        name: `#${t.seed} ${t.name}`,
        is_single_node: true,
        height: node_single_height,
        padding: node_single_height,
        x: 0,
        y,
      })
    })


    const teamPaths = {};
    const teamSuffixes = {};

    teams.forEach(team => {
      teamPaths[team.code] = [{x: 0, y: team.y}]
      teamSuffixes[team.code] = ""
    })

    let x = 0;
    const roundMatches = matches.map((round, round_idx) => {
      if (!round) return [];
      const level_delta = level_padding_delta * Math.min(round_idx, 3) / 2;
      let nodeY = level_padding_initial - level_delta;

      let relPos = posBase - totalTeams * tightness * 0.5;

      const pools = Math.max(new Set(round.map(match => match.pool)).size, 1)
      let lastPool = round[0] && round[0].pool;

      const teams = roundTeams[round_idx] || [];
      x += (round_idx <= 5) ? round_width : tbo_round_width;


      const decidedTeams = teams.filter(t => t.adv || t.elim).length;

      const decidedTeamsHeight = node_single_height * decidedTeams;
      const liveTeamHeight = node_height * round.length;
      const levelTotalHeight = (node_single_height + level_y_half_padding) * totalTeams + level_delta * 2;
      const totalPools = round.length ? pools + (decidedTeams ? 2 : 0) : 1;

      const space = levelTotalHeight - decidedTeamsHeight - liveTeamHeight;
      const poolSpace = (totalPools - 1) * 3;
      const normalSpaces = (decidedTeams + round.length - totalPools);

      const padSpace = space / (poolSpace + normalSpaces);

      const advanced = teams.filter(t => t.adv).map(t => {
        const y = nodeY;
        nodeY += node_single_height + padSpace;

        relPos += tightness;

        if (t.tiebreakerOtherTeam > t.standing) {
          teamPaths[t.code + teamSuffixes[t.code]].push({x, y: y + 15, pos: relPos})
          if (t.tiebreakerUndetermined) {
            if (teamSuffixes[t.code] === "") {
              teamSuffixes[t.code] = "_";
              teamPaths[t.code + "_"] = [{x, y: y + 15, pos: relPos}];
            }
          }
          const team2 = teams[t.tiebreakerOtherTeam - 1];
          return ({
            id: t.code,
            ...t,
            name: t.tiebreakerConfig.name,
            name1: `${t.name}`,
            name2: `${team2.name}`,
            text_mid: t.tiebreakerScores.map((x, _idx) => `${x}:${t.tiebreakerOtherScores[_idx]}`).join(" / "),
            logo1: `${t.logo}`,
            logo2: `${team2.logo}`,
            logo: null,
            is_single_node: true,
            height: node_height,
            padding: node_height,
            x,
            y: y + node_single_height - 4,
            toggle: t.toggle,
          })
        } else if (t.tiebreakerOtherTeam < t.standing) {
          teamPaths[t.code + teamSuffixes[t.code]].push({x, y: y - 15, pos: relPos})
          if (t.tiebreakerUndetermined) {
            if (teamSuffixes[t.code] === "") {
              teamSuffixes[t.code] = "_";
              teamPaths[t.code + "_"] = [{x, y: y - 15, pos: relPos}];
            }
          }
          return null;
        }
        teamPaths[t.code + teamSuffixes[t.code]].push({x, y, pos: relPos})
        if (t.currentRound || round_idx === roundTeams.length - 1) {
          return ({
            id: t.code,
            ...t,
            name1: `${t.w}-${t.l} / ${t.ordinalStanding}`,
            is_single_node: true,
            height: node_point_height,
            padding: node_point_height,
            x,
            y,
          })
        }
        return ({
          id: t.code,
          ...t,
          name: "",
          is_single_node: true,
          height: t.currentRound ? node_single_height : node_point_height,
          padding: t.currentRound ? node_single_height : node_point_height,
          x,
          y,
        })
      })


      if (advanced.length) lastPool = "*";


      const matches = round.map(match => {
        if (match) {
          if (match.pool !== lastPool) nodeY += padSpace * 2;
          lastPool = match.pool;

          const y = nodeY;
          nodeY += node_height + padSpace;

          teamPaths[match.team1.code + teamSuffixes[match.team1.code]].push({x, y: y - node_height / 8, pos: relPos})
          teamPaths[match.team2.code + teamSuffixes[match.team2.code]].push({x, y: y + node_height / 8, pos: relPos + tightness})

          if (match.undetermined) {
            if (teamSuffixes[match.team1.code] === "") {
              teamSuffixes[match.team1.code] = "_";
              teamPaths[match.team1.code + "_"] = [{x, y: y - node_height / 8, pos: relPos}];
            }
            if (teamSuffixes[match.team2.code] === "") {
              teamSuffixes[match.team2.code] = "_";
              teamPaths[match.team2.code + "_"] = [{x, y: y + node_height / 8, pos: relPos + tightness}];
            }
          }

          relPos += tightness * 2;

          return ({
            id: match.pool + " - match " + match['match'],
            name: `${match.pool} Match`,
            name1: match.team1.name,
            name2: match.team2.name,
            logo1: match.team1.logo,
            logo2: match.team2.logo,
            logo: null,
            text_mid: match.score[0].map((x, _idx) => `${x}:${match.score[1][_idx]}`).join(" / "),
            parents: [match.team1.code, match.team2.code],
            height: node_height,
            padding: node_height,
            toggle: match.toggle,
            x,
            y,
          })
        }
      }).filter(m=>m)

      if (matches.length) {
        nodeY += padSpace * 2;
      }


      const eliminated = eliminatedOnDiagram ? teams.filter(t => t.elim).map(t => {
        const y = nodeY;
        nodeY += node_single_height + padSpace;
        relPos += tightness;
        if (t.tiebreakerOtherTeam > t.standing) {
          teamPaths[t.code + teamSuffixes[t.code]].push({x, y, pos: relPos})
          if (t.tiebreakerUndetermined) {
            if (teamSuffixes[t.code] === "") {
              teamSuffixes[t.code] = "_";
              teamPaths[t.code + "_"] = [{x, y: y + node_height / 4, pos: relPos}];
            }
          }
          const team2 = teams[t.tiebreakerOtherTeam - 1];
          return ({
            id: t.code,
            ...t,
            name: t.tiebreakerConfig.name,
            name1: t.name,
            name2: team2.name,
            logo1: t.logo,
            logo2: team2.logo,
            is_single_node: true,
            height: node_height + padSpace,
            padding: node_height + padSpace,
            x,
            y: y + node_single_height,
            toggle: t.toggle,
          })
        } else if (t.tiebreakerOtherTeam < t.standing) {
          teamPaths[t.code + teamSuffixes[t.code]].push({x, y, pos: relPos})
          return null;
        }

        teamPaths[t.code + teamSuffixes[t.code]].push({x, y, pos: relPos})
        if (t.currentRound || round_idx === roundTeams.length - 1) {
          return ({
            id: t.code,
            ...t,
            name1: `${t.w}-${t.l} / ${t.ordinalStanding}`,
            is_single_node: true,
            height: node_point_height,
            padding: node_point_height,
            x,
            y,
          })
        }
        return ({
          id: t.code,
          ...t,
          name: "",
          is_single_node: true,
          height: t.currentRound ? node_single_height : node_point_height,
          padding: t.currentRound ? node_single_height : node_point_height,
          x,
          y,
        })
      }) : [];

      return [...advanced, ...matches, ...eliminated]
    }).flat().filter(x => x)

    const finalRound = roundTeams[roundTeams.length - 1];
    const finalStatus = new Set(finalRound.map(x => x.status));


    const level_delta = level_padding_delta * 2 / 2;
    nodeY = level_padding_initial - level_y_padding - level_delta;

    const finalRounds = Array.from(finalStatus).filter(
      x => eliminatedOnDiagram || x !== "eliminated"
    ).map(status => {
      const nextX = x + round_width;
      const statusTeams = finalRound.filter(x => x.status === status);
      const cnt = statusTeams.length;
      const height = node_single_height * cnt;


      nodeY += (level_y_padding) * cnt;
      const y = nodeY;


      nodeY += (node_single_height) * cnt;
      let d = 0;
      for(const t of statusTeams) {
        teamPaths[t.code + teamSuffixes[t.code]].push({x: nextX, y: y + (d - cnt / 2 + .5) * node_single_height * 0.5, pos: .9})
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

        const teamColorName = (team[team.length - 1] === "_") ? team.substring(0,team.length - 1) : team;

        return {
          links,
          color: colorTeams[teamColorName],
          dashed: team[team.length - 1] === "_"
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
        style={{ height: _teams.length * 30 + 200, maxHeight: "80vh" }}
      >
        <svg
          width={layout.width}
          height={layout.height}
          style={{
            backgroundColor: background_color
          }}>
          <style>{`
        text {
          font-family: Nunito;
          font-size: 12px;
        }
        .graph:hover .link:not(:hover) {
          opacity: 0.2
        }
        .node {
          stroke-linecap: round;
          cursor: grab;
        }
        .link {
          fill: none;
        }`}</style>

          <g className="graph">
            {bundles.map((b, _) => {
              let d = b.links
                .map(
                  l => straightCorner ? `
          M${l.xt} ${l.yt}
          L${l.xb} ${l.yt}
          L${l.xb} ${l.ys}
          L${l.xs} ${l.ys}` : `
          M${l.xt} ${l.yt}
          L${l.xb - l.c1} ${l.yt}
          A${l.c1} ${l.c1} 90 0 ${l.rev < 0 ? 0 : 1} ${l.xb} ${l.y1}
          L${l.xb} ${l.y2}
          A${l.c2} ${l.c2} 90 0 ${l.rev < 0 ? 1 : 0} ${l.xb + l.c2} ${l.ys}
          L${l.xs} ${l.ys}`
                )
                .join("");
              return <path key={d} strokeDasharray={b.dashed && this.props.dash ? "10,3" : null} className="link" d={d} stroke={b.color} strokeWidth="3"/>;
            })}
          </g>

          {nodes.map(
            n =>
              <g key={"_g/" + n.id + "/" + n.x + "/" + n.y}>
                {
                  n.name && (n.logo ? (
                    <>
                      <image x={n.x + 4} y={n.y - n.height / 2 + 4 - 10} width={12} height={12} href={n.logo} />
                      <text x={n.x + 4 + 16} y={n.y - n.height / 2 + 4}>{n.name}</text>
                    </>
                  ) : (
                    <text x={n.x + 4} y={n.y - n.height / 2 + 4}>{n.name}</text>
                  ))
                }
                {
                  n.name1 && (
                    <>
                      <image x={n.x + 4} y={n.y - n.height / 2 + 16 - 10} width={12} height={12} href={n.logo1} />
                      <text key={"_4" + n.id} x={n.x + 4 + 16} y={n.y - n.height / 2 + 16}>{n.name1}</text>
                    </>
                  )
                }
                {
                  n.name2 && (
                    <>
                      <image x={n.x + 4} y={n.y - n.height / 2 + 42 - 10} width={12} height={12} href={n.logo2} />
                      <text key={"_4" + n.id} x={n.x + 4 + 16} y={n.y - n.height / 2 + 42}>{n.name2}</text>
                    </>
                  )
                }
                {n.text_mid && <text key={"_4" + n.id} x={n.x + 4} y={n.y - n.height / 2 + 28}>{n.text_mid}</text>}

                <path onClick={n.toggle} key={"_1" + n.id} className="selectable node" data-id={n.id} stroke="black"
                      strokeWidth="8" d={`M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`} />
                <path onClick={n.toggle} key={"_2" + n.id} className="node" stroke="white" strokeWidth="4"
                      d={`M${n.x} ${n.y - n.height / 2} L${n.x} ${n.y + n.height / 2}`} />
              </g>
          )}
        </svg>
      </svg>
    );
  }

}
