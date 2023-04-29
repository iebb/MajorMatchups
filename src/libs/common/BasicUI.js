import React from 'react';
import {Button, Dropdown} from 'semantic-ui-react';
import {ClassicUI} from "./UI/ClassicUI";
import {VisUI} from "./UI/VisUI";

const UIEnums = [
  ClassicUI,
  VisUI,
]

export class BasicUI extends React.Component {
  state = {
    UIType: 0,
  }
  render() {
    const { UIType } = this.state;
    const { state, shuffle, advance } = this.props;
    const UI = UIEnums[UIType];

    return (
      <div style={{ marginTop: 20 }}>
        <div>
          <Dropdown
            inverted
            value={this.state.UIType}
            options={[
              { key: 0, text: 'Classic UI', value: 0 },
              { key: 1, text: 'Vis UI', value: 1 },
            ]}
            onChange={(e, {value}) => {
              this.setState({ UIType: value })
            }}
            selection
          />
        </div>
        <UI
          state={state}
          shuffle={shuffle}
        />
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
    );
  }
}
