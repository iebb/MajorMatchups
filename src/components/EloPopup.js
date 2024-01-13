import HoverPopover from './Popover';
import { plus_minus } from '../libs/plus_minus';
import React from 'react';

export const EloPopup = ({ team, teams, enabled = true, children=null }) => {
  if (!enabled) { //  || team.eloBreakdown.length === 0
    return children;
  }
  return (
    <HoverPopover
      inverted
      popup={
        <table className="text-left">
          <thead>
          </thead>
          <tbody>
          <tr>
            <td colSpan={3} className="py-2"><b>Initial Seeding</b></td>
            <td className="text-center py-2">{team.seed}</td>
          </tr>
          <tr className="border-t-2 border-t-blue-gray-400">
            <td colSpan={3} className="py-2"><b>Current Standing</b></td>
            <td className="text-center py-2">#{team.standing}</td>
          </tr>
          <tr className="pb-2">
            <th className="pt-4 pb-2 " colSpan={2}>Team</th>
            <th className="pt-4 pb-2 px-4 text-center">W-L</th>
            <th className="pt-4 pb-2 text-center">Initial Elo</th>
          </tr>
          <tr className="border-b-2 border-b-blue-gray-400">
            <td className="w-[24px]">
              <div className="h-[24px] inline-block mr-3 content-center">
                <img className="max-w-[36px]"
                     src={team.logo}
                     alt={team.code}
                     title={team.code}
                />
              </div>
            </td>
            <td className="min-w-[10rem] text-left">
              <b>{team.name}</b>
              <p>{team.description}</p>
            </td>
            <td className="text-center">{team.w}-{team.l}</td>
            <td className="text-center">{team.initial_elo.toFixed(4)}</td>
          </tr>
          <tr className="pb-2">
            <th className="pt-4 pb-2 " colSpan={2}>Previous Opponents</th>
            <th className="pt-4 pb-2 px-4 text-center">Elo</th>
            <th className="pt-4 pb-2 text-center">Elo Change</th>
          </tr>
          {
            (team.eloBreakdown || []).map((opp, _idx) => teams[opp.code] &&
              <tr key={_idx}>
                <td className="w-[24px]">
                  <div className="h-[24px] inline-block mr-3 content-center">
                    <img className="max-w-[36px]"
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
                <td className="text-center">{opp.opponent_elo.toFixed(4)}</td>
                <td className="text-center">{plus_minus(opp.diff.toFixed(4))}</td>
              </tr>
            )
          }
          <tr className="border-t-2 border-t-blue-gray-400">
            <td colSpan={3} className="py-2"><b>Total Elo</b></td>
            <td className="text-center py-2">{team.elo.toFixed(4)}</td>
          </tr>
          </tbody>
        </table>
      }
      position='bottom center'
    >
      {
        children || (
          <span className="team-box-text">{team.elo.toFixed(2)}</span>
        )
      }
    </HoverPopover>
  )
}
