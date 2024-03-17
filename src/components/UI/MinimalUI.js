import {BeakerIcon, ClockIcon, PlayCircleIcon} from '@heroicons/react/20/solid';
import {Chip, IconButton} from '@material-tailwind/react';
import React from 'react';
import {isSwissBuchholtzFormat, isSwissBuchholtzOrEloFormat} from '../../libs/common/formats/formats';
import {dingbats} from '../../libs/plural';
import {plus_minus} from '../../libs/plus_minus';
import {BuchholtzPopup} from '../BuchholtzPopup';
import {CountdownX} from "../Countdown";
import styles from './bracket.module.css';


const conflictColors = (picked, result) => {
  if (picked < 0) return "";
  if (result && picked !== result) {
    return `bg-red-${result ? "undetermined" : "determined"}`;
  }
  return "";
  // can be bg-red-400 bg-red-200 bg-red-300 bg-red-100 bg-red-50 bg-red-30 bg-red-determined bg-red-undetermined
  // can be bg-green-400 bg-green-200 bg-green-300 bg-green-100 bg-green-50 bg-green-30 bg-green-determined bg-green-undetermined
  // can be bg-blue-400 bg-blue-200 bg-blue-300 bg-blue-100 bg-nekoko-950 bg-blue-30 bg-blue-determined bg-blue-undetermined
};

const colors = (picked, result) => {
  if (picked < 0) return "";
  return `bg-${
    picked ? picked < 0 ? "red" : "green" : "blue"
  }-${result ? "determined" : "undetermined"} hover:bg-${picked ? picked < 0 ? "red" : "green" : "blue"}-300`;
  // can be hover:bg-red-300 bg-red-100 bg-red-50 bg-red-30 bg-red-determined bg-red-undetermined
  // can be hover:bg-green-300 bg-green-300 bg-green-100 bg-green-50 bg-green-30 bg-green-determined bg-green-undetermined
  // can be hover:bg-blue-300 bg-blue-300 bg-blue-100 bg-nekoko-950 bg-blue-30 bg-blue-determined bg-blue-undetermined
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}



export function MinimalUI({ preferences, state, shuffle }) {
  const { trackPickems, matchOnly, bestOfIndicator, teamStandings, abbrev } = preferences;
  const rounds = Array.from(Array(state.rounds + 1).keys());

  const format = state.tournamentType;
  const pickemTags = state.pickemTags;
  const pickEms = pickemTags && pickemTags.length ? getCookie(pickemTags[0]) : "";
  const picked = {};
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
    let condition = team.l < 3 ? team.w === 3 ? 'green' : 'blue' : 'red';
    let text = "A";
    if (pick === 0) {
      condition = team.l === 0 ? team.w === 3 ?  'green' : 'blue' : 'red';
      text = "3";
    } else if (pick === 8) {
      condition = team.w === 0 ? team.l === 3 ?  'green' : 'blue' : 'red';
      text = "0";
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
    return (
      <div key={bracket.pool} className={
        `flex flex-col ${isFinal ? "w-[250px]" : "w-[180px]"} bg-nekoko-900 text-xs rounded-md shadow-md`
      }>
        {bracket.teams.map((team, index) => (

          <div className={
            `grid grid-cols-[25px_auto]`
          } key={index}>
            <span className={`${styles.teamRanking} `}>{team.ranking}</span>
            <div className={`${styles.team} hover:bg-blue-900`}>
              <BuchholtzPopup
                enabled={isSwissBuchholtzOrEloFormat(format)}
                team={team}
                teams={bracket.allTeams}
                key={index}
              >
                <div className={styles.teamLogo}>
                  <img alt={team.code} src={team.logo} className="transfer-team-logo" />
                </div>
              </BuchholtzPopup>
              <span className={`${styles.teamName} `}>{abbrev ? team.displayCode.toUpperCase() : team.name}</span>
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
      <div key={index} className={
        `flex flex-row w-[180px] my-1 bg-nekoko-900 items-center justify-between rounded-md shadow-lg`
      }>
        <div
          className={`flex-[5] relative text-center h-[58px] rounded-l-md ${colors(match.picked, match.result)}`}
          onClick={() => {
            match.setWinner(1);
          }}
        >
          <div className="w-4 h-4 absolute left-0 text-sm">
            <BuchholtzPopup
              enabled={isSwissBuchholtzOrEloFormat(format)}
              team={match.team1}
              teams={round.allTeams}
            >
              <span>
            {teamStandings && dingbats(match.team1.standing)}
              </span>
            </BuchholtzPopup>
          </div>
          <img alt={match.team1.code} src={match.team1.logo} className="w-[42px] h-[42px] inline-block" />
          <p className={`h-[16px] text-xs px-1 text-center rounded-bl-md ${conflictColors(match.picked, match.result)}`}>
            {match.team1.displayCode.toUpperCase()}
          </p>
        </div>
        <div
          className={`flex-[5]`}
        >
          <div className={`flex-col text-xs text-center`}>
            {
              match.result === 0 && (
                <div className="flex-row">

                  {
                    (match.timestamp) ? (
                      <p className="text-center inline-block">
                        <CountdownX
                          date={match.timestamp * 1000}
                          live={<a href={`https://twitch.tv/${match.twitch}`} target="_blank" className="h-4 inline-block align-middle">
                            <img
                              src={"https://img.majors.im/twitch.ico"}
                              className="w-3 h-3 inline-block rounded align-middle"
                              alt="Twitch"
                            /> LIVE
                          </a>}
                        />
                        {
                          match.score && match.score[0]?.length ?
                            null :
                            match.twitch && (
                              <div>
                                <div className="h-4 inline-block align-middle">
                                  <a href={`https://twitch.tv/${match.twitch}`} target="_blank">
                                    <img
                                      src={"https://img.majors.im/twitch.ico"}
                                      className="w-3 h-3 inline-block rounded align-middle"
                                      alt="Twitch"
                                    /> Twitch
                                  </a>
                                </div>
                              </div>
                            )
                        }
                      </p>
                    ) : (
                      <p className="text-center inline-block">
                        {
                          match.score && match.score[0]?.length ?
                            <PlayCircleIcon className="w-4 h-4 text-pink-500" title="ongoing match"/> :
                            <ClockIcon className="w-4 h-4 text-blue-500" title="future match"/>
                        } {match.id}</p>
                    )
                  }
                </div>
              )
            }
            {match.score[0].map((x, _idx) => (
              <div className="flex flex-row text-xs" key={_idx}>
                <div className={`flex-1 text-right ${x > match.score[1][_idx] && "font-bold text-green-500"}`}>
                  {x}
                </div>
                <div className={`px-1`} key={_idx}> : </div>
                <div className={`flex-1 text-left ${x < match.score[1][_idx] && "font-bold text-green-500"}`}>
                  {match.score[1][_idx]}
                </div>
              </div>
            ))}
            {
              match.hltv && (
                <p className="text-center inline-block text-gray-400 flex-1 align-middle">
                  <a href={match.hltv} target="_blank">
                    <img
                      src={"https://img.majors.im//hltv.png"}
                      className="w-3 h-3 inline-block rounded align-middle"
                      alt="HLTV"
                    /> HLTV
                  </a>
                </p>
              )
            }
          </div>
        </div>
        <div
          className={`flex-[5] relative text-center h-[58px] rounded-r-md ${colors(-match.picked, -match.result)}`}
          onClick={() => {
            match.setWinner(-1);
          }}
        >
          <div className="w-4 h-4 absolute right-0 text-sm">

            <BuchholtzPopup
              enabled={isSwissBuchholtzOrEloFormat(format)}
              team={match.team2}
              teams={round.allTeams}
            >
              <span>
            {teamStandings && dingbats(match.team2.standing)}
              </span>
            </BuchholtzPopup>
          </div>
          <img alt={match.team2.code} src={match.team2.logo} className="w-[42px] h-[42px] inline-block" />
          <p className={`h-[16px] text-xs text-center rounded-br-md ${conflictColors(-match.picked, -match.result)}`}>
            {match.team2.displayCode.toUpperCase()}
          </p>
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
                    {
                      _idx < rounds.length - 1 ? (
                        sortedPools.map((bracket, index) => {
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
                        })
                      ) : (
                        sortedPools.map((bracket, index) => {
                          if (pools[bracket].teams.length) {
                            return (
                              <div key={index} className={styles.bracket}>
                                <div className="text-lg mb-2">{bracket}{(bestOfIndicator && pools[bracket].bestOf) && (` (Bo${pools[bracket].bestOf})`)}</div>
                                {renderTeams(pools[bracket], _idx === rounds.length - 1)}
                              </div>
                            );
                          }
                          return null;
                        })
                      )
                    }
                  </div>
                );})}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
