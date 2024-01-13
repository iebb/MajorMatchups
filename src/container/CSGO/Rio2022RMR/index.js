/* eslint-disable global-require */

import React from 'react';
import {FormatBinder, Formats} from "../../../libs/common/formats/formats";
import { AME, AP, EUA, EUB } from './initial_data';
import { Scores } from './scores';
import {getWinnerFromScoreCS2, getWinnerFromScoreCSGO, pack, setWinner, shuffle} from '../../../libs/common/common';
import { BasicUI } from '../../../components/BasicUI';
import { DoubleElimination } from '../../../libs/common/formats/DoubleElimination';
import { SwissBuchholtzTB } from '../../../libs/common/formats/SwissBuchholtzTB';
import Title from '../../../components/BannerInsertion';
import { GlobeAltIcon } from '@heroicons/react/24/outline';


const Regions = [
  {
    id: 0,
    name: "Europe-A",
    seeds: EUA,
    seats: [
      { status: "legends", until: 4, abbrev: "L", statusPositioned: true },
      { status: "challengers", until: 6, abbrev: "C", statusPositioned: true },
      { status: "contenders", until: 8, abbrev: "Co", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {
      "4": [{teams: 4, id: "4/5", name: "4/5th Decider (Legend)"}],
    },
    buchholtzLockIns: [`3-1`],
    rounds: 5,
    winsToAdvance: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: 0,
    allowDups: false,
  },
  {
    id: 1,
    name: "Europe-B",
    seeds: EUB,
    seats: [
      { status: "legends", until: 3, abbrev: "L", statusPositioned: true },
      { status: "challengers", until: 7, abbrev: "C", statusPositioned: true },
      { status: "contenders", until: 8, abbrev: "Co", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {
      "5": [{teams: 4, offset: -0.1, id: "4/5", name: "5th Decider"}],
      "6": [{teams: 3, offset: 0.1, id: "3/4", name: "3rd/4th Decider"}],
    },
    rounds: 7,
    winsToAdvance: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: 0,
    allowDups: false,
  },
  {
    id: 2,
    name: "Americas",
    seeds: AME,
    seats: [
      { status: "legends", until: 1, abbrev: "L", statusPositioned: true },
      { status: "challengers", until: 3, abbrev: "C", statusPositioned: true },
      { status: "contenders", until: 6, abbrev: "Co", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {
      "3": [{teams: 1, id: "1/2", name: "1st/2nd Decider"}], // after round 3, 1st place and 2nd place,
      "5": [{teams: 7, offset: -0.1, id: "6/7/8", name: "8th Decider"}], // after round 5, 7th place and 8th place,
      "6": [{teams: 6, offset: 0.1, id: "6/7", name: "6th/7th Decider"}], // after round 6, 6th place and 7th place,
    },
    tiebreakerResults: {},
    rounds: 7,
    winsToAdvance: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: 0,
    allowDups: false,
  },
  {
    id: 3,
    name: "Asia-Pacific",
    seeds: AP,
    seats: [
      { status: "legends", until: 0, abbrev: "L", statusPositioned: true },
      { status: "challengers", until: 0, abbrev: "C", statusPositioned: true },
      { status: "contenders", until: 2, abbrev: "Co", statusPositioned: true },
      { status: "eliminated", until: 4, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {},
    rounds: 3,
    winsToAdvance: 2,
    losesToEliminate: 2,
    nonDeciderToWin: 2,
    deciderToWin: 2,
    tournamentType: Formats.DoubleElimination,
    allowDups: false,
  },
];

const teamLogo = (code) => `https://img.majors.im/rmr/rio2022_rmr/${code}.png`;

export default class Rio2022RMR extends React.PureComponent {
  state = {
    teams: [[], false, false, false, false, false],
    roundTeams: [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    ],
    matches: [false, false, false, false, false, false],
    regionId: 3,

    legends: false,
    scores: Scores,
    tiebreakers: {},
    tiebreakerResults: {},
    pickResults: {},
    lockResults: {},
    seats: {
      legends: 0,
      challengers: 0,
      contenders: 0,
    },
    rounds: 0,
    allowDups: false,
    event: "22rmrrio",
  };

  event = "22rmrrio";

  getStage = () => {
    return this.state.regionId;
  };

  init = (region) => {
    this.setState({
      ...pack(Regions[region].seeds, teamLogo),

      regionId: region,
      ...Regions[region],
    }, () => this.calculateMatchups(0, Regions[region].rounds + 1));
  };



  calculateMatchups = (s, e) => {
    this.setState(FormatBinder[this.state.tournamentType].bind(this)(s, e, getWinnerFromScoreCSGO));
  };

  componentDidMount() {
    this.setWinner = setWinner.bind(this);
    this.shuffle = shuffle.bind(this);
    const hash = this.props.history?.location?.hash?.slice(1);
    for(const h of Regions) {
      if (h.name === hash) {
        this.init(h.id);
        return;
      }
    }
    this.init(0);
  }
  render() {
    const tabs = Regions.map(region => ({
      value: region.id,
      label: region.name,
      active: this.state.regionId === region.id,
      icon: GlobeAltIcon,
      onClick:  () => {
        this.props.history.push("#" + region.name);
        // document.location.reload();
        this.init(region.id)
      }
    }));
    return (

        <div className="page-container">
          <Title
            title="IEM Rio RMR 2022 Simulator"
          />
          <BasicUI
            tabs={tabs}
            state={this.state}
            stage={this.getStage()}
            shuffle={this.shuffle}
          />
      </div>
    );
  }
}
