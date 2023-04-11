/* eslint-disable global-require */

import React from 'react';
import {Menu} from 'semantic-ui-react';
import {AME, AP, EUA, EUB} from './initial_data';
import {Scores} from './scores';
import {SwissBuchholtzTB} from '../../libs/common/formats/SwissBuchholtzTB';
import {pack, setTiebreakerWinner, setWinner, shuffle} from '../../libs/common/common';
import {BasicUI} from '../../libs/common/BasicUI';
import Title from "../../libs/BannerInsertion";
import {Knockout28} from "../../libs/common/formats/Knockout28";

const Regions = [
  {
    id: 0,
    name: "Europe A",
    seeds: EUA,
    seats: [
      { status: "legends", until: 4, abbrev: "L", statusPositioned: true },
      { status: "challengers", until: 6, abbrev: "Ch", statusPositioned: true },
      { status: "contenders", until: 8, abbrev: "Co", statusPositioned: true },
      { status: "rmr-decider", until: 11, abbrev: "D", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    rounds: 6,
    tiebreakers: {
      "5": [{teams: 4, id: "4/5", name: "4/5th Decider"}],
    },
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderBestOf: 1,
    deciderBestOf: 3,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    allowDups: false,
  },
  {
    id: 1,
    name: "Europe B",
    seeds: EUB,
    seats: [
      { status: "legends", until: 3, abbrev: "L", statusPositioned: true },
      { status: "challengers", until: 7, abbrev: "Ch", statusPositioned: true },
      { status: "contenders", until: 8, abbrev: "Co", statusPositioned: true },
      { status: "rmr-decider", until: 11, abbrev: "D", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {
      "5": [{teams: 4, id: "4/5", name: "4/5th Decider"}],
      "6": [{teams: 3, id: "3/4", name: "3rd/4th Decider"}],
    },
    rounds: 7,
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderBestOf: 1,
    deciderBestOf: 2,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    allowDups: false,
  },
  {
    id: 2,
    name: "Americas",
    seeds: AME,
    seats: [
      { status: "legends", until: 1, abbrev: "L", statusPositioned: true },
      { status: "challengers", until: 2, abbrev: "Ch", statusPositioned: true },
      { status: "contenders", until: 5, abbrev: "Co", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {
      "4": [{teams: 1, id: "1/2", name: "1st/2nd Decider"}],
    },
    rounds: 5,
    winsToAdvance: 3,
    losesToEliminate: 2,
    nonDeciderBestOf: 1,
    deciderBestOf: 2,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    allowDups: false,
  },
  {
    id: 3,
    name: "Asia-Pacific",
    seeds: AP,
    seats: [
      { status: "contenders", until: 2, abbrev: "Co", statusPositioned: true },
      { status: "eliminated", until: 8, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {},
    rounds: 5,
    winsToAdvance: 3,
    loseToEliminate: 2,
    nonDeciderBestOf: 1,
    deciderBestOf: 2,
    tournamentFormat: "KNOCKOUT2",
    allowDups: false,
  },
];

const teamLogo = (code) => `https://majors.im/images/paris2023_rmr/${code}.png?v=2`;

export default class Paris2023RMR extends React.PureComponent {
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
    event: "par23rmr",
  };

  event = "par23rmr";

  getStage = () => {
    return this.state.regionId;
  };

  init = (region) => {
    this.props.history.push("#" + Regions[region].name);
    this.setState({
      ...pack(Regions[region].seeds, teamLogo),
      advanceMode: 1,
      regionId: region,
      ...Regions[region],
    }, () => this.calculateMatchups(0, this.state.rounds + 1));

    return fetch('https://y5au3m.deta.dev/fetch_results/par23rmr')
      .then((resp) => resp.json())
      .then((resp) => {
        this.setState({
          ...pack(Regions[region].seeds, teamLogo),
          advanceMode: 1,
          scores: resp,
          regionId: region,
          ...Regions[region],
        }, () => this.calculateMatchups(0, this.state.rounds + 1));
      });
  };



  calculateMatchups = (s, e) => {
    if (this.state.tournamentFormat === "SWISS_BUCHHOLTZ") {
      this.setState(SwissBuchholtzTB.bind(this)(s, e));
    } else if (this.state.tournamentFormat === "KNOCKOUT2") {
      this.setState(Knockout28.bind(this)(s, e));
    }
  };

  componentDidMount() {
    this.setWinner = setWinner.bind(this);
    this.setTiebreakerWinner = setTiebreakerWinner.bind(this);
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
            <Menu pointing secondary inverted compact size="huge" style={{ border: 'none', overflowX: 'scroll', overflowY: 'hidden' }}>
              {
                Regions.map(region => (
                  <Menu.Item
                    key={region.id}
                    name={region.name}
                    active={this.state.regionId === region.id}
                    onClick={() => this.init(region.id)}
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
