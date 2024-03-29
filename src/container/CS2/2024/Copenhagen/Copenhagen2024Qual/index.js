/* eslint-disable global-require */

import {GlobeAmericasIcon, GlobeEuropeAfricaIcon} from '@heroicons/react/24/outline';
import React from 'react';
import {fetchPrefix} from '../../../../../libs/common/common';
import {Formats} from "../../../../../libs/common/formats/formats";
import {Regionals} from "../../../../Common/Regional";
import {EUA, EUB, EUTB_Final, NAM, SAM} from './initial_data';
import {Scores} from "./scores";

const Regions = [
  {
    name: "North-Am",
    icon: GlobeAmericasIcon,
    seeds: NAM,
    seats: [
      { status: "qualified", until: 8, abbrev: "Q" },
      { status: "eliminated", until: 16, abbrev: "E" },
    ],
    tiebreakers: {},
    rounds: 5,
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "cph24.cq.nam",
    defaultSuffix: "",
  },
  {
    name: "South-Am",
    icon: GlobeAmericasIcon,
    seeds: SAM,
    seats: [
      { status: "qualified", until: 7, abbrev: "Q" },
      { status: "eliminated", until: 16, abbrev: "E" },
    ],
    tiebreakers: {
      "5": [{teams: 7, id: "7/8", name: "7/8th Decider"}],
    },
    rounds: 6,
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "cph24.cq.sam",
    defaultSuffix: "",
  },
  {
    name: "Europe-A",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUA,
    seats: [
      // { status: "rmr-b", until: 4, abbrev: "1" },
      // { status: "rmr-a", until: 8, abbrev: "2" },
      { status: "qualified", until: 8, abbrev: "Q" },
      { status: "decider", until: 11, abbrev: "D" },
      { status: "eliminated", until: 16, abbrev: "E" },
    ],
    tiebreakers: {},
    rounds: 5,
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "cph24.cq.eua",
    defaultSuffix: "",
  },
  {
    name: "Europe-B",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUB,
    seats: [
      { status: "qualified", until: 8, abbrev: "Q" },
      // { status: "rmr-a", until: 4, abbrev: "1" },
      // { status: "rmr-b", until: 8, abbrev: "2" },
      { status: "decider", until: 11, abbrev: "D" },
      { status: "eliminated", until: 16, abbrev: "E" },
    ],
    tiebreakers: {},
    rounds: 5,
    winsToAdvance: 3,
    losesToEliminate: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "cph24.cq.eub",
    defaultSuffix: "",
  },
  {
    name: "EU-Decider",
    icon: GlobeEuropeAfricaIcon,
    seeds: EUTB_Final,
    //
    // getSeeds: () => {
    //   const base = JSON.parse(JSON.stringify(EUTB));
    //   let msg = [
    //     <p>EU-Decider Teams are based on your choices in <a href="/24qual_copenhagen#Europe-A" className="underline hover:text-nekoko-400">
    //       Europe A</a> and <a href="/24qual_copenhagen#Europe-B" className="underline hover:text-nekoko-400">
    //       Europe B</a>.
    //     </p>
    //   ];
    //
    //
    //   if (true) { // if (localStorage["cph24.cq.eua"]) {
    //     const teams = Results_ClosedQualifierEUA; // JSON.parse(localStorage["cph24.cq.eua"]);
    //     if (teams.length === 16) {
    //       msg.push(<br />);
    //       msg.push(<p>EU Qualifier A Seeds:</p>);
    //       /*
    //       clear disabled:
    //        <a className="underline hover:text-nekoko-400" onClick={() => {
    //         delete localStorage['cph24.cq.eua'];
    //         document.location.reload();
    //       }}>[clear]</a>
    //        */
    //       for(let i = 0; i < 3; i++) {
    //         base[i * 2] = {...teams[8 + i], group: 1};
    //         msg.push(
    //           <span className="inline-block w-[240px]">
    //             {`#${8 + i + 1}: ${teams[8 + i].name}`}
    //           </span>
    //         );
    //       }
    //       msg.push(<br />);
    //     }
    //   }
    //
    //   if (true) { // if (localStorage["cph24.cq.eub"]) {
    //     const teams = Results_ClosedQualifierEUB; // = JSON.parse(localStorage["cph24.cq.eub"]);
    //     if (teams.length === 16) {
    //       msg.push(<br />);
    //       msg.push(<p>EU Qualifier B Seeds:</p>);
    //       /*
    //       clear disabled:
    //        <a className="underline hover:text-nekoko-400" onClick={() => {
    //         delete localStorage['cph24.cq.eua'];
    //         document.location.reload();
    //       }}>[clear]</a>
    //        */
    //       for(let i = 0; i < 3; i++) {
    //         base[i * 2 + 1] = {...teams[8 + i], group: 2};
    //         msg.push(
    //           <span className="inline-block w-[240px]">
    //             {`#${8 + i + 1}: ${teams[8 + i].name}`}
    //           </span>
    //         );
    //       }
    //       msg.push(<br />);
    //     }
    //   }
    //
    //
    //   return {
    //     success: true,
    //     seeds: base.sort((teamA, teamB) => {
    //       if (teamA.standing !== teamB.standing) {
    //         return teamA.standing - teamB.standing;
    //       }
    //       if (teamA.standing === 10 && (teamA.buchholtz !== teamB.buchholtz)) {
    //         return teamB.buchholtz - teamA.buchholtz;
    //       }
    //       if (teamA.group !== teamB.group) {
    //         return teamA.group - teamB.group;
    //       }
    //     }).map((team, _seed) => ({
    //       code: team.code,
    //       logo: team.logo,
    //       name: team.name,
    //       seed: _seed + 1,
    //       valveRanking: team.valveRanking,
    //       buchholtz_offset: team.buchholtz,
    //       buchholtz: team.buchholtz,
    //     })),
    //     message: <div className="text-left">{msg}</div>,
    //   };
    // },
    // defaultSeeds: null,
    seats: [
      { status: "rmr", until: 5, abbrev: "R" },
      { status: "eliminated", until: 6, abbrev: "E" },
    ],
    tiebreakers: {
      "1": [{teams: 4, id: "4/5", offset: 0.1, name: "4th Decider"}],
      "2": [{teams: 5, id: "5/6", offset: -0.1, name: "Qualification Match"}],
    },
    rounds: 3,
    winsToAdvance: 1,
    losesToEliminate: 1,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "cph24.cq.eud",
    defaultSuffix: "#",
  },
].map((r, id) => ({...r, id}));

const teamLogo = (code) => `https://img.majors.im/rmr/copenhagen2024_qual/${code}.png`;

export default class Copenhagen2024Qual extends Regionals {
  defaultTab = 2;
  Regions = Regions;
  teamLogo = teamLogo;
  title = "PGL Major Copenhagen 2024 RMR Closed Qualifier Simulator";
  subtitle = <span>
    Pick your winners here, and <a href="/24rmr_copenhagen" className="text-yellow-400 underline">EU & Americas RMR</a> simulation is now available.
  </span>;
  _scores = Scores;

  fetch_scores = (callback) => {
    // fetch(fetchPrefix + '/cs_scores')
    //   .then((resp) => resp.json())
    //   .then(callback);
  };
}
