/* eslint-disable global-require */

import {GlobeAmericasIcon, GlobeEuropeAfricaIcon} from '@heroicons/react/24/outline';
import React from 'react';
import Title from '../../../components/BannerInsertion';
import {BasicUI} from '../../../components/BasicUI';
import {fetchPrefix, getWinnerFromScoreCS2, pack, setWinner, shuffle} from '../../../libs/common/common';
import {FormatBinder, Formats} from "../../../libs/common/formats/formats";
import {EUA, EUB, EUTB, NAM, SAM} from './initial_data';
import {Scores} from './scores';

const Regions = [
  {
    id: 0,
    name: "North-Am",
    icon: GlobeAmericasIcon,
    seeds: NAM,
    seats: [
      { status: "qualified", until: 8, abbrev: "Q", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {},
    rounds: 5,
    winsToAdvance: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    allowDups: false,
  },
  {
    id: 1,
    name: "South-Am",
    icon: GlobeAmericasIcon,
    seeds: SAM,
    seats: [
      { status: "qualified", until: 7, abbrev: "Q", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {
      "5": [{teams: 7, id: "7/8", name: "7/8th Decider"}],
    },
    rounds: 6,
    winsToAdvance: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    allowDups: false,
  },
  {
    id: 2,
    name: "Europe-A",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUA,
    seats: [
      // { status: "rmr-b", until: 4, abbrev: "1", statusPositioned: true },
      // { status: "rmr-a", until: 8, abbrev: "2", statusPositioned: true },
      { status: "qualified", until: 8, abbrev: "Q", statusPositioned: true },
      { status: "decider", until: 11, abbrev: "D", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {},
    rounds: 5,
    winsToAdvance: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    allowDups: false,
  },
  {
    id: 3,
    name: "Europe-B",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUB,
    seats: [
      { status: "qualified", until: 8, abbrev: "Q", statusPositioned: true },
      // { status: "rmr-a", until: 4, abbrev: "1", statusPositioned: true },
      // { status: "rmr-b", until: 8, abbrev: "2", statusPositioned: true },
      { status: "decider", until: 11, abbrev: "D", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {},
    rounds: 5,
    winsToAdvance: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    allowDups: false,
  },
  {
    id: 4,
    name: "EU-Decider",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUTB,
    seats: [
      { status: "rmr", until: 5, abbrev: "R", statusPositioned: true },
      { status: "eliminated", until: 6, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {
      "1": [{teams: 4, id: "4/5", offset: 0.1, name: "4th Decider"}],
      "2": [{teams: 5, id: "5/6", offset: -0.1, name: "Qualification Match"}],
    },
    rounds: 3,
    winsToAdvance: 1,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: 0,
    allowDups: false,
  },
];

const teamLogo = (code) => `https://img.majors.im/rmr/copenhagen2024_qual/${code}.png`;

export default class Copenhagen2024Qual extends React.PureComponent {
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
    regionId: 0,

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
    event: "23qualparis",
  };

  event = "23qualparis";

  getStage = () => {
    return this.state.regionId;
  };

  init = (region) => {
    this.setState({
      ...pack(Regions[region].seeds, teamLogo),

      regionId: region,
      ...Regions[region],
    }, () => this.calculateMatchups(0, this.state.rounds + 1));

    return fetch(fetchPrefix + '/cs_scores')
      .then((resp) => resp.json())
      .then((resp) => {
        this.setState({
          ...pack(Regions[region].seeds, teamLogo),

          scores: resp,
          regionId: region,
          ...Regions[region],
        }, () => this.calculateMatchups(0, this.state.rounds + 1));
      });
  };



  calculateMatchups = (s, e) => {
    this.setState(FormatBinder[this.state.tournamentType].bind(this)(s, e, getWinnerFromScoreCS2));
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
      icon: region.icon,
      onClick:  () => {
        this.props.history.push("#" + region.name);
        // document.location.reload();
        this.init(region.id)
      }
    }));
    return (

        <div className="page-container">
          <Title
            title="PGL Major Copenhagen 2024 RMR Closed Qualifier Simulator"
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
