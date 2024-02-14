/* eslint-disable global-require */

import {GlobeAmericasIcon, GlobeEuropeAfricaIcon} from '@heroicons/react/24/outline';
import React from 'react';
import {fetchPrefix} from "../../../../../libs/common/common";
import {Formats} from "../../../../../libs/common/formats/formats";
import {Regionals} from "../../../../Common/Regional";
import {EUTB} from "../Copenhagen2024RMRProvisional/initial_data";
import {EUA, EUB, AM} from './initial_data';
import {Scores} from "./scores";

const Regions = [
  {
    name: "Americas",
    icon: GlobeAmericasIcon,
    seeds: AM,
    seats: [
      { status: "legends", until: 1, abbrev: "L", statusPositioned: true },
      { status: "challenger", until: 5, abbrev: "C", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {
      "3": [{teams: 1, id: "1/2", name: "Legends Decider"}],
    },
    rounds: 4,
    winsToAdvance: 3,
    losesToEliminate: 2,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "",
  },
  {
    name: "Europe-A",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUA,
    seats: [
      { status: "legends", until: 4, abbrev: "L", statusPositioned: true },
      { status: "challenger", until: 8, abbrev: "C", statusPositioned: true },
      { status: "decider", until: 11, abbrev: "D", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {},
    rounds: 5,
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "cph24.rmr.eua",
  },
  {
    name: "Europe-B",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUB,
    seats: [
      { status: "legends", until: 3, abbrev: "L", statusPositioned: true },
      { status: "challenger", until: 8, abbrev: "C", statusPositioned: true },
      { status: "decider", until: 11, abbrev: "D", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {},
    rounds: 5,
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "cph24.rmr.eub",
  },
  {
    name: "EU-Decider",
    icon: GlobeEuropeAfricaIcon,
    getSeeds: () => {

      const base = JSON.parse(JSON.stringify(EUTB));
      let msg = [
        <p>EU-Decider Teams are based on your choices in <a href="/24rmr_copenhagen#Europe-A" className="underline hover:text-nekoko-400">
          Europe A</a> and <a href="/24rmr_copenhagen#Europe-B" className="underline hover:text-nekoko-400">
          Europe B</a>.
        </p>
      ];

      if (localStorage["cph24.rmr.eua"]) {
        const teams = JSON.parse(localStorage["cph24.rmr.eua"]);
        if (teams.length === 16) {
          msg.push(<br />);
          msg.push(<p>EU Qualifier A Seeds: <a className="underline hover:text-nekoko-400" onClick={() => {
            delete localStorage['cph24.rmr.eua'];
            document.location.reload();
          }}>[clear]</a> </p>);
          for(let i = 0; i < 3; i++) {
            base[i * 2] =  {...teams[8 + i], group: 1};
            msg.push(
              <span className="inline-block w-[240px]">
                {`#${8 + i + 1}: ${teams[8 + i].name}`}
              </span>
            );
          }
          msg.push(<br />);
        }
      }

      if (localStorage["cph24.rmr.eub"]) {
        const teams = JSON.parse(localStorage["cph24.rmr.eub"]);
        if (teams.length === 16) {
          msg.push(<br />);
          msg.push(<p>EU Qualifier B Seeds: <a className="underline hover:text-nekoko-400" onClick={() => {
            delete localStorage['cph24.rmr.eub'];
            document.location.reload();
          }}>[clear]</a> </p>);
          for(let i = 0; i < 3; i++) {
            base[i * 2 + 1] =  {...teams[8 + i], group: 2};
            msg.push(
              <span className="inline-block w-[240px]">
                {`#${8 + i + 1}: ${teams[8 + i].name}`}
              </span>
            );
          }
          msg.push(<br />);
        }
      }


      return {
        success: true,
        seeds: base.sort((teamA, teamB) => {
          if (teamA.standing !== teamB.standing) {
            return teamA.standing - teamB.standing;
          }
          if (teamA.standing === 10 && (teamA.buchholtz !== teamB.buchholtz)) {
            return teamB.buchholtz - teamA.buchholtz;
          }
          if (teamA.group !== teamB.group) {
            return teamA.group - teamB.group;
          }
        }).map((team, _seed) => ({
          code: team.code,
          logo: team.logo,
          name: team.name,
          seed: _seed + 1,
          valveRanking: team.valveRanking,
          buchholtz_offset: team.buchholtz,
          buchholtz: team.buchholtz,
        })),
        message: <div className="text-left">{msg}</div>,
      };
    },
    seats: [
      { status: "challenger", until: 1, abbrev: "C", statusPositioned: true },
      { status: "eliminated", until: 6, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {
      "1": [{teams: 2, id: "2/3", offset: -0.1, name: "3rd Decider"}],
      "2": [{teams: 1, id: "1/2", offset: 0.1, name: "1st/2nd Decider"}],
    },
    rounds: 3,
    winsToAdvance: 1,
    losesToEliminate: 1,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "cph24.rmr.eucq",
    defaultSuffix: "#",
  },
].map((r, id) => ({...r, id}));

const teamLogo = (code) => `https://img.majors.im/rmr/copenhagen2024_rmr/${code}.png`;

export default class Copenhagen2024RMR extends Regionals {
  defaultTab = 1;
  Regions = Regions;
  teamLogo = teamLogo;
  title = "PGL Major Copenhagen 2024 RMR Simulator";
  _scores = Scores;

  fetch_scores = (callback) => {
    fetch(fetchPrefix + '/cs_scores')
      .then((resp) => resp.json())
      .then(callback);
  };
}
