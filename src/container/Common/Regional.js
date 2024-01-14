import {Alert} from "@material-tailwind/react";
import React from 'react';
import Title from "../../components/BannerInsertion";
import {BasicUI} from "../../components/BasicUI";

import {fetchPrefix, pack, setWinner, shuffle} from "../../libs/common/common";
import {FormatBinder} from "../../libs/common/formats/formats";
import {Scores} from "../CSGO/Copenhagen2024Qual/scores";

export class Regionals extends React.Component {
  nextMajorSlot = true;

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
    isUnavailable: false,
    legends: false,
    scores: Scores,
    tiebreakers: {},
    tiebreakerResults: {},
    pickResults: {},
    lockResults: {},
    errorMessage: null,
    seats: {
      legends: 0,
      challengers: 0,
      contenders: 0,
    },
    rounds: 0,
    event: this.event,
  };


  getStage = () => {
    return this.state.regionId;
  };

  getSeed = (region) => {
    const { Regions, teamLogo } = this;
    if (Regions[region]) {
      if (Regions[region].getSeeds !== undefined) {
        const {success, seeds, message} = Regions[region].getSeeds();
        console.log(region, Regions[region], success, seeds, message);
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

    const teams = pack(seeds, teamLogo);


    this.setState({
      ...teams,
      regionId: region,
      ...Regions[region],
    }, () => this.calculateMatchups(0, this.state.rounds + 1));

    return fetch(fetchPrefix + '/cs_scores')
      .then((resp) => resp.json())
      .then((resp) => {
        this.setState({
          ...pack(this.getSeed(region), teamLogo),

          scores: resp,
          regionId: region,
          ...Regions[region],
        }, () => this.calculateMatchups(0, this.state.rounds + 1));
      });
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
    this.init(0);
  }
  render() {
    const { errorMessage } = this.state;
    const { Regions } = this;
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
          title={this.title}
          subtitle={this.subtitle}
        />
        <BasicUI
          tabs={tabs}
          errorMessage={errorMessage}
          state={this.state}
          stage={this.getStage()}
          shuffle={this.shuffle}
        />
      </div>
    );
  }

}
