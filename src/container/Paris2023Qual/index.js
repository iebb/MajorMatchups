/* eslint-disable global-require */

import React from 'react';
import { Menu } from 'semantic-ui-react';
import { EUA, EUB, NAM, SAM } from './initial_data';
import { Scores } from './scores';
import { SwissBuchholtzTB } from '../../libs/common/formats/SwissBuchholtzTB';
import { pack, setWinner, shuffle } from '../../libs/common/common';
import { BasicUI } from '../../libs/common/BasicUI';
import Title from '../../libs/BannerInsertion';

const Regions = [
  {
    id: 0,
    name: "Europe-A",
    seeds: EUA,
    seats: [
      { status: "rmr-b", until: 4, abbrev: "1", statusPositioned: true },
      { status: "rmr-a", until: 8, abbrev: "2", statusPositioned: true },
      { status: "decider", until: 11, abbrev: "D", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    rounds: 5,
    winsToAdvance: 3,
    nonDeciderBestOf: 1,
    deciderBestOf: 2,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    allowDups: false,
  },
  {
    id: 1,
    name: "Europe-B",
    seeds: EUB,
    seats: [
      { status: "rmr-a", until: 4, abbrev: "1", statusPositioned: true },
      { status: "rmr-b", until: 8, abbrev: "2", statusPositioned: true },
      { status: "decider", until: 11, abbrev: "D", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    rounds: 5,
    winsToAdvance: 3,
    nonDeciderBestOf: 1,
    deciderBestOf: 2,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    allowDups: false,
  },
  {
    id: 2,
    name: "North Am",
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
    nonDeciderBestOf: 1,
    deciderBestOf: 2,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    allowDups: false,
  },
  {
    id: 3,
    name: "South Am",
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
    nonDeciderBestOf: 1,
    deciderBestOf: 2,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    allowDups: false,
  },
];

const teamLogo = (code) => `https://majors.im/images/paris2023_qual/${code}.png`;

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
    advanceMode: 1,
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
      advanceMode: 1,
      regionId: region,
      ...Regions[region],
    }, () => this.calculateMatchups(0, this.state.rounds + 1));
    //
    // return fetch('https://y5au3m.deta.dev/fetch_results/par23qual')
    //   .then((resp) => resp.json())
    //   .then((resp) => {
    //     this.setState({
    //       ...pack(Regions[region].seeds, teamLogo),
    //       advanceMode: 1,
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
    return (
      <div className="outer">
        <div className="page-container">
          <Title
            title="BLAST.tv Paris 2023 RMR Matchup Calc"
          />
          <div style={{ marginTop: 20 }}>
            <Menu pointing secondary inverted compact size="huge" className="region-selector">
              {
                Regions.map(region => (
                  <Menu.Item
                    key={region.id}
                    name={region.name}
                    active={this.state.regionId === region.id}
                    onClick={
                      () => {
                        this.props.history.push("#" + region.name);
                        document.location.reload();
                        // this.init(region.id)
                      }
                    }
                  />
                ))
              }
            </Menu>
            <BasicUI state={this.state} stage={this.getStage()} shuffle={this.shuffle} />
          </div>
        </div>
      </div>
    );
  }
}
