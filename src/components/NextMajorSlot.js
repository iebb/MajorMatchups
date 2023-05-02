import { ordinal } from '../libs/plural';
import React from 'react';

export const NextMajorSlot = ({state}) => {
  let legendResult, championResult;
  if (state.tournament === 1) {
    legendResult = state.roundTeams[5];
    if (!legendResult) return null;
    championResult = legendResult.filter(x => x.adv).map(x => ({...x, standings: "1st-8th"}))
  } else if (state.tournament === 2) {
    championResult = state.roundTeams[3];
    if (!championResult) return null;
    legendResult = state.legendResult;
  }

  const challengerResult = state.challengerResult;
  if (!legendResult || !championResult || !challengerResult) return null;

  const counters = {EU: 0, AM: 0, AP: 0};

  championResult = championResult.map(x => ({...x, status: "legends", regionCounter: ++counters[x.region]}));
  legendResult = legendResult.filter(
    x => x.elim
  ).map(x => ({...x, status: "challengers", regionCounter: ++counters[x.region]}));

  const losingTeamsinChallenger = state.challengerResult.filter(
    x => x.elim
  ).map(x => ({...x, status: "contenders"}));
  const challengerSlots = {EU:3, AM:3, AP:2}
  const regionOrders = ["EU", "AM", "AP"];
  for(const team of losingTeamsinChallenger) {
    if (challengerSlots[team.region] === 0) {
      for(const otherRegion of regionOrders) {
        if (challengerSlots[otherRegion] > 0) {
          team.region = otherRegion
          team.name += " / Slot Transferred to " + otherRegion
          break;
        }
      }
    }
    --challengerSlots[team.region];
    team.cont = true;
    team.standing += 8;
    team.regionCounter = ++counters[team.region]
  }

  const slots = losingTeamsinChallenger;

  const regions = {
    EU: { name: "EU", icon: "https://majors.im/images/regions/eu1.png" },
    AM: { name: "AM", icon: "https://majors.im/images/regions/am.png" },
    AP: { name: "AP", icon: "https://majors.im/images/regions/asia.png" },
  }

  const m = (team, _) => {
    const r = regions[team.region];
    const status = team.status;
    return (
      <div key={team.code} className={`team one ${status}`}>
        <div className="team-box down">
          <div className="team-box-split b">
                <span className="team-box-text">
                  {team.standings || ordinal(team.standing)}
                </span>
          </div>
        </div>
        <div className="team-box down">
          <div className="team-box-split b">
                <span className="team-box-text">
                  {r.name} #{team.regionCounter}
                </span>
          </div>
        </div>
        <div className="team-box med">
          <div className="team-box-split b stacked-logo">
            <img className="team-logo" src={r.icon} alt={r.icon} />
            <div className="team-logo-bg-container">
              <img className="team-logo-bg" src={team.logo} alt={team.name} title={team.name} />
            </div>
          </div>
        </div>
      </div>
    )
  };


  return (
    <div className='main-container'>
      <h1 className='round-title'>
        Next Major Slot Allocations
      </h1>
      <div>
        {championResult.map(m)}
      </div>
      <div>
        {legendResult.map(m)}
      </div>
      <div>
        {slots.map(m)}
      </div>
    </div>
  )
}
