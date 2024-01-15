/* eslint-disable global-require */

import React from 'react';
import { EUA, EUB, EUTB, NAM, SAM } from './initial_data';
import { Scores } from './scores';
import { SwissBuchholtzTB } from '../../../../libs/common/formats/SwissBuchholtzTB';
import { pack, setWinner, shuffle } from '../../../../libs/common/common';
import { BasicUI } from '../../../../components/BasicUI';
import Title from '../../../../components/BannerInsertion';
import { GlobeAmericasIcon, GlobeEuropeAfricaIcon } from '@heroicons/react/24/outline';

const Regions = [
  {
    id: 0,
    name: "Europe-A",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUA,
    seats: [
      { status: "rmr-b", until: 4, abbrev: "1", statusPositioned: true },
      { status: "rmr-a", until: 8, abbrev: "2", statusPositioned: true },
      { status: "decider", until: 11, abbrev: "D", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {},
    rounds: 5,
    winsToAdvance: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: 0,
  },
  {
    id: 1,
    name: "Europe-B",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUB,
    seats: [
      { status: "rmr-a", until: 4, abbrev: "1", statusPositioned: true },
      { status: "rmr-b", until: 8, abbrev: "2", statusPositioned: true },
      { status: "decider", until: 11, abbrev: "D", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {},
    rounds: 5,
    winsToAdvance: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: 0,
  },
  {
    id: 2,
    name: "EU-Decider",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUTB,
    seats: [
      { status: "rmr-b", until: 1, abbrev: "R", statusPositioned: true },
      { status: "rmr-a", until: 2, abbrev: "R", statusPositioned: true },
      { status: "eliminated", until: 6, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {
      "1": [{teams: 2, id: "2/3", offset: -0.1, name: "3rd Decider"}],
    },
    rounds: 2,
    winsToAdvance: 1,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: 0,
  },
  {
    id: 3,
    name: "North-Am",
    icon: GlobeAmericasIcon,
    seeds: NAM,
    seats: [
      { status: "advance", until: 7, abbrev: "R", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {
      "5": [{teams: 7, id: "7/8", name: "7/8th Decider"}],
    },
    rounds: 6,
    winsToAdvance: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: 0,
  },
  {
    id: 4,
    name: "South-Am",
    icon: GlobeAmericasIcon,
    seeds: SAM,
    seats: [
      { status: "advance", until: 7, abbrev: "R", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {
      "5": [{teams: 7, id: "7/8", name: "7/8th Decider"}],
    },
    rounds: 6,
    winsToAdvance: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: 0,
  },
];

const teamLogo = (code) => `https://img.majors.im/rmr/paris2023_qual/${code}.png`;

export default class Paris2023Qual extends React.PureComponent {
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
    //
    // return fetch('https://y5au3m.deta.dev/fetch_results/par23qual')
    //   .then((resp) => resp.json())
    //   .then((resp) => {
    //     this.setState({
    //       ...pack(Regions[region].seeds, teamLogo),
    //
    //       scores: resp,
    //       regionId: region,
    //       ...Regions[region],
    //     }, () => this.calculateMatchups(0, this.state.rounds + 1));
    //   });
  };



  calculateMatchups = (s, e) => {
    this.setState(SwissBuchholtzTB.bind(this)(s, e));
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
            title="BLAST.tv Paris 2023 RMR Closed Qualifier Simulator"
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
