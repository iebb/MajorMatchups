import HoverPopover from './Popover';
import { plus_minus } from '../libs/plus_minus';
import React from 'react';

export const BuchholtzPopup = ({ team, teams, enabled = true, children=null }) => {
  if (!enabled || !team.buchholtzBreakdown || team.buchholtzBreakdown.length === 0) {
    return children;
  }
  return (
    <HoverPopover
      inverted
      popup={
        <table className="text-left">
          <thead>
          <tr>
            <th colSpan={2}>Opponent</th>
            <th className="p-2 text-center">Status</th>
            <th className="p-2 text-center">Score</th>
          </tr>
          </thead>
          <tbody>
          {
            (team.buchholtzBreakdown || []).map((opp, _idx) => teams[opp.code] &&
              <tr key={_idx}>
                <td className="w-[24px]">
                  <div className="h-[24px] w-[24px] inline-block mr-3 content-center">
                    <img className="max-w-[24px]"
                         src={teams[opp.code].logo}
                         alt={opp.code}
                         title={opp.code}
                    />
                  </div>
                </td>
                <td className="min-w-[10rem] text-left">
                  <b>{teams[opp.code].name}</b>
                  <p>{teams[opp.code].description}</p>
                </td>
                <td className="text-center">{teams[opp.code].w}-{teams[opp.code].l}</td>
                <td className="text-center">{plus_minus(opp.b)}</td>
              </tr>
            )
          }
          <tr className="border-t-2 border-t-blue-gray-400">
            <td colSpan={3} className="py-2"><b>Total Buchholtz</b></td>
            <td className="text-center py-2">{team.buchholtz}</td>
          </tr>
          <tr className="border-t-2 border-t-blue-gray-400">
            <td colSpan={3} className="py-2"><b>Team Seeding</b></td>
            <td className="text-center py-2">{team.seed}</td>
          </tr>
          </tbody>
        </table>
      }
      position='bottom center'
    >
      {
        children || (
          <span className="team-box-text">/ {team.buchholtzLocked ? "🔒" : plus_minus(team.buchholtz)}</span>
        )
      }
    </HoverPopover>
  )
}
