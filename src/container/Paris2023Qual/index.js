/* eslint-disable global-require */

import React from 'react';
import { Menu } from 'semantic-ui-react';
import { EUA, EUB } from './initial_data';
import { Scores } from './scores';
import { SwissBuchholtz } from '../../libs/common/formats/SwissBuchholtz';
import { pack, setTiebreakerWinner, setWinner, shuffle } from '../../libs/common/common';
import { BasicUI } from '../../libs/common/BasicUI';

const Regions = [
  {
    id: 0,
    name: "Europe A",
    seeds: EUA,
    seats: [
      { status: "RMR A", until: 4, abbrev: "1", statusPositioned: true },
      { status: "RMR B", until: 8, abbrev: "2", statusPositioned: true },
      { status: "RMR Decider", until: 11, abbrev: "D", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    rounds: 6,
    winsToAdvance: 3,
    nonDeciderBestOf: 1,
    deciderBestOf: 2,
    tournamentFormat: "SWISS_BUCHHOLTZ",
    allowDups: false,
  },
  {
    id: 1,
    name: "Europe B",
    seeds: EUB,
    seats: [
      { status: "RMR B", until: 4, abbrev: "1", statusPositioned: true },
      { status: "RMR A", until: 8, abbrev: "2", statusPositioned: true },
      { status: "RMR Decider", until: 11, abbrev: "D", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
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
/*
    return fetch('https://score-service.deta.dev/fetch_results/ant21rmr')
      .then((resp) => resp.json())
      .then((resp) => {
        this.setState({
          ...this.pack(Regions[region].seeds),
          scores: resp,
          advanceMode: 1,
          regionId: region,
          ...Regions[region],
        });
      }).then(
        () => this.calculateMatchups(0, this.state.rounds + 1)
      );
 */
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
            <Menu pointing secondary inverted compact size="huge" style={{ border: 'none' }}>
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
