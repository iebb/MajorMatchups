import { Chip, IconButton } from '@material-tailwind/react';
import React from 'react';
import styles from './bracket.module.css';
import { plus_minus } from '../../libs/plus_minus';
import { BuchholtzPopup } from '../BuchholtzPopup';
import {Formats, isSwissBuchholtzFormat, isSwissBuchholtzOrEloFormat} from '../../libs/common/formats/formats';
import { BeakerIcon, CheckCircleIcon, ClockIcon, PlayCircleIcon } from '@heroicons/react/20/solid';
import { dingbats } from '../../libs/plural';


const colors = (result, deterministic) => {
  if (result < 0) return " text-gray-400";
  if (!deterministic) {
    return `bg-${result ? result < 0 ? "red" : "green" : "blue"}-undetermined`;
  }

  return `bg-${deterministic ? deterministic < 0 ? "red" : "green" : "blue"}-${deterministic ? "determined" : "undetermined"}`;
  // can be bg-red-400 bg-red-200 bg-red-300 bg-red-100 bg-red-50 bg-red-30 bg-red-determined bg-red-undetermined
  // can be bg-green-400 bg-green-200 bg-green-300 bg-green-100 bg-green-50 bg-green-30 bg-green-determined bg-green-undetermined
  // can be bg-blue-400 bg-blue-200 bg-blue-300 bg-blue-100 bg-nekoko-950 bg-blue-30 bg-blue-determined bg-blue-undetermined
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}



export function BracketUI({ preferences, state, shuffle }) {
  const { trackPickems, matchOnly, bestOfIndicator, teamStandings, abbrev } = preferences;
  const rounds = Array.from(Array(state.rounds + 1).keys());

  const format = state.tournamentType;
  const pickemTags = state.pickemTags;
  const pickEms = pickemTags && pickemTags.length ? getCookie(pickemTags[0]) : "";
  const picked = {};
  const pickEmStyle = pickEms.includes("9:") ? 2 : 1;
  try {
    for (const pick of pickEms.split("|")) {
      const pickSplit = pick.split(":");
      picked[pickSplit[1]] = parseInt(pickSplit[0], 10);
    }
  } catch (e) {

  }

  const pickChip = team => {
    if (!trackPickems) return null;
    const pick = picked[team.code];

    if (typeof pick === 'undefined' || !trackPickems) return null;


    let condition = '';
    let text = "A";

    if (pickEmStyle === 2) {

      if (pick <= 1) {
        condition = team.l === 0 ? team.w === 3 ?  'green' : 'blue' : 'red';
        text = "3";
      } else if (pick >= 8) {
        condition = team.w === 0 ? team.l === 3 ?  'green' : 'blue' : 'red';
        text = "0";
      } else {
        condition = ((team.l > 0 || team.w < 3) && team.l < 3) ? team.w === 3 ? 'green' : 'blue' : 'red';
        text = "A";
      }

    } else {
      if (pick === 0) {
        condition = team.l === 0 ? team.w === 3 ?  'green' : 'blue' : 'red';
        text = "3";
      } else if (pick === 8) {
        condition = team.w === 0 ? team.l === 3 ?  'green' : 'blue' : 'red';
        text = "0";
      } else {
        condition = team.l < 3 ? team.w === 3 ? 'green' : 'blue' : 'red';
        text = "A";
      }
    }

    return (
      <Chip
        color={condition}
        className="text-md rounded-l-none p-0 w-[12px] right-[-2px] h-[20px] text-center relative"
        value={text}
      />
    );
  }

  const renderTeams = (bracket, isFinal=false) => {
    if (bracket.teams.length === 0) return null;
    const team0 = bracket.teams[0];
    const borderColor = team0.statusFinalized ? (team0.border || "border-blue-500") : "border-blue-500";
    return (
      <div key={bracket.pool} className={
        `${styles.noMatch} ${isFinal ? styles.finalWidth : styles.roundWidth} rounded-md border-2 ${borderColor} shadow-md`
      }>
        {bracket.teams.map((team, index) => (

          <div className={styles.teamNomatch} key={index}>
            <span className={`${styles.teamRanking} `}>{team.ranking}</span>
            <div className={`${styles.team} hover:bg-blue-900`}>
              <BuchholtzPopup
                enabled={isSwissBuchholtzOrEloFormat(format)}
                team={team}
                teams={bracket.allTeams}
                key={index}
              >
                <div className={styles.teamLogo}>
                  <img alt={team.displayCode} src={team.logo} className="transfer-team-logo" />
                </div>
              </BuchholtzPopup>
              <span className={`${styles.teamName} `}>{team.name}</span>
              <BuchholtzPopup
                enabled={isSwissBuchholtzOrEloFormat(format)}
                team={team}
                teams={bracket.allTeams}
                key={index + "_"}
              >
                <span className={styles.scores}>
                  <span className={``}>
                    {isSwissBuchholtzFormat(format) && plus_minus(team.buchholtz)}
                    {
                      isFinal && (
                        (isSwissBuchholtzFormat(format) ? ", " : "")
                        + team.status
                      )
                    }
                  </span>
              </span>
              </BuchholtzPopup>
              <div className={styles.pickChip}>
                {pickChip(team)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMatches = (round) => {
    return round.matches.map((match, index) => (
      <div key={index} className={`${styles.match} ${styles.roundWidth} rounded-md border-2 border-blue-500 shadow-md`}>
        <div className={`${styles.matchNumber} p-1 ${match.result && (match.picked !== match.result) && "bg-red-300"} rounded-l-md`}>{
          match.result ?
            <CheckCircleIcon className="w-5 h-5 text-green-500" title="finished match" /> :
            (
              match.score && match.score[0]?.length ?
                  <PlayCircleIcon className="w-5 h-5 text-pink-500" title="ongoing match" /> :
                <ClockIcon className="w-5 h-5 text-blue-500" title="future match" />
            )
        }<p>{match.id}</p></div>
        <div
          className={`${styles.team} hover:bg-blue-900 ${colors(match.picked, match.result)}`}
          onClick={() => {
            match.setWinner(1);
          }}
        >
          <div className={styles.teamLogo}>
            <BuchholtzPopup
              enabled={isSwissBuchholtzOrEloFormat(format)}
              team={match.team1}
              teams={round.allTeams}
            >
              <img alt={match.team1.displayCode} src={match.team1.logo} className="transfer-team-logo" />
            </BuchholtzPopup>
          </div>
          <span className={`${styles.teamName} `}>
            {teamStandings && dingbats(match.team1.standing)} {abbrev ? match.team1.displayCode.toUpperCase() : match.team1.name}
          </span>
          <span className={`${styles.scores} ${match.score[0]?.length > 0 ? colors(match.result, 1) : ""}`}>
            {match.score[0].length ? match.score[0].map((x, _idx) => (
              <span className={`${styles.score} ${x > match.score[1][_idx] && "font-bold"}`} key={_idx}>
                {x}
              </span>
            )): (
              <span className={styles.score}>{match.picked === 1 ? "▲" : "▼"}</span>
            )}
          </span>
          <div className={styles.pickChip}>
            {pickChip(match.team1)}
          </div>
        </div>
        <div
          className={`${styles.team} hover:bg-blue-900 ${colors(-match.picked, -match.result)}`}
          onClick={() => {
            match.setWinner(-1);
          }}
        >
          <div className={styles.teamLogo}>
            <BuchholtzPopup
              enabled={isSwissBuchholtzOrEloFormat(format)}
              team={match.team2}
              teams={round.allTeams}
            >
              <img alt={match.team2.displayCode} src={match.team2.logo} className="transfer-team-logo" />
            </BuchholtzPopup>
          </div>
          <span className={`${styles.teamName} `}>
            {teamStandings && dingbats(match.team2.standing)} {abbrev ? match.team2.displayCode.toUpperCase() : match.team2.name}
          </span>

          <span className={`${styles.scores} ${match.score[1]?.length > 0 ? colors(-match.result, 1) : ""}`}>
          {
            match.score[1]?.length ? match.score[1].map((x, _idx) => (
              <span className={`${styles.score} ${x > match.score[0][_idx] && "font-bold"}`} key={_idx}>
                {x}
              </span>
            )) : (
              <span className={styles.score}>{match.picked === -1 ? "▲" : "▼"}</span>
            )
          }
          </span>
          <div className={styles.pickChip}>
            {pickChip(match.team2)}
          </div>
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
                  if (team.statusFinalized) {
                    pools[`${team.w}-${team.l}`] = {
                      order: team.w * 100 - team.l,
                      matches: [], teams: [], allTeams
                    };
                  } else {
                    pools[`${team.w}-${team.l}`] = {
                      order: team.w * 100 - team.l,
                      matches: [], teams: [], allTeams
                    };
                  }
                }
                for(const match of matches) {
                  pools[match.pool] = {
                    order: match.poolOrder || match.team1.w * 100 - match.team1.l,
                    bestOf: match.bestOf,
                    matches: [], teams: [], allTeams
                  };
                  if (!match.is_bye) {
                    teamMatched.add(match.team1.code);
                    teamMatched.add(match.team2.code);
                  }
                }
                for(const match of matches) {
                  if (!match.is_bye) {
                    match.team1.standing = allTeams[match.team1.code].standing;
                    match.team2.standing = allTeams[match.team2.code].standing;
                    pools[match.pool].matches.push(match);
                  }
                }
                for(const team of roundTeams) {
                  if (!teamMatched.has(team.code)) {
                    if (!matchOnly) {
                      pools[`${team.w}-${team.l}`].teams.push({
                        ...team,
                        ranking: team.standing
                      });
                    }
                  }
                }

                const sortedPools = Object.keys(pools).sort((a, b) => {
                  return pools[b].order - pools[a].order;
                });

                return (
                  <div key={_idx} className={styles.round}>
                    <div className="text-xl font-semibold mb-2" onClick={() => shuffle(_idx)}>
                      {
                        _idx < rounds.length - 1 ? (
                          <>
                            Round {_idx + 1}
                            {
                              Object.keys(pools).map(p => pools[p].matches.some(x => x.result === 0)).some(x => x) && (
                                <IconButton variant="outlined" className="inline-flex items-center gap-3 mx-3 h-7" color="white">
                                  <BeakerIcon strokeWidth={2} className="h-5 w-5" />
                                </IconButton>
                              )
                            }
                          </>
                        ) : (
                          "Final Result"
                        )
                      }
                    </div>
                    {sortedPools.map((bracket, index) => {
                      if (pools[bracket].matches.length || pools[bracket].teams.length) {
                        return (
                          <div key={index} className={styles.bracket}>
                            <div className="text-lg mb-2">{bracket}{(bestOfIndicator && pools[bracket].bestOf) && (` (Bo${pools[bracket].bestOf})`)}</div>
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
