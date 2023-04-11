/* eslint-disable global-require */

import React from 'react';
import { Menu } from 'semantic-ui-react';
import { AME, AP, EUA, EUB } from './initial_data';
import { Scores } from './scores';
import { SwissBuchholtz } from '../../libs/common/formats/SwissBuchholtz';
import { pack, setTiebreakerWinner, setWinner, shuffle } from '../../libs/common/common';
import { BasicUI } from '../../libs/common/BasicUI';

const Regions = [
  {
    id: 0,
    name: "Europe-B",
    seeds: EUB,
    seats: [
      { status: "legends", until: 3, abbrev: "L", statusPositioned: true },
      { status: "challengers", until: 7, abbrev: "C", statusPositioned: true },
      { status: "contenders", until: 8, abbrev: "Co", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {
      "5": [{teams: 3, id: "3/4", name: "3/4th Decider"}],
    },
    rounds: 6,
    winsToAdvance: 3,
    nonDeciderBestOf: 1,
    deciderBestOf: 2,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    allowDups: false,
  },
  {
    id: 1,
    name: "Europe-A",
    seeds: EUA,
    seats: [
      { status: "legends", until: 4, abbrev: "L", statusPositioned: true },
      { status: "challengers", until: 6, abbrev: "C", statusPositioned: true },
      { status: "contenders", until: 8, abbrev: "Co", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {
      "5": [{teams: 4, id: "4/5", name: "4/5th Decider (Legend)"}],
    },
    rounds: 6,
    winsToAdvance: 3,
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
      { status: "challengers", until: 3, abbrev: "C", statusPositioned: true },
      { status: "contenders", until: 6, abbrev: "Co", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {
      "3": [{teams: 1, id: "1/2", name: "1st/2nd Decider"}], // after round 3, 1st place and 2nd place,
      "5": [{teams: 7, id: "6/7/8", name: "8th Decider"}], // after round 5, 7th place and 8th place,
      "6": [{teams: 6, id: "6/7", name: "6th/7th Decider"}], // after round 6, 6th place and 7th place,
    },
    tiebreakerResults: {},
    rounds: 7,
    winsToAdvance: 3,
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
      { status: "legends", until: 0, abbrev: "L", statusPositioned: true },
      { status: "challengers", until: 0, abbrev: "C", statusPositioned: true },
      { status: "contenders", until: 2, abbrev: "Co", statusPositioned: true },
      { status: "eliminated", until: 4, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {},
    rounds: 3,
    winsToAdvance: 2,
    nonDeciderBestOf: 2,
    deciderBestOf: 2,
    tournamentFormat: "SWISS_BUCHHOLTZ_DUP",
    allowDups: true,
  },
];

const teamLogo = (code) => `https://majors.im/images/antwerp2022_rmr/${code}.png`;

export default class Antwerp2022RMR extends React.PureComponent {
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
    event: "22rmrantwerp",
  };

  event = "22rmrantwerp";

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

  };



  calculateMatchups = (s, e) => {
    this.setState(SwissBuchholtz.bind(this)(s, e));
  };

  componentDidMount() {
    this.setWinner = setWinner.bind(this);
    this.setTiebreakerWinner = setTiebreakerWinner.bind(this);
    this.shuffle = shuffle.bind(this);
    this.init(0);
  }
  render() {
    return (
      <div className="outer">
        <div className="page-container">
          <div className="title-container">
            <h1 className="title">PGL Antwerp RMR 2022 Matchup Calculator</h1>
          </div>
          <p>
            <a href="https://discord.gg/KYNbRYrZGe">
              feedback(discord)
            </a>
            <span style={{ margin: 10 }}>·</span>
            <a href="https://twitter.com/CyberHono">
              twitter
            </a>
            <span style={{ margin: 10 }}>·</span>
            <a href="https://steamcommunity.com/id/iebbbb">
              steam profile
            </a>
          </p>
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
