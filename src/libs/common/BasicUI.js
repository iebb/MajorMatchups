import {Button, Form, Label, Radio} from 'semantic-ui-react';
import {getMatchupDisplay} from './Display';
import GraphBuilder from '../../graphics/GraphBuilder';
import React from 'react';

export class BasicUI extends React.Component {

  state = {
    hideMatchUI: (localStorage.hideMatchUI || "false") === "true",
    hideVisualizationUI: (localStorage.hideVisualizationUI || "false") === "true",
    matchOnly: (localStorage.matchOnly || "false") === "true",
    trackPickems: (localStorage.matchOnly || "true") === "true",
    eliminatedOnVisualization: (localStorage.dash || "true") === "true",
    dash: (localStorage.dash || "true") === "true",
    tight: (localStorage.tight || "false") === "true",
    straightCorner: (localStorage.straightCorner || "false") === "true",
    interactiveMode: false, // (localStorage.interactiveMode || "true") === "true",
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

  isInteractiveModeEnabled = () => {
    return false;
    // if (this.props.state.event !== "22antwerp") return false;
    //return !Object.keys(this.props.state.scores).length;

  }

  render() {
    const { trackPickems, matchOnly, interactiveMode, iRound, hideMatchUI, hideVisualizationUI } = this.state;
    const { state, shuffle, advance } = this.props;
    const rounds = Array.from(Array(state.rounds + 1).keys());

    return (
      <div style={{ marginTop: 20 }}>
        <Form style={{ marginTop: 20 }} inverted>
          <Form.Field>
            {
              this.isInteractiveModeEnabled() && (
                <div style={{ margin: 10, display: 'inline-block' }}>
                  <Radio toggle onChange={
                    (e, { checked }) => {
                      this.setState({ interactiveMode: checked });
                      localStorage.interactiveMode = checked;
                    }
                  } label={"\u00A0"} checked={interactiveMode} />
                  {
                    this.state.interactiveMode ? (
                      <Label color='red' tag>
                        Round by Round
                      </Label>
                    ) : (
                      <Label color='blue' tag>
                        Classic Mode
                      </Label>
                    )
                  }
                </div>
              )
            }
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
                  this.setState({ hideVisualizationUI: checked });
                  localStorage.hideVisualizationUI = checked;
                }
              } label='Hide Visualization UI' checked={hideVisualizationUI} />
            </div>
          </Form.Field>
        </Form>

        {
          !hideMatchUI && (
            <div className="main-container">
              {
                this.isInteractiveModeEnabled() && interactiveMode ? (
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
                  <div>
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
                    {
                      advance && (
                        <div style={{ marginTop: 50 }}>
                          <Button
                            basic
                            onClick={advance}
                            inverted
                            content="Next Stage"
                            icon='right arrow'
                            labelPosition='right'
                            size="huge"
                          />
                        </div>
                      )
                    }
                  </div>
                )
              }
            </div>
          )
        }
        {inter}
        {
          (!interactiveMode || iRound >= (state.rounds)) && (
            <>
              {
                (!hideVisualizationUI) && (
                  <div className='main-container'>
                    <h1 className='round-title'>
                      Visualization
                    </h1>
                    <Form style={{ marginTop: 20 }} inverted>
                      <Form.Field>
                        <div style={{ margin: 10, display: 'inline-block' }}>
                          <Radio toggle onChange={
                            (e, { checked }) => {
                              this.setState({ eliminatedOnVisualization: checked });
                              localStorage.eliminatedOnVisualization = checked;
                            }
                          } label='Show Eliminated' checked={this.state.eliminatedOnVisualization} />
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
                        eliminatedOnVisualization={this.state.eliminatedOnVisualization}
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
