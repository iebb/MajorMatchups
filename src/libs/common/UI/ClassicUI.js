import { Form, Radio } from 'semantic-ui-react';
import { getMatchupDisplay } from '../Display';
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
        <Form style={{ marginTop: 20 }} inverted>
          <Form.Field>
            <div style={{ margin: 10, display: 'inline-block' }}>
              <Radio toggle onChange={
                (e, { checked }) => {
                  this.setState({ trackPickems: checked });
                  localStorage.trackPickems = checked;
                }
              } label='Track Pick`em' checked={trackPickems} />
            </div>
            <div style={{ margin: 10, display: 'inline-block' }}>
              <Radio toggle onChange={
                (e, { checked }) => {
                  this.setState({ matchOnly: checked });
                  localStorage.matchOnly = checked;
                }
              } label='Matches Only' checked={matchOnly} />
            </div>
          </Form.Field>
        </Form>

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
