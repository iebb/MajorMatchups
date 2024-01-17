import { copy } from '../libs/common/common';
import React from 'react';

export const PickStats = ({ state }) => {
  const { pickStats } = state;
  if (!state.pickStats || !state.roundTeams[state.rounds]) {
    return null;
  }
  const rt = copy(state.roundTeams[state.rounds]);
  const s = this.getTab();
  if (s >= 2) return null;
  const groupId = 206 + s;

  const { stats, total } = pickStats;

  const tournamentPickTotal = total[groupId];
  if (!tournamentPickTotal) return null;
  const tournamentPickStats = stats[groupId];

  const advance = {}
  const threeZero = {}
  const zeroThree = {}

  for (const k of Object.keys(tournamentPickStats)) {
    advance[k] = tournamentPickStats[k]['Adv'] / tournamentPickTotal;
    threeZero[k] = tournamentPickStats[k]['3-0'] / tournamentPickTotal;
    zeroThree[k] = tournamentPickStats[k]['0-3'] / tournamentPickTotal;
  }

  const m = (team, _) => {
    return (
      <div key={team.code} className={`team one`}>
        <div className="team-box down">
          <div className="team-box-split b">
            <span className="team-box-text" title="3-0" style={{ color: "#ffc40a" }}>{(threeZero[team.code] * 100.0).toFixed(1)}%</span>
          </div>
        </div>
        <div className="team-box down">
          <div className="team-box-split b">
            <span className="team-box-text" title="Remaining 7 Advancing Teams" style={{ color: "#5eb1f6" }}>{(advance[team.code] * 100.0).toFixed(1)}%</span>
          </div>
        </div>
        <div className="team-box down">
          <div className="team-box-split b">
            <span className="team-box-text" title="0-3" style={{ color: "#8e8e8e" }}>{(zeroThree[team.code] * 100.0).toFixed(1)}%</span>
          </div>
        </div>
        <div className="team-box med">
          <div className="team-box-split b">
            <img className="team-logo" src={team.logo} />
          </div>
        </div>
      </div>
    )
  };


  return (
    <div className='main-container'>
      <h1 className='round-title'>
        Pick'em Stats (Detail: <a href="https://pick.ieb.im/stats">https://pick.ieb.im/stats</a>)
      </h1>
      <div>
        {rt.sort((y, x) => advance[x.code] - advance[y.code]).map(m)}
      </div>
    </div>
  )
}
