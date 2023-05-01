import React, { useState } from 'react';
import { Button as SUIButton } from 'semantic-ui-react';
import { ClassicUI } from './UI/ClassicUI';
import { VisUI } from './UI/VisUI';
import { BracketUI } from './UI/BracketUI';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Option,
  Select,
  Switch,
} from '@material-tailwind/react';

const UIEnums = {
  classic: {
    name: 'Classic UI',
    component: ClassicUI,
    options: [
      { name: "Track Pick`em at pick.majors.im", key: "trackPickems", default: true },
      { name: "Matches Only", key: "matchOnly", default: false },
    ],
  },
  legacy: {
    name: 'Classic UI',
    component: ClassicUI,
    options: [
    ],
  },
  bracket: {
    name: 'Bracket UI',
    component: BracketUI,
    options: [
      { name: "Track Pick`em at pick.majors.im", key: "trackPickems", default: true },
      { name: "Matches Only", key: "matchOnly", default: false },
    ],
  },
  vis: {
    name: 'Vis UI',
    component: VisUI,
    options: [
      { name: "Matches Only", key: "matchOnly", default: false },
      { name: "Straight Corner Edges", key: "straightCorner", default: false },
      { name: "Overlapping Corners", key: "tight", default: false },
      { name: "Dashed Line for Undetermined", key: "dash", default: false },
    ],
  },
}

export function BasicUI({ state, shuffle, advance }) {
  const uiType = localStorage.ui || 'classic';
  const [UIType, setUIType] = useState(UIEnums.hasOwnProperty(uiType) ? uiType : 'classic');
  const [open, handleOpen] = useState(false);
  const [values, setValues] = useState({});

  const getValue = (opt) => {
    if (!localStorage[opt.key]) {
      localStorage[opt.key] = opt.default;
    }
    return (localStorage[opt.key] || "false") === "true";
  }
  const setValue = (opt, s) => {
    setValues({
      ...values,
      [opt.key]: s,
    })
    localStorage[opt.key] = s;
  }

  const UIOptions = UIEnums[UIType];
  const UI = UIOptions.component;

  return (
    <div style={{ marginTop: 20 }}>
      <Dialog
        open={open}
        size="md"
        className="max-w-[90%] w-[24rem] min-w-[12rem]"
        handler={handleOpen}
      >
        <DialogHeader>Customize</DialogHeader>
        <DialogBody divider>
          <div className="gap-4 p-2 flex-col">
            <Select
              variant="static"
              value={UIType}
              onChange={(value) => {
                setUIType(value);
                localStorage.ui = value;
              }}
              label="Choose UI Type"
            >
              {
                ['bracket', 'classic', 'vis'].map(
                  ui => (
                    <Option
                      key={ui}
                      value={ui}
                    >{UIEnums[ui].name}</Option>
                  )
                )
              }
            </Select>
          </div>
          <div className="gap-4 p-2 flex-col text-left">
            {
              UIOptions.options.map(
                opt => (
                  <Switch
                    key={opt.key}
                    id={opt.key}
                    label={" " + opt.name}
                    checked={getValue(opt)}
                    labelProps={{
                      className: "ml-6"
                    }}
                    onChange={(e) => {
                      setValue(opt, e.target.checked)
                    }}
                  />
                )
              )
            }
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="blue-gray"
            onClick={() => {
              handleOpen(null)
              document.location.reload();
            }}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <div>
        <Button
          onClick={() => handleOpen(true)}
        >
          Customize
        </Button>

      </div>
      <UI
        state={state}
        shuffle={shuffle}
      />
      {
        advance && (
          <div style={{ marginTop: 50 }}>
            <SUIButton
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
