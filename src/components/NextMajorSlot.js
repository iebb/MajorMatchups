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
          team.name = <>{team.name}<br/>{"Slot Transferred to " + otherRegion}</>
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

  const renderPart = (teams, title) => {
    return (
      <div className="border-2 rounded-md border-r-2 border-blue-500 w-full p-2 grid-cols-3">
        <table className="table-auto w-full text-sm text-left">
          <thead>
          <tr>
            <th colSpan="3" className="table-auto w-full text-lg text-center lowercase font-normal border-b-2">{title}</th>
          </tr>
          <tr className="text-sm">
            <th className="pl-1">#</th>
            <th className="py-1">Region</th>
            <th className="pr-1">Earned By</th>
          </tr>
          </thead>
          <tbody>
          {
            teams.map(team => {
              const r = regions[team.region];
              return (
                <tr className="text-sm" key={team.code}>
                  <td className="pl-1">{team.standings || ordinal(team.standing)}</td>
                  <td className="py-1">{r.name} #{team.regionCounter}</td>
                  <td className="px-0 ">
                    <img className="w-8 h-6 inline-block" src={team.logo} alt={team.name} title={team.name} />
                    {team.name}</td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className='main-container mt-4'>
      <h1 className='round-title'>
        Next Major Slot Allocations
      </h1>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {renderPart(championResult, "Champions")}
        {renderPart(legendResult, "Legends")}
        {renderPart(slots, "Challengers")}
      </div>
    </div>
  )
}
