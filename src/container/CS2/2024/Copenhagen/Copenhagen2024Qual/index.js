/* eslint-disable global-require */

import {GlobeAmericasIcon, GlobeEuropeAfricaIcon} from '@heroicons/react/24/outline';
import React from 'react';
import {fetchPrefix} from '../../../../../libs/common/common';
import {Formats} from "../../../../../libs/common/formats/formats";
import {Regionals} from "../../../../Common/Regional";
import {EUA, EUB, EUTB, NAM, SAM} from './initial_data';

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
    resultTag: "cph24.cq.nam",
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
    resultTag: "cph24.cq.sam",
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
    resultTag: "cph24.cq.eua",
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
    resultTag: "cph24.cq.eub",
  },
  {
    id: 4,
    name: "EU-Decider",
    icon: GlobeEuropeAfricaIcon,

    getSeeds: () => {
      const base = JSON.parse(JSON.stringify(EUTB));
      let msg = [
        <p>EU-Decider Teams are based on your choices in <a href="/24qual_copenhagen#Europe-A" className="underline hover:text-nekoko-400">
          Europe A</a> and <a href="/24qual_copenhagen#Europe-B" className="underline hover:text-nekoko-400">
          Europe B</a>.
        </p>
      ];

      if (localStorage["cph24.cq.eua"]) {
        const teams = JSON.parse(localStorage["cph24.cq.eua"]);
        if (teams.length === 16) {
          msg.push(<br />);
          msg.push(<p>EU Qualifier A Seeds: <a className="underline hover:text-nekoko-400" onClick={() => {
            delete localStorage['cph24.cq.eua'];
            document.location.reload();
          }}>[clear]</a> </p>);
          for(let i = 0; i < 3; i++) {
            base[i * 2] = teams[8 + i];
            msg.push(
              <span className="inline-block w-[240px]">
                {`#${i * 2 + 1}: ${teams[8 + i].name} (${8 + i + 1})`}
              </span>
            );
          }
          msg.push(<br />);
        }
      }

      if (localStorage["cph24.cq.eub"]) {
        const teams = JSON.parse(localStorage["cph24.cq.eub"]);
        if (teams.length === 16) {
          msg.push(<br />);
          msg.push(<p>EU Qualifier B Seeds: <a className="underline hover:text-nekoko-400" onClick={() => {
            delete localStorage['cph24.cq.eub'];
            document.location.reload();
          }}>[clear]</a> </p>);
          for(let i = 0; i < 3; i++) {
            base[i * 2 + 1] = teams[8 + i];
            msg.push(
              <span className="inline-block w-[240px]">
                {`#${i * 2 + 2}: ${teams[8 + i].name} (${8 + i + 1})`}
              </span>
            );
          }
          msg.push(<br />);
        }
      }


      return {
        success: true,
        seeds: base.map((team, _seed) => ({
          code: team.code,
          logo: team.logo,
          name: team.name,
          seed: _seed + 1,
        })),
        message: <div className="text-left">{msg}</div>,
      };
    },
    defaultSeeds: null,
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
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "",
  },
];

const teamLogo = (code) => `https://img.majors.im/rmr/copenhagen2024_qual/${code}.png`;

export default class Copenhagen2024Qual extends Regionals {
  Regions = Regions;
  teamLogo = teamLogo;
  title = "PGL Major Copenhagen 2024 RMR Closed Qualifier Simulator";
  subtitle = <span>
    EU-Decider Teams are based on your choices in EUA & EUB.
    <br />
    Pick your winners in NA/SA here, and <a className="hyperlink" href="/24rmr_copenhagen">American RMR Simulator</a> is there for you!
  </span>;

  fetch_scores = (callback) => {
    fetch(fetchPrefix + '/cs_scores')
      .then((resp) => resp.json())
      .then(callback);
  };
}