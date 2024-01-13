import {isSwissBuchholtzFormat} from "../../libs/common/formats/formats";
import { ordinal } from '../../libs/plural';
import React from 'react';
import { BuchholtzPopup } from '../BuchholtzPopup';
import { Chip } from '@material-tailwind/react';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export const getMatchupDisplay = (state, stage) => {

  const stateMatches = state.matches;
  const stateRoundTeams = state.roundTeams;
  const statePickemTags = state.pickemTags;



  let { trackPickems, matchOnly } = state;

  if (stage === state.rounds) matchOnly = false;


  const roundTeams = (stateRoundTeams[stage] || []);
  const stageMatches = stateMatches[stage];
  const teams = {}
  for(const team of roundTeams) {
    teams[team.code] = team;
  }

  if (!roundTeams) return null;
  if (!stageMatches) return null;

  const altTimeline = stageMatches.filter((x) => x.result && x.picked !== x.result).length;

  const pickEms = statePickemTags && statePickemTags.length ? getCookie(statePickemTags[0]) : "";
  const picked = {};
  try {
    for (const pick of pickEms.split("|")) {
      const pickSplit = pick.split(":");
      picked[pickSplit[1]] = parseInt(pickSplit[0], 10);
    }
  } catch (e) {

  }
  const teamLogo = team => {
    const pick = picked[team.code];

    if (typeof pick === 'undefined' || !trackPickems) return (
      <img className="team-logo" src={team.logo} alt={team.name} title={team.name} />
    );

    if (pick === 0) return (
      <>
        <img className="team-logo" src={team.logo} alt={team.name} title={team.name} />
        <Chip
          color={team.l === 0 ? team.w === 3 ? 'green' : 'blue' : 'red'}
          style={{ position: 'absolute', zIndex: 9, fontSize: 14, width: 36, bottom: 0, padding: 1, right: 0 }}
          value="3-0"
        />
      </>
    );
    if (pick === 8) return (
      <>
        <img className="team-logo" src={team.logo} alt={team.name} title={team.name} />
        <Chip
          color={team.w === 0 ? team.l === 3 ? 'green' : 'blue' : 'red'}
          style={{ position: 'absolute', zIndex: 9, fontSize: 14, width: 36, bottom: 0, padding: 1, right: 0 }}
          value="0-3"
        />
      </>
    );

    return (
      <>
        <img className="team-logo" src={team.logo} alt={team.name} title={team.name} />
        <Chip
          color={team.l < 3 ? team.w === 3 ? 'green' : 'blue' : 'red'}
          style={{ position: 'absolute', zIndex: 9, fontSize: 14, width: 36, bottom: 0, padding: 1, right: 0 }}
          value="Adv"
        />
      </>
    );
  }

  return (
    <div key={stage}>
      {roundTeams.filter(x => x.adv).filter(x => x.tiebreaker || !matchOnly).map((team, _) => {
        return (
          <div key={team.code} className={`team one ${team.status}`}>
            <div className="team-box up" style={
              team.tiebreaker ? { background: 'repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px)' } : {}
            }>
              <div className="team-box-split b">
                <span className="team-box-text">
                  {`${team.w}-${team.l}`} {team.tiebreaker && "TB"}
                </span>
              </div>
            </div>
            {team.tiebreaker ? team.tiebreakerScores && team.tiebreakerScores.map((p, idx) => (
              <div className="team-box down" key={idx + '_tbs'}>
                <div className="team-box-split b">
                  <span className={`team-box-text`}>
                    {p}
                  </span>
                </div>
              </div>
            )) : (
              <div className="team-box down">
                <div className="team-box-split b">
                <span className="team-box-text">
                  {`${ordinal(team.standing)} (${team.abbrev})`}
                </span>
                </div>
              </div>
            )}
            <div className="team-box med">
              {
                (team.tiebreaker) ? (
                  <div className={
                    `team-box-split b tb-${team.tiebreakerStats ? "win" : "lose"}`
                  } onClick={() => team.setTiebreakerWin()}>
                    {teamLogo(team)}
                  </div>
                ) : (
                  <div className="team-box-split b">
                    {teamLogo(team)}
                  </div>
                )
              }
            </div>
            <div className="team-box down">
              <div className="team-box-split b">
                <span className="team-box-text">#{team.seed} <sub>
                {
                  (isSwissBuchholtzFormat(state.tournamentType)) && <BuchholtzPopup
                    team={team}
                    teams={teams}
                  />
                }
                </sub>
                </span>
              </div>
            </div>
            {
              (state.showDescription || stage === 0) && (
                <div className="team-box down">
                  <div className="team-box-split b">
                    <span className="team-box-text-sm">{team.description}</span>
                  </div>
                </div>
              )
            }
          </div>
        )
      })}
      {stageMatches.map((x) => {
        if (x.is_tiebreaker) {
          return null;
        }
        let pickA, pickB, resultA, resultB;
        if (x.picked === 1) {
          pickA = 'win';
          pickB = 'lose';
        } else if (x.picked === -1) {
          pickA = 'lose';
          pickB = 'win';
        }

        if (x.locked) {
          pickA += " locked"
          pickB += " locked"
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

        if (x.team2.code === null) {

          return (
            <div key={`match-${x.pool}-${x.match}`} className="team">
              <div className="team-box up" style={{ background: `hsla(${100.0 * x.team1.w / (x.team1.w + x.team1.l)}, 100%, 50%, 0.5)` }}>
                <div className="team-box-split b">
                  <span className="team-box-text">{x.pool}</span>
                </div>
              </div>
              <div className="team-box med">
                <div className={`team-box-split b ${pickA} ${resultA}`} onClick={() => x.setWinner(1)}>
                  {teamLogo(x.team1)}
                </div>
              </div>
              <div className="team-box down">
                <div className="team-box-split b">
                  <span className="team-box-text" title="Seed, Low to High" >#{x.team1.seed} <sub>
                {
                  (isSwissBuchholtzFormat(state.tournamentType)) && <BuchholtzPopup
                    team={x.team1}
                    teams={teams}
                  />
                }
                </sub>
                  </span>
                </div>
              </div>
              {
                (state.showDescription || stage === 0) && (
                  <div className="team-box down">
                    <div className="team-box-split b">
                      <span className="team-box-text-sm">{x.team1.description}</span>
                    </div>
                  </div>
                )
              }
            </div>
          );
        }


        return (
          <div key={`match-${x.pool}-${x.match}`} className="team two">
            <div className="team-box up" style={{ background: `hsla(${100.0 * x.team1.w / (x.team1.w + x.team1.l)}, 100%, 50%, 0.5)` }}>
              <div className="team-box-split b">
                <span className="team-box-text">{x.pool}</span>
              </div>
            </div>
            {state.scores && x.score[0].map((p, idx) => (
              <div className="team-box down" key={idx}>
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
            ))}
            <div className="team-box med">
              <div className={`team-box-split b ${pickA} ${resultA}`} onClick={() => x.setWinner(1)}>
                {teamLogo(x.team1)}
              </div>
              <div className={`team-box-split b ${pickB} ${resultB}`} onClick={() => x.setWinner(-1)}>
                {teamLogo(x.team2)}
              </div>
            </div>
            <div className="team-box down">
              <div className="team-box-split b">
                  <span className="team-box-text" title="Seed, Low to High" >#{x.team1.seed} <sub>
                {
                  (isSwissBuchholtzFormat(state.tournamentType)) && <BuchholtzPopup
                    team={x.team1}
                    teams={teams}
                  />
                }
                </sub>
                  </span>
              </div>
              <div className="team-box-split b">
                  <span className="team-box-text" title="Seed, Low to High" >#{x.team2.seed} <sub>
                {
                  (isSwissBuchholtzFormat(state.tournamentType)) && <BuchholtzPopup
                    team={x.team2}
                    teams={teams}
                  />
                }
                </sub>
                  </span>
              </div>
            </div>
            {
              (state.showDescription || stage === 0) && (
                <div className="team-box down">
                  <div className="team-box-split b">
                    <span className="team-box-text-sm">{x.team1.description}</span>
                  </div>
                  <div className="team-box-split b">
                    <span className="team-box-text-sm">{x.team2.description}</span>
                  </div>
                </div>
              )
            }
          </div>
        );
      })}
      {roundTeams.filter(x => x.elim).filter(x => x.tiebreaker || !matchOnly).map((team, _) => (
        <div key={team.code} className={`team one ${team.status}`}>
          <div className="team-box up">
            <div className="team-box-split b">
                <span className="team-box-text">
                  {team.w}-{team.l}
                </span>
            </div>
          </div>
          <div className="team-box down">
            <div className="team-box-split b">
              <span className="team-box-text">{ordinal(team.standing)} ({team.abbrev})</span>
            </div>
          </div>
          <div className="team-box med">
            <div className="team-box-split b">
              {teamLogo(team)}
            </div>
          </div>
          <div className="team-box down">
            <div className="team-box-split b">
                <span className="team-box-text">#{team.seed} <sub>
                {
                  (isSwissBuchholtzFormat(state.tournamentType)) && <BuchholtzPopup
                    team={team}
                    teams={teams}
                  />
                }
                </sub>
                </span>
            </div>
          </div>
          {
            (state.showDescription || stage === 0) && (
              <div className="team-box down">
                <div className="team-box-split b">
                  <span className="team-box-text-sm">{team.description}</span>
                </div>
              </div>
            )
          }
        </div>
      ))}
      {
        altTimeline > 0 && (
          <p style={{ color: "yellow", marginTop: 15, fontWeight: 600 }}>
            {altTimeline} match(es) in <span style={{ color: "#ed293f" }}>red</span> are having different outcomes than you have picked.
          </p>
        )
      }
    </div>
  );
}
