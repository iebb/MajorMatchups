/* eslint-disable global-require */

import React from 'react';
import {Menu} from 'semantic-ui-react';
import {AME, AP, EUA, EUB} from './initial_data';
import {Scores} from './scores';
import {SwissBuchholtz} from '../../libs/common/formats/SwissBuchholtz';
import {pack, setTiebreakerWinner, setWinner, shuffle} from '../../libs/common/common';
import {BasicUI} from '../../libs/common/BasicUI';
import {Knockout} from "../../libs/common/formats/Knockout";
import headerPt from '../../images/sponsor/header-pt.png';
import {Knockout2} from "../../libs/common/formats/Knockout2";
import {SwissBuchholtzTB} from "../../libs/common/formats/SwissBuchholtzTB";


const Regions = [
  {
    id: 0,
    name: "Europe A",
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
    tournamentFormat: "SWISS_BUCHHOLTZ_TB",
    allowDups: false,
  },
  {
    id: 1,
    name: "Europe B",
    seeds: EUB,
    seats: [
      { status: "legends", until: 3, abbrev: "L", statusPositioned: true },
      { status: "challengers", until: 7, abbrev: "C", statusPositioned: true },
      { status: "contenders", until: 8, abbrev: "Co", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {
      "5": [{teams: 4, id: "4/5", name: "5th Decider"}],
      "6": [{teams: 3, id: "3/4", name: "3rd/4th Decider"}],
    },
    rounds: 7,
    winsToAdvance: 3,
    nonDeciderBestOf: 1,
    deciderBestOf: 2,
    tournamentFormat: "SWISS_BUCHHOLTZ_TB",
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
    tournamentFormat: "SWISS_BUCHHOLTZ_TB",
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
    loseToEliminate: 2,
    nonDeciderBestOf: 2,
    deciderBestOf: 2,
    tournamentFormat: "KNOCKOUT2",
    allowDups: true,
  },
];

const teamLogo = (code) => `https://majors.im/images/rio2022_rmr/${code}.png`;

const redirectLink = "https://cutt.ly/DV3TjD7";

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
    event: "22rmrrio",
  };

  event = "22rmrrio";

  getStage = () => {
    return this.state.regionId;
  };

  init = (region) => {
    this.setState({
      ...pack(Regions[region].seeds, teamLogo),
      advanceMode: 1,
      regionId: region,
      ...Regions[region],
    }, () => this.calculateMatchups(0, Regions[region].rounds + 1));

    // return fetch('https://score-service.deta.dev/fetch_results/rio22rmr')
    //   .then((resp) => resp.json())
    //   .then((resp) => {
    //     this.setState({
    //       ...pack(Regions[region].seeds, teamLogo),
    //       scores: resp,
    //       advanceMode: 1,
    //       regionId: region,
    //       ...Regions[region],
    //     });
    //   }).then(
    //     () => this.calculateMatchups(0, this.state.rounds + 1)
    //   );
  };



  calculateMatchups = (s, e) => {
    if (this.state.tournamentFormat === "SWISS_BUCHHOLTZ") {
      this.setState(SwissBuchholtz.bind(this)(s, e));
    } else if (this.state.tournamentFormat === "SWISS_BUCHHOLTZ_TB") {
      this.setState(SwissBuchholtzTB.bind(this)(s, e));
    } else if (this.state.tournamentFormat === "KNOCKOUT2") {
      this.setState(Knockout2.bind(this)(s, e));
    } else if (this.state.tournamentFormat === "KNOCKOUT") {
      this.setState(Knockout.bind(this)(s, e));
    } else {

    }
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
          <div className="title-container sponsored">
            <a href={redirectLink}>
              <img src={headerPt} alt="Sportsbet.io" style={{ maxWidth: "100%", maxHeight: 220 }}/>
            </a>
          </div>
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
            <BasicUI
              state={this.state}
              stage={this.getStage()}
              shuffle={this.shuffle}
            />
          </div>
        </div>
      </div>
    );
  }
}
