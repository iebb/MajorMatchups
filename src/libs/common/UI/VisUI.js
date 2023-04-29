import { Form, Radio } from 'semantic-ui-react';
import GraphBuilder from '../../../graphics/GraphBuilder';
import React from 'react';

export class VisUI extends React.Component {

  state = {
    matchOnly: (localStorage.matchOnly || "false") === "true",
    eliminatedOnVisualization: (localStorage.dash || "true") === "true",
    dash: (localStorage.dash || "true") === "true",
    tight: (localStorage.tight || "false") === "true",
    straightCorner: (localStorage.straightCorner || "false") === "true",
  }

  render() {
    const { state } = this.props;

    return (
      <div style={{ marginTop: 20 }}>
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

        <div className='main-container'>
          <h1 className='round-title'  style={{ marginTop: 20 }}>
            Visualization
          </h1>
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
      </div>
    );
  }
}
