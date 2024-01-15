/* eslint-disable global-require */

import {GlobeAmericasIcon, GlobeEuropeAfricaIcon} from '@heroicons/react/24/outline';
import React from 'react';
import Title from '../../../components/BannerInsertion';
import {BasicUI} from '../../../components/BasicUI';
import {fetchPrefix, getWinnerFromScoreCS2, pack, setWinner, shuffle} from '../../../libs/common/common';
import {FormatBinder, Formats} from "../../../libs/common/formats/formats";
import {Regionals} from "../../Common/Regional";
import {AM, EUA, EUB, EUTB, AP} from './initial_data';
import {Scores} from './scores';

const Regions = [
  {
    id: 0,
    name: "Americas",
    icon: GlobeAmericasIcon,
    getSeeds: () => {
      const base = JSON.parse(JSON.stringify(AM));
      let msg = [
        <p>Teams are based on your choices in <a href="/24qual_copenhagen">NA/SA Closed Qualifiers</a>.</p>
      ];

      if (localStorage["cph24.cq.sam"]) {
        const teams = JSON.parse(localStorage["cph24.cq.sam"]);
        if (teams.length === 16) {
          msg.push(<br />);
          msg.push(<p>South American Seeds: <a onClick={() => {
            delete localStorage['cph24.cq.sam'];
            document.location.reload();
          }}>[clear]</a> </p>);
          for(let i = 0; i < 7; i++) {
            base[2 * i + 2] = teams[i];
            if (i === 4) {
              msg.push(<br />);
            }
            msg.push(
              <span className="inline-block w-[240px]">
                {`#${2 * i + 3}: ${teams[i].name} (${i + 1})`}
              </span>
            );
          }
          msg.push(<br />);
        }
      }


      // if (localStorage["cph24.cq.nam"]) {
      //   const teams = JSON.parse(localStorage["cph24.cq.nam"]);
      //   if (teams.length === 16) {
      //     msg.push(<br />);
      //     msg.push(<p>North American Seeds: <a onClick={() => {
      //       delete localStorage['cph24.cq.nam'];
      //       document.location.reload();
      //     }}>[clear]</a> </p>);
      //     for(let i = 0; i < 8; i++) {
      //       base[2 * i + 1] = teams[i];
      //       if (i === 4) {
      //         msg.push(<br />);
      //       }
      //       msg.push(
      //         <span className="inline-block w-[240px]">
      //           {`#${2*i+2}: ${teams[i].name} (${i+1})`}
      //         </span>
      //       );
      //     }
      //   }
      //   msg.push(<br />);
      // }

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
    seeds: AM,
    seats: [
      { status: "qualified", until: 5, abbrev: "Q", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {},
    rounds: 4,
    winsToAdvance: 3,
    losesToEliminate: 2,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
    resultTag: "",
  },
  // {
  //   id: 1,
  //   name: "South-Am",
  //   icon: GlobeAmericasIcon,
  //   seeds: SAM,
  //   seats: [
  //     { status: "qualified", until: 7, abbrev: "Q", statusPositioned: true },
  //     { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
  //   ],
  //   tiebreakers: {
  //     "5": [{teams: 7, id: "7/8", name: "7/8th Decider"}],
  //   },
  //   rounds: 6,
  //   winsToAdvance: 3,
  //   nonDeciderToWin: 1,
  //   deciderToWin: 2,
  //   tournamentType: Formats.SwissBuchholtz2024,
  //   resultTag: "",
  // },
  // {
  //   id: 2,
  //   name: "Europe-A",
  //   icon: GlobeEuropeAfricaIcon,
  //   seeds: EUA,
  //   seats: [
  //     // { status: "rmr-b", until: 4, abbrev: "1", statusPositioned: true },
  //     // { status: "rmr-a", until: 8, abbrev: "2", statusPositioned: true },
  //     { status: "qualified", until: 8, abbrev: "Q", statusPositioned: true },
  //     { status: "decider", until: 11, abbrev: "D", statusPositioned: true },
  //     { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
  //   ],
  //   tiebreakers: {},
  //   rounds: 5,
  //   winsToAdvance: 3,
  //   nonDeciderToWin: 1,
  //   deciderToWin: 2,
  //   tournamentType: Formats.SwissBuchholtz2024,
  //   resultTag: "cph24.cq.eua",
  // },
  // {
  //   id: 3,
  //   name: "Europe-B",
  //   icon: GlobeEuropeAfricaIcon,
  //   seeds: EUB,
  //   seats: [
  //     { status: "qualified", until: 8, abbrev: "Q", statusPositioned: true },
  //     // { status: "rmr-a", until: 4, abbrev: "1", statusPositioned: true },
  //     // { status: "rmr-b", until: 8, abbrev: "2", statusPositioned: true },
  //     { status: "decider", until: 11, abbrev: "D", statusPositioned: true },
  //     { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
  //   ],
  //   tiebreakers: {},
  //   rounds: 5,
  //   winsToAdvance: 3,
  //   nonDeciderToWin: 1,
  //   deciderToWin: 2,
  //   tournamentType: Formats.SwissBuchholtz2024,
  //   resultTag: "cph24.cq.eub",
  // },
  // {
  //   id: 4,
  //   name: "EU-Decider",
  //   icon: GlobeEuropeAfricaIcon,
  //   getSeeds: () => {
  //     try {
  //       if (localStorage["cph24.cq.eua"] && localStorage["cph24.cq.eub"]) {
  //         const la = JSON.parse(localStorage["cph24.cq.eua"]);
  //         const lb = JSON.parse(localStorage["cph24.cq.eub"]);
  //         if (la.length === 16 && lb.length === 16) {
  //           const _seeds = [la[8], lb[8], la[9], lb[9], la[10], lb[10]];
  //           return {
  //             success: true,
  //             seeds: _seeds.map((team, _seed) => ({
  //               code: team.code,
  //               name: team.name,
  //               seed: _seed + 1,
  //               buchholtz_offset: team.buchholtz,
  //               buchholtz: team.buchholtz,
  //             }))
  //           };
  //         } else {
  //           return {
  //             success: false,
  //             message: "This Tab requires visiting EUA and EUB first",
  //           };
  //         }
  //       } else {
  //         return {
  //           success: false,
  //           message: "This Tab requires visiting EUA and EUB first",
  //         };
  //       }
  //     } catch (e) {
  //       return {
  //         success: false,
  //         message: e.toString(),
  //       };
  //     }
  //     return {
  //       success: false,
  //       message: "??",
  //     };
  //   },
  //   defaultSeeds: null,
  //   seats: [
  //     { status: "rmr", until: 5, abbrev: "R", statusPositioned: true },
  //     { status: "eliminated", until: 6, abbrev: "E", statusPositioned: true },
  //   ],
  //   tiebreakers: {
  //     "1": [{teams: 4, id: "4/5", offset: 0.1, name: "4th Decider"}],
  //     "2": [{teams: 5, id: "5/6", offset: -0.1, name: "Qualification Match"}],
  //   },
  //   rounds: 3,
  //   winsToAdvance: 1,
  //   nonDeciderToWin: 1,
  //   deciderToWin: 2,
  //   tournamentType: Formats.SwissBuchholtz2024,
  //   resultTag: "",
  // },
];

const teamLogo = (code) => `https://img.majors.im/rmr/copenhagen2024_rmr/${code}.png`;

export default class Copenhagen2024RMR extends Regionals {
  Regions = Regions;
  teamLogo = teamLogo;
  title = "PGL Major Copenhagen 2024 RMR Simulator";
  // subtitle = "EU-Decider Teams are based on your choices in EUA & EUB.";
}
