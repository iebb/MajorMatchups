import React from 'react';
import styles from './bracket.module.css';
import { plus_minus } from '../../libs/plus_minus';
import { BuchholtzPopup } from '../BuchholtzPopup';
import { Formats } from '../../libs/common/formats/formats';


const colors = (result, deterministic) => {
  return `bg-${result ? result < 0 ? "red" : "green" : "blue"}-${deterministic ? "30" : "50"}`;
  // can be bg-red-400 bg-red-200 bg-red-300 bg-red-100 bg-red-50 bg-red-30
  // can be bg-green-400 bg-green-200 bg-green-300 bg-green-100 bg-green-50 bg-green-30
  // can be bg-blue-400 bg-blue-200 bg-blue-300 bg-blue-100 bg-blue-50 bg-blue-30
};

export function BracketUI({ preferences, state, shuffle }) {
  const { trackPickems, matchOnly } = preferences;
  const rounds = Array.from(Array(state.rounds + 1).keys());

  const format = state.tournamentType;

  const renderTeams = (bracket, isFinal=false) => {
    if (bracket.teams.length === 0) return null;
    return (
      <div key={bracket.pool} className={`${styles.noMatch} ${isFinal ? styles.finalWidth : styles.roundWidth} rounded-md border-2 border-blue-500 shadow-md`}>
        {bracket.teams.map((team, index) => (

          <div className={styles.teamNomatch} key={index}>
            <span className={`${styles.teamRanking} `}>#{team.ranking}</span>
            <div className={`${styles.team} hover:bg-blue-50`}>
              <div className={styles.teamLogo}>
                <img alt={team.code} src={team.logo} className="transfer-team-logo" />
              </div>
              <span className={`${styles.teamName} `}>{team.name}</span>
              <BuchholtzPopup
                enabled={format === Formats.SwissBuchholtz}
                team={team}
                teams={bracket.allTeams}
                key={index}
              >
                <span className={styles.scores}>
                  <span className={``}>
                    {format === Formats.SwissBuchholtz && plus_minus(team.buchholtz)}
                    {
                      isFinal && (
                        (format === Formats.SwissBuchholtz ? ", " : "")
                        + team.status
                      )
                    }
                  </span>
              </span>
              </BuchholtzPopup>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMatches = (round) => {
    return round.matches.map((match, index) => (
      <div key={index} className={`${styles.match} ${styles.roundWidth} rounded-md border-2 border-blue-500 ${match.result ? "":"border-dashed "} shadow-md`}>
        <div className={`${styles.matchNumber} p-1 `}>M<br />{match.id}</div>
        <div
          className={`${format === Formats.SwissBuchholtz ? styles.teamWithBuchholtz : styles.team} hover:bg-blue-50 ${colors(match.picked, match.result)}`}
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
          {format === Formats.SwissBuchholtz && (
            <BuchholtzPopup
              enabled={format === Formats.SwissBuchholtz}
              team={match.team1}
              teams={round.allTeams}
            >
              <span className={`${styles.buchholtz}`}>{plus_minus(match.team1.buchholtz)}</span>
            </BuchholtzPopup>
          )}
        </div>
        <div
          className={`${format === Formats.SwissBuchholtz ? styles.teamWithBuchholtz : styles.team} hover:bg-blue-50 ${colors(-match.picked, match.result)}`}
          onClick={() => {
            match.setWinner(-1);
          }}
        >
          <div className={styles.teamLogo}>
            <img alt={match.team2.code} src={match.team2.logo} className="transfer-team-logo" />
          </div>
          <span className={`${styles.teamName} `}>{match.team2.name}</span>

          <span className={`${styles.scores} ${colors(-match.result, 1)}`}>
          {
            match.score[1] && match.score[1].map((x, _idx) => (
              <span className={`${styles.score} ${x > match.score[0][_idx] && "font-bold"}`} key={_idx}>
                {x}
              </span>
            ))
          }
          </span>

          {format === Formats.SwissBuchholtz && (
            <BuchholtzPopup
              enabled={format === Formats.SwissBuchholtz}
              team={match.team2}
              teams={round.allTeams}
            >
              <span className={`${styles.buchholtz}`}>{plus_minus(match.team2.buchholtz)}</span>
            </BuchholtzPopup>
          )}
        </div>

      </div>
    ));
  };

  return (
    <div className="pt-4">

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

                const allTeams = {}
                for(const team of roundTeams) {
                  allTeams[team.code] = team;
                }


                for(const team of roundTeams) {
                  pools[`${team.w}-${team.l}`] = {
                    order: team.w * 100 - team.l,
                    matches: [], teams: [], allTeams
                  };
                }
                for(const match of matches) {
                  pools[match.pool] = {
                    order: match.poolOrder || match.team1.w * 100 - match.team1.l,
                    matches: [], teams: [], allTeams
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
                    <div className="text-xl font-semibold mb-2" onClick={() => shuffle(_idx)}>{
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
                            {renderMatches(pools[bracket])}
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
