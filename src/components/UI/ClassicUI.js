import { getMatchupDisplay } from './ClassicDisplay';
import React from 'react';

export function ClassicUI({ preferences, state, shuffle }) {
  const { trackPickems, matchOnly } = preferences;
  const rounds = Array.from(Array(state.rounds + 1).keys());

  return (
    <div className="pt-4">
      <div className="main-container">
        {
          rounds.map((round) => (
            <div key={"match-" + round} className="pt-4">
              <h1 className="round-title">
                {round === (state.rounds) ? `Final Results` : `Round ${round + 1}`}
                {
                  round < state.rounds &&
                  <span
                    style={{ float: "right", fontSize: "50%" }}
                    onClick={() => shuffle(round)}
                  >[shuffle]</span>
                }
              </h1>
              <div key={"_" + round}>{getMatchupDisplay({...state, trackPickems, matchOnly}, round)}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

