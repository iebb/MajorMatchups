import { Form, Radio } from 'semantic-ui-react';
import { getMatchupDisplay } from './ClassicDisplay';
import React from 'react';

export class ClassicUI extends React.Component {

  state = {
    matchOnly: (localStorage.matchOnly || "false") === "true",
    trackPickems: (localStorage.matchOnly || "true") === "true",
  }

  render() {
    const { trackPickems, matchOnly } = this.state;
    const { state, shuffle } = this.props;
    const rounds = Array.from(Array(state.rounds + 1).keys());

    return (
      <div style={{ marginTop: 20 }}>
        <div className="main-container">
          {
            rounds.map((round) => (
              <div key={"match-" + round} style={{ marginTop: 20 }}>
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
}
