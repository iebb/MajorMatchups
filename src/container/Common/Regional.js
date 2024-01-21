import React from 'react';
import Title from "../../components/BannerInsertion";
import {BasicUI} from "../../components/BasicUI";

import {pack, setWinner, shuffle} from "../../libs/common/common";
import {FormatBinder} from "../../libs/common/formats/formats";

export class Regionals extends React.Component {
  nextMajorSlot = false;
  defaultTab = 0;

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
    scores: {},
    tiebreakers: {},
    tiebreakerResults: {},
    pickResults: {},
    lockResults: {},
    errorMessage: null,
    message: null,
    seats: {
      legends: 0,
      challengers: 0,
      contenders: 0,
    },
    rounds: 0,
    event: this.event,
  };


  getTab = () => {
    return this.state.regionId;
  };

  getSeed = (region) => {
    const { Regions, teamLogo } = this;
    if (Regions[region]) {
      if (Regions[region].getSeeds !== undefined) {
        const {success, seeds, message} = Regions[region].getSeeds();
        this.setState({ message });
        if (success) {
          this.setState({ errorMessage: null })
          return seeds;
        } else {
          this.setState({ errorMessage: message })
          return null;
        }
      }
      if (Regions[region].seeds) {
        this.setState({ errorMessage: null })
        return Regions[region].seeds;
      }
    }
    return null;
  }

  init = (region) => {
    const { Regions, teamLogo } = this;
    const seeds = this.getSeed(region);

    if (!seeds) return;

    this.setState({
      ...pack(seeds, teamLogo),
      regionId: region,
      scores: this.fetchedScore ? this.fetchedScore : this.Scores,
      ...Regions[region],
    }, () => this.calculateMatchups(0, this.state.rounds + 1));

    if (this.fetch_scores) {
      if (!this.fetchedScore) {
        this.fetch_scores((resp) => {
          this.fetchedScore = resp;
          this.setState({
            ...pack(seeds, teamLogo),
            regionId: region,
            scores: resp,
            ...Regions[region],
          }, () => this.calculateMatchups(0, this.state.rounds + 1));
        });
      }
    }
  };



  calculateMatchups = (s, e) => {
    this.setState(FormatBinder[this.state.tournamentType].bind(this)(s, e));
  };

  componentDidMount() {
    const { Regions } = this;
    this.setWinner = setWinner.bind(this);
    this.shuffle = shuffle.bind(this);
    const hash = this.props.history?.location?.hash?.slice(1);
    for(const h of Regions) {
      if (h.name === hash) {
        this.init(h.id);
        return;
      }
    }
    this.init(this.defaultTab);
  }
  render() {
    const { Regions } = this;
    const tabs = Regions.map(region => ({
      value: region.id,
      label: region.name,
      active: this.state.regionId === region.id,
      icon: region.icon,
      onClick:  () => {
        this.props.history.push("#" + region.name);
        // document.location.reload();
        this.setState({ message: null, errorMessage: null })
        this.init(region.id);
      }
    }));
    return (

      <div className="page-container">
        <Title
          title={this.title}
          subtitle={this.subtitle}
        />
        <BasicUI
          tabs={tabs}
          state={this.state}
          stage={this.getTab()}
          shuffle={this.shuffle}
        />
      </div>
    );
  }

}
