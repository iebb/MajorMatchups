import React, { useEffect, useState } from 'react';
import { ClassicUI } from './UI/ClassicUI';
import { BracketUI } from './UI/BracketUI';
import {
  Alert,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Option,
  Select,
  Switch,
  Tab,
  Tabs,
  TabsHeader,
} from '@material-tailwind/react';
import { ArrowLongRightIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { MinimalUI } from './UI/MinimalUI';

const commonOptions = [
  // { name: "Disable After-content Google Ads", key: "disableAds", default: false },
  { name: "Alternative Background", key: "altBackground", default: false },
]

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
      { name: "Display Matches Only", key: "matchOnly", default: false },
    ],
  },
  minimal: {
    name: 'Minimal UI',
    component: MinimalUI,
    options: [
      { name: "Track Pick'em at pick.majors.im", key: "trackPickems", default: true },
      { name: "Show [Best of X] for Brackets", key: "bestOfIndicator", default: true },
      { name: "Show Team Standings inside Bracket", key: "teamStandings", default: true },
      { name: "Team Abbreviations", key: "abbrev", default: false },
      { name: "Display Matches Only", key: "matchOnly", default: false },
    ],
  },
  bracket: {
    name: 'Bracket UI',
    component: BracketUI,
    options: [
      { name: "Track Pick'em at pick.majors.im", key: "trackPickems", default: true },
      { name: "Show [Best of X] for Brackets", key: "bestOfIndicator", default: true },
      { name: "Show Team Standings inside Bracket", key: "teamStandings", default: true },
      { name: "Team Abbreviations", key: "abbrev", default: false },//
      { name: "Display Matches Only", key: "matchOnly", default: false },
    ],
  },
  // vis: {
  //   name: 'Visualization UI',
  //   component: VisUI,
  //   options: [
  //     { name: "Show Elimiated Teams", key: "eliminatedOnVisualization", default: true },
  //     { name: "Straight Corner Edges", key: "straightCorner", default: false },
  //     { name: "Overlapping Corners", key: "tight", default: true },
  //     { name: "Dashed Line for Undetermined", key: "dash", default: false },
  //   ],
  // },
}

export function BasicUI({ tabs, state, stage, shuffle, advance }) {
  const uiType = localStorage.ui || 'bracket';
  const [UIType, setUIType] = useState(UIEnums.hasOwnProperty(uiType) ? uiType : 'minimal');
  const [open, handleOpen] = useState(false);
  const [values, setValues] = useState({});

  const {errorMessage, message} = state;



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

  useEffect(() => {
    const preferences = {};
    for(const p of UIOptions.options) {
      preferences[p.key] = getValue(p);
    }
    setValues(preferences);
  }, [UIType]);



  if (stage < 0) {
    return null;
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
          <div className="p-2 flex-col text-left flex">
            {
              UIOptions.options.map(
                opt => (
                  <Switch
                    key={opt.key}
                    id={opt.key}
                    label={" " + opt.name}
                    className="w-full"
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
            {
            commonOptions.map(
                opt => (
                  <Switch
                    key={opt.key}
                    id={opt.key}
                    label={" " + opt.name}
                    checked={getValue(opt)}
                    className="w-full"
                    labelProps={{
                      className: "ml-6 mr-6"
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
            color="blue-gray"
            className="normal-case text-white font-normal text-md py-2 my-0"
            onClick={() => {
              handleOpen(null)
            }}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <div className="pb-4 gap-2 flex flex-row content-center place-content-center">
        <div>
          <Select
            color="blue-gray"
            value={UIType}
            onChange={(value) => {
              setUIType(value);
              localStorage.ui = value;
            }}
            label="Choose UI Type"
          >
            {
              ['minimal', 'bracket', 'classic'].map(
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
        <div>
          <Button
            onClick={() => handleOpen(true)}
            color="blue-gray"
            className="normal-case text-white font-normal text-md py-2 my-0 mx-2"
          >
            Customize
          </Button>
          <Button
            onClick={() => window.open("https://discord.gg/KYNbRYrZGe", "_blank")}
            color="indigo"
            className="normal-case text-white font-normal text-md py-2 my-0 mx-2 items-center gap-2 inline-flex"
          >
            <ChatBubbleLeftEllipsisIcon strokeWidth={2} className="h-5 w-5" /> Discord
          </Button>
        </div>
      </div>
      {
        tabs && (
          <div style={{ overflowX: "auto" }}>
            <Tabs
              color="blue-gray"
              key={stage}
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
      {
        message && (
          <div className="my-1">
            <Alert color="teal" className="text-white whitespace-pre-wrap max-w-[1200px]" style={{ margin: "0 auto" }}>{message}</Alert>
          </div>
        )
      }
      {
        errorMessage ? (
          <div className="my-1">
            <Alert color="red" className="text-white">{errorMessage}</Alert>
          </div>
        ) : (
          <div className="ui">
            <UI
              state={state}
              shuffle={shuffle}
              preferences={values}
            />
            {
              advance && (
                <div className="m-4 items-center flex flex-row content-center place-content-center">
                  <Button
                    onClick={advance}
                    color="blue-gray"
                    variant="outlined"
                    className="normal-case text-white font-normal text-2xl py-4 px-12 my-0 flex items-center gap-2"
                  >
                    Next Stage <ArrowLongRightIcon strokeWidth={2} className="h-5 w-5" />
                  </Button>
                </div>
              )
            }
            </div>
        )
      }

    </div>
  );
}
