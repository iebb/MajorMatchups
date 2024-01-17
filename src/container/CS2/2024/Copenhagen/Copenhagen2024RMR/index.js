/* eslint-disable global-require */

import {GlobeAmericasIcon, GlobeEuropeAfricaIcon} from '@heroicons/react/24/outline';
import React from 'react';
import Title from '../../../../../components/BannerInsertion';
import {BasicUI} from '../../../../../components/BasicUI';
import {fetchPrefix, getWinnerFromScoreCS2, pack, setWinner, shuffle} from '../../../../../libs/common/common';
import {FormatBinder, Formats} from "../../../../../libs/common/formats/formats";
import {Regionals} from "../../../../Common/Regional";
import {RegionalRankings_2023_12_AM} from "../Copenhagen2024Qual/regional_rankings";
import {AM, EUA, EUB, EUTB, AP, PrequalifiedTeamsAM, PrequalifiedTeamsEU} from './initial_data';
import {Results_ClosedQualifierNA} from "./provisional_data";
import {Scores} from './scores';

const getEUTeams = (group = 1) => {
  let teams = [];
  for(const team of PrequalifiedTeamsEU) {
    teams.push(team);
  }

  if (localStorage["cph24.cq.eua"] ) {
    const _teams = JSON.parse(localStorage["cph24.cq.eua"]);
    if (_teams.length === 16) {
      for (let i = 0; i < 8; i++) {
        teams.push(_teams[i]);
      }
    }
  }

  if (localStorage["cph24.cq.eub"] ) {
    const _teams = JSON.parse(localStorage["cph24.cq.eub"]);
    if (_teams.length === 16) {
      for (let i = 0; i < 8; i++) {
        teams.push(_teams[i]);
      }
    }
  }

  if (localStorage["cph24.cq.eud"] ) {
    const _teams = JSON.parse(localStorage["cph24.cq.eud"]);
    if (_teams.length === 6) {
      for (let i = 0; i < 5; i++) {
        teams.push(_teams[i]);
      }
    }
  }


  return teams.sort((x, y) => x.valveRanking - y.valveRanking).filter(
    (team, index) => (group === 1 ?
      [1, 3, 5, 7, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32] :
      [2, 4, 6, 8, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31]).includes(index + 1)
  ).map((team, _seed) => ({
    code: team.code,
    logo: team.logo,
    name: team.name,
    valveRanking: team.valveRanking,
    description: "VR #" + team.valveRanking,
    seed: _seed + 1,
  }))

}


const Regions = [
  {
    name: "Americas",
    icon: GlobeAmericasIcon,
    getSeeds: () => {
      let msg = [
        <p>Teams are based on your choices in <a href="/24qual_copenhagen#South-Am" className="underline hover:text-nekoko-400">Closed Qualifiers</a>, while seeding is base on Valve Rankings.</p>
      ];
      let teams = [];
      for(const team of PrequalifiedTeamsAM) {
        msg.push(<br />);
        msg.push(<p>Paris Major Seeds: </p>);
        msg.push(
          <span className="inline-block w-[240px]">
                {`${team.name} (${team.valveRanking})`}
              </span>
        );

        teams.push(team);
      }

      //if (localStorage["cph24.cq.nam"] ) {
        const _teams = Results_ClosedQualifierNA; // JSON.parse(localStorage["cph24.cq.nam"]);
        if (_teams.length === 16) {
          msg.push(<br/>);
          msg.push(<p>North American Seeds:</p>);
          // msg.push(<p>North American Seeds: <a className="underline hover:text-nekoko-400" onClick={() => {
          //   delete localStorage['cph24.cq.nam'];
          //   document.location.reload();
          // }}>[clear]</a></p>);
          for (let i = 0; i < 8; i++) {
            teams.push(_teams[i]);
            msg.push(
              <span className="inline-block w-[240px]">
                {`${_teams[i].name} (${_teams[i].valveRanking})`}
              </span>
            );
          }
        }
      // }

      if (localStorage["cph24.cq.sam"]) {
        const _teams = JSON.parse(localStorage["cph24.cq.sam"]);
        if (_teams.length === 16) {
          msg.push(<br />);
          msg.push(<p>South American Seeds: <a className="underline hover:text-nekoko-400" onClick={() => {
            delete localStorage['cph24.cq.sam'];
            document.location.reload();
          }}>[clear]</a> </p>);
          for(let i = 0; i < 7; i++) {
            teams.push(_teams[i]);
            msg.push(
              <span className="inline-block w-[240px]">
                {`${_teams[i].name} (${_teams[i].valveRanking})`}
              </span>
            );
          }
        }
      } else {
        return {
          success: true,
          seeds: AM,
          message: <div className="text-left">
            <p>Pick your winners in <a
              href="/24qual_copenhagen#South-Am"
              className="underline hover:text-nekoko-400">Closed Qualifiers</a> (incl. Decider) to have this page updated!
            </p>
          </div>,
        };
      }

      return {
        success: true,
        seeds: teams.sort((x, y) => x.valveRanking - y.valveRanking).map((team, _seed) => ({
          code: team.code,
          logo: team.logo,
          name: team.name,
          description: "VR #" + team.valveRanking,
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
  {
    name: "Europe-A",
    icon: GlobeEuropeAfricaIcon,
    getSeeds: () => {
      let msg = [
        <p>Teams are based on your choices in <a href="/24qual_copenhagen#Europe-A" className="underline hover:text-nekoko-400">Closed Qualifiers</a>, while seeding is base on Valve Rankings.</p>
      ];

      let teams = getEUTeams(1);

      if (teams.length === 16) {
        console.log(teams);
        msg.push(<br />);
        msg.push(<p>Seeds: </p>);
        for(const team of teams) {
          msg.push(
            <span className="inline-block w-[240px]">
            {`${team.name} (${team.valveRanking})`}
          </span>
          );
        }

        return {
          success: true,
          seeds: teams,
          message: <div className="text-left">{msg}</div>,
        };
      } else {
        return {
          success: true,
          seeds: EUA,
          message: <p>
            This Tab requires visiting <a href="/24qual_copenhagen#Europe-A" className="underline hover:text-nekoko-400">Closed Qualifiers</a> first.
          </p>,
        };
      }
    },
    seeds: EUA,
    seats: [
      {status: "qualified", until: 8, abbrev: "Q", statusPositioned: true },
      { status: "decider", until: 11, abbrev: "D", statusPositioned: true },
      { status: "eliminated", until: 16, abbrev: "E", statusPositioned: true },
    ],
    tiebreakers: {},
    rounds: 5,
    winsToAdvance: 3,
    nonDeciderToWin: 1,
    deciderToWin: 2,
    tournamentType: Formats.SwissBuchholtz2024,
  },
  {
    name: "Europe-B",
    icon: GlobeEuropeAfricaIcon,
    getSeeds: () => {
      let msg = [
        <p>Teams are based on your choices in <a href="/24qual_copenhagen#Europe-A" className="underline hover:text-nekoko-400">Closed Qualifiers</a>, while seeding is base on Valve Rankings.</p>
      ];

      let teams = getEUTeams(2);

      if (teams.length === 16) {
        msg.push(<br />);
        msg.push(<p>Seeds: </p>);
        for(const team of teams) {
          msg.push(
            <span className="inline-block w-[240px]">
            {`${team.name} (${team.valveRanking})`}
          </span>
          );
        }

        return {
          success: true,
          seeds: teams,
          message: <div className="text-left">{msg}</div>,
        };
      } else {
        return {
          success: true,
          seeds: EUA,
          message: <p>
            This Tab requires visiting <a href="/24qual_copenhagen#Europe-A" className="underline hover:text-nekoko-400">Closed Qualifiers</a> first.
          </p>,
        };
      }
    },
    seats: [
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
  },
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
].map((r, id) => ({...r, id}));

const teamLogo = (code) => `https://img.majors.im/rmr/copenhagen2024_rmr/${code}.png`;

export default class Copenhagen2024RMR extends Regionals {
  defaultTab = 0;
  Regions = Regions;
  teamLogo = teamLogo;
  title = "PGL Major Copenhagen 2024 RMR Simulator";
  // subtitle = "EU-Decider Teams are based on your choices in EUA & EUB.";
}
