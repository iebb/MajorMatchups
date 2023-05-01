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
  Switch, Tab, Tabs, TabsHeader,
} from '@material-tailwind/react';

const UIEnums = {
  classic: {
    name: 'Classic UI',
    component: ClassicUI,
    options: [
      { name: "Track Pick'em at pick.majors.im", key: "trackPickems", default: true },
      { name: "Matches Only", key: "matchOnly", default: false },
    ],
  },
  legacy: {
    name: 'Classic UI',
    component: ClassicUI,
    options: [
      { name: "Track Pick'em at pick.majors.im", key: "trackPickems", default: true },
      { name: "Matches Only", key: "matchOnly", default: false },
    ],
  },
  bracket: {
    name: 'Bracket UI',
    component: BracketUI,
    options: [
      { name: "Track Pick'em at pick.majors.im", key: "trackPickems", default: true },
      { name: "Matches Only", key: "matchOnly", default: false },
    ],
  },
  vis: {
    name: 'Visualization UI',
    component: VisUI,
    options: [
      { name: "Show Elimiated Teams", key: "eliminatedOnVisualization", default: true },
      { name: "Straight Corner Edges", key: "straightCorner", default: false },
      { name: "Overlapping Corners", key: "tight", default: true },
      { name: "Dashed Line for Undetermined", key: "dash", default: false },
    ],
  },
}

export function BasicUI({ tabs, state, stage, shuffle, advance }) {
  const uiType = localStorage.ui || 'classic';
  const [UIType, setUIType] = useState(UIEnums.hasOwnProperty(uiType) ? uiType : 'classic');
  const [open, handleOpen] = useState(false);
  const [values, setValues] = useState({});

  if (stage < 0) {
    return null;
  }

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
  const preferences = {};

  for(const p of UIOptions.options) {
    preferences[p.key] = getValue(p.key);
  }

  return (
    <div>
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
              // document.location.reload();
            }}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <div className="pb-4">
        <Button
          onClick={() => handleOpen(true)}
          color="blue-gray"
          className="normal-case text-black font-normal text-md py-2 my-0"
        >
          Customize
        </Button>
      </div>
      {
        tabs && (
          <div style={{ overflowX: "auto" }}>
            <Tabs
              value={stage}
              id="tab"
              className="w-auto m-auto inline-block"
            >
              <TabsHeader className="whitespace-nowrap">
                {tabs.map(({ label, value, icon, onClick }) => (
                  <Tab key={value} value={value} onClick={onClick} className="w-auto">
                    <div className="flex items-center px-2">
                      {React.createElement(icon, { className: "w-5 h-5 mr-1" })}
                      {label}
                    </div>
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
          </div>
        )
      }
      <div className="clear-both" />
      <UI
        state={state}
        shuffle={shuffle}
        preferences={values}
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
