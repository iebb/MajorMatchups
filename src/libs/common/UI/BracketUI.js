import { Form, Radio } from 'semantic-ui-react';
import React from 'react';
import styles from './bracket.module.css';


const colors = (result, deterministic) => {
  return `bg-${result ? result < 0 ? "red" : "green" : "blue"}-${deterministic ? "50" : "100"}`;
  // can be bg-red-400 bg-red-200 bg-red-300 bg-red-100 bg-red-50
  // can be bg-green-400 bg-green-200 bg-green-300 bg-green-100 bg-green-50
  // can be bg-blue-400 bg-blue-200 bg-blue-300 bg-blue-100 bg-blue-50
};

export class BracketUI extends React.Component {

  state = {
    matchOnly: (localStorage.matchOnly || "false") === "true",
    trackPickems: (localStorage.trackPickems || "true") === "true",
  }

  render() {
    const { trackPickems, matchOnly } = this.state;
    const { state } = this.props;
    const rounds = Array.from(Array(state.rounds + 1).keys());

    const renderTeams = (bracket, isFinal=false) => {
      if (bracket.teams.length === 0) return null;
      return (
        <div key={bracket.pool} className={`${styles.noMatch} rounded-md border-2 border-blue-500 shadow-md`}>
          {bracket.teams.map((team, index) => (
            <div className={styles.teamNomatch} key={index}>
              <span className={`${styles.teamRanking} `}>#{team.ranking}</span>
              <div className={`${styles.team} hover:bg-blue-100`}>
                <div className={styles.teamLogo}>
                  <img alt={team.code} src={team.logo} className="transfer-team-logo" />
                </div>
                <span className={`${styles.teamName} `}>{team.name}</span>
                <span className={styles.scores}>
                  <span className={``}>
                    {team.buchholtz > 0 ? "+" : ""}
                    {team.buchholtz}
                    {
                      isFinal && (" " + team.status)
                    }
                  </span>
              </span>
              </div>
            </div>
          ))}
        </div>
      );
    };

    const renderMatches = (roundMatches) => {
      return roundMatches.map((match, index) => (
        <div key={index} className={`${styles.match} rounded-md border-2 border-blue-500 ${match.result ? "":"border-dashed "} shadow-md`}>
          <div className={`${styles.matchNumber} p-1 `}>M<br />{match.id}</div>
          <div
            className={`${styles.team} hover:bg-blue-100 ${colors(match.picked, match.result)}`}
            onClick={() => {
              match.setWinner(1);
            }}
          >
            <div className={styles.teamLogo}>
              <img alt={match.team1.code} src={match.team1.logo} className="transfer-team-logo" />
            </div>
            <span className={`${styles.teamName} `}>{match.team1.name}</span>
            <span className={`${styles.scores} ${colors(match.result, 1)}`}>
            {match.score[0] && match.score[0].map((x, _idx) => (
              <span className={`${styles.score} ${x > match.score[1][_idx] && "font-bold"}`} key={_idx}>
                {x}
              </span>
            ))}
          </span>
          </div>
          <div
            className={`${styles.team} hover:bg-blue-100 ${colors(-match.picked, match.result)}`}
            onClick={() => {
              match.setWinner(-1);
            }}
          >
            <div className={styles.teamLogo}>
              <img alt={match.team2.code} src={match.team2.logo} className="transfer-team-logo" />
            </div>
            <span className={`${styles.teamName} `}>{match.team2.name}</span>
            <span className={`${styles.scores} ${colors(-match.result, 1)}`}>
          {match.score[1] && match.score[1].map((x, _idx) => (
            <span className={`${styles.score} ${x > match.score[0][_idx] && "font-bold"}`} key={_idx}>
              {x}
            </span>
          ))}
        </span>
          </div>

        </div>
      ));
    };

    return (
      <div style={{ marginTop: 20 }}>
        <Form style={{ marginTop: 20 }} inverted>
          <Form.Field>
            {/*<div style={{ margin: 10, display: 'inline-block' }}>*/}
            {/*  <Radio toggle onChange={*/}
            {/*    (e, { checked }) => {*/}
            {/*      this.setState({ trackPickems: checked });*/}
            {/*      localStorage.trackPickems = checked;*/}
            {/*    }*/}
            {/*  } label='Track Pick`em' checked={trackPickems} />*/}
            {/*</div>*/}
            <div style={{ margin: 10, display: 'inline-block' }}>
              <Radio toggle onChange={
                (e, { checked }) => {
                  this.setState({ matchOnly: checked });
                  localStorage.matchOnly = checked;
                }
              } label='Matches Only' checked={matchOnly} />
            </div>
          </Form.Field>
        </Form>

        <div className="main-container">
          <div className={styles.bracketWrapper}>
            <div className={`${styles.bracket} `}>
              <div className={styles.rounds}>
                {rounds.map((round, _idx) => {
                  if (matchOnly && _idx === rounds.length - 1) {
                    return null;
                  }
                  const matches = state.matches[round];
                  const roundTeams = state.roundTeams[round] || [];
                  const teamMatched = new Set();
                  const pools = {};

                  if (!matches) return null;
                  for(const team of roundTeams) {
                    pools[`${team.w}-${team.l}`] = {
                      order: team.w * 100 - team.l,
                      matches: [], teams: []
                    };
                  }
                  for(const match of matches) {
                    pools[match.pool] = {
                      order: match.poolOrder || match.team1.w * 100 - match.team1.l,
                      matches: [], teams: []
                    };
                    if (!match.is_bye) {
                      teamMatched.add(match.team1.code);
                      teamMatched.add(match.team2.code);
                    }
                  }
                  for(const match of matches) {
                    if (!match.is_bye) {
                      pools[match.pool].matches.push(match);
                    }
                  }
                  let idx = 0;
                  for(const team of roundTeams) {
                    ++idx;
                    if (!teamMatched.has(team.code)) {
                      if (!matchOnly) {
                        pools[`${team.w}-${team.l}`].teams.push({
                          ...team,
                          ranking: idx
                        });
                      }
                    }
                  }

                  const sortedPools = Object.keys(pools).sort((a, b) => {
                    return pools[b].order - pools[a].order;
                  });

                  return (
                  <div key={_idx} className={styles.round}>
                    <div className="text-xl font-semibold mb-2">{
                      _idx < rounds.length - 1 ? (
                        `Round ${_idx + 1}`
                      ) : (
                        "Final Result"
                      )
                    }</div>
                    {sortedPools.map((bracket, index) => {
                      if (pools[bracket].matches.length || pools[bracket].teams.length) {
                        return (
                          <div key={index} className={styles.bracket}>
                            <div className="text-lg font-semibold  mb-2">{bracket}</div>
                            {renderMatches(pools[bracket].matches)}
                            {renderTeams(pools[bracket], _idx === rounds.length - 1)}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                );})}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
