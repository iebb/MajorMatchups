import {Button, Form, Radio} from 'semantic-ui-react';
import { getMatchupDisplay } from './Display';
import GraphBuilder from '../../graphics/GraphBuilder';
import React from 'react';

export class BasicUI extends React.Component {
  state = {
    hideMatchUI: (localStorage.hideMatchUI || "false") === "true",
    hideDiagramUI: (localStorage.hideDiagramUI || "false") === "true",
    matchOnly: (localStorage.matchOnly || "false") === "true",
    eliminatedOnDiagram: (localStorage.dash || "true") === "true",
    dash: (localStorage.dash || "true") === "true",
    tight: (localStorage.tight || "false") === "true",
    straightCorner: (localStorage.straightCorner || "false") === "true",
    interactiveMode: (localStorage.interactiveMode || "true") === "true",
    iRound: 0,
  }

  submitAnalytics = () => {
    const { state, stage } = this.props;
    fetch(`https://score-service.deta.dev/save_picks/${state.event}_${stage}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({teams: state.roundTeams[state.rounds].map(x => x.code)})
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.stage !== this.props.stage) {
      this.setState({ iRound: 0 });
    }
  }

  render() {
    const { matchOnly, interactiveMode, iRound, hideMatchUI, hideDiagramUI } = this.state;
    const { state, shuffle, extras } = this.props;
    const rounds = Array.from(Array(state.rounds + 1).keys());

    return (
      <div style={{ marginTop: 20 }}>
        <Form style={{ marginTop: 20 }} inverted>
          <Form.Field>
            <div style={{ margin: 10, display: 'inline-block' }}>
              <Radio toggle onChange={
                (e, { checked }) => {
                  this.setState({ interactiveMode: checked });
                  localStorage.interactiveMode = checked;
                }
              } label='Interactive Mode (beta)' checked={interactiveMode} />
            </div>
            <div style={{ margin: 10, display: 'inline-block' }}>
              <Radio toggle onChange={
                (e, { checked }) => {
                  this.setState({ matchOnly: checked });
                  localStorage.matchOnly = checked;
                }
              } label='Matches Only' checked={matchOnly} />
            </div>
            <div style={{ margin: 10, display: 'inline-block' }}>
              <Radio toggle onChange={
                (e, { checked }) => {
                  this.setState({ hideMatchUI: checked });
                  localStorage.hideMatchUI = checked;
                }
              } label='Hide Match UI' checked={hideMatchUI} />
            </div>
            <div style={{ margin: 10, display: 'inline-block' }}>
              <Radio toggle onChange={
                (e, { checked }) => {
                  this.setState({ hideDiagramUI: checked });
                  localStorage.hideDiagramUI = checked;
                }
              } label='Hide Diagram UI' checked={hideDiagramUI} />
            </div>
          </Form.Field>
        </Form>

        {
          !hideMatchUI && (
            <div className="main-container">
              {
                interactiveMode ? (
                  <div key={"match-" + iRound} style={{ marginTop: 20 }}>
                    <h1 className="round-title">
                      {iRound === (state.rounds) ? `Final Results` : `Round ${iRound + 1}`}
                    </h1>
                    <div key={"_" + iRound}>{getMatchupDisplay({...state, matchOnly}, iRound)}</div>
                    <div style={{ marginTop: 32 }}>
                      <Button
                        basic
                        onClick={() => {
                          this.setState({ iRound: iRound - 1});
                        }}
                        inverted
                        disabled={iRound <= 0}
                        content="Go Back"
                        icon='left arrow'
                        labelPosition='left'
                      />
                      <Button
                        basic
                        onClick={() => {
                          if (iRound + 1 >= (state.rounds)) {
                            this.submitAnalytics();
                          } else {
                            shuffle(iRound + 1);
                            console.log("shuffled");
                          }
                          this.setState({ iRound: iRound + 1});
                        }}
                        inverted
                        disabled={iRound >= (state.rounds)}
                        content="Next Round"
                        icon='right arrow'
                        labelPosition='right'
                      />
                    </div>
                    {
                      iRound < (state.rounds) &&
                      <div style={{ marginTop: 32 }}>
                        <Button
                          basic
                          onClick={() => shuffle(iRound)}
                          inverted
                          content="Shuffle"
                          icon='exchange'
                          labelPosition='right'
                        />
                      </div>
                    }
                  </div>
                ) : (
                  rounds.map((round) => (
                    <div key={"match-" + round} style={{ marginTop: 20 }}>
                      <h1 className="round-title">
                        {round === (state.rounds) ? `Final Results` : `Round ${round + 1}`}
                        {
                          round < 5 &&
                          <span
                            style={{ float: "right", fontSize: "50%" }}
                            onClick={() => shuffle(round)}
                          >[shuffle]</span>
                        }
                      </h1>
                      <div key={"_" + round}>{getMatchupDisplay({...state, matchOnly}, round)}</div>
                    </div>
                  ))
                )
              }
            </div>
          )
        }
        {
          (!interactiveMode || iRound >= (state.rounds)) && (
            <>
              {
                extras && (
                  <div>
                    {extras()}
                  </div>
                )
              }
              {
                (!hideDiagramUI) && (
                  <div className='main-container'>
                    <h1 className='round-title'>
                      Diagram
                    </h1>
                    <Form style={{ marginTop: 20 }} inverted>
                      <Form.Field>
                        <div style={{ margin: 10, display: 'inline-block' }}>
                          <Radio toggle onChange={
                            (e, { checked }) => {
                              this.setState({ eliminatedOnDiagram: checked });
                              localStorage.eliminatedOnDiagram = checked;
                            }
                          } label='Show Eliminated' checked={this.state.eliminatedOnDiagram} />
                        </div>
                        <div style={{ margin: 10, display: 'inline-block' }}>
                          <Radio toggle onChange={
                            (e, { checked }) => {
                              this.setState({ straightCorner: checked });
                              localStorage.straightCorner = checked;
                            }
                          } label='Straight Corners' checked={this.state.straightCorner} />
                        </div>
                        <div style={{ margin: 10, display: 'inline-block' }}>
                          <Radio toggle onChange={
                            (e, { checked }) => {
                              this.setState({ tight: checked });
                              localStorage.tight = checked;
                            }
                          } label='Vertical Overlapping' checked={this.state.tight} />
                        </div>
                        <div style={{ margin: 10, display: 'inline-block' }}>
                          <Radio toggle onChange={
                            (e, { checked }) => {
                              this.setState({ dash: checked });
                              localStorage.dash = checked;
                            }
                          } label='Dash for Provisional' checked={this.state.dash} />
                        </div>
                      </Form.Field>
                    </Form>
                    <div className='main-container' style={{ overflowX: 'scroll' }}>
                      <GraphBuilder
                        data={state}
                        eliminatedOnDiagram={this.state.eliminatedOnDiagram}
                        straightCorner={this.state.straightCorner}
                        tight={this.state.tight}
                        dash={this.state.dash}
                      />
                    </div>
                  </div>
                )
              }
            </>
          )
        }
      </div>
    );
  }
}
