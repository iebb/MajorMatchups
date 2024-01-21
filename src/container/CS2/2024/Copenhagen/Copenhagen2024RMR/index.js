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
import {Results_ClosedQualifierEUA, Results_ClosedQualifierEUB, Results_ClosedQualifierNA} from "./provisional_data";
import {Scores} from './scores';

const getEUTeams = (group = 1) => {
  let teams = [];
  for(const team of PrequalifiedTeamsEU) {
    teams.push(team);
  }

  if (true) { // if (localStorage["cph24.cq.eub"]) {
    const _teams = Results_ClosedQualifierEUA; // = JSON.parse(localStorage["cph24.cq.eub"]);
    if (_teams.length === 16) {
      for (let i = 0; i < 8; i++) {
        teams.push(_teams[i]);
      }
    }
  }

  if (true) { // if (localStorage["cph24.cq.eub"]) {
    const _teams = Results_ClosedQualifierEUB; // = JSON.parse(localStorage["cph24.cq.eub"]);
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


  const teamCount = new Set(teams.map(t => t.code)).size;

  if (teamCount !== 32) {
    return [];
  }

  const sortedTeam = teams.sort((x, y) => x.valveRanking - y.valveRanking).map(
    (team, index) => ({...team, index: index + 1})
  )

  return sortedTeam.filter(
    (team, index) => (group === 1 ?
      [1, 3, 5, 7, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32] :
      [2, 4, 6, 8,  9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31]).indexOf(team.index) !== -1
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
        msg.push(<p><b>Paris Major Seeds: </b></p>
        );
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
        msg.push(<p><b>North American Seeds:</b></p>);
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
          msg.push(<p><b>South American Seeds:</b> <a className="underline hover:text-nekoko-400" onClick={() => {
            delete localStorage['cph24.cq.sam'];
            document.location.reload();
          }}>[clear]</a></p>);
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
    getSeeds: () => {
      let msg = [
        <p>Teams are based on your choices in <a href="/24qual_copenhagen#EU-Decider" className="underline hover:text-nekoko-400">Closed Qualifiers</a>, while seeding is base on Valve Rankings.</p>
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
          message: <div className="text-left">
            <p>Pick your winners in <a
              href="/24qual_copenhagen#EU-Decider"
              className="underline hover:text-nekoko-400">Closed Qualifiers</a> (incl. Decider) to have this page updated!
            </p>
          </div>,
        };
      }
    },
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
    getSeeds: () => {
      let msg = [
        <p>
          Teams are based on your choices in <a href="/24qual_copenhagen#EU-Decider" className="underline hover:text-nekoko-400">Closed Qualifiers</a>, while seeding is base on Valve Rankings.
        </p>
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
          message: <div className="text-left">
            <p>Pick your winners in <a
              href="/24qual_copenhagen#EU-Decider"
              className="underline hover:text-nekoko-400">Closed Qualifiers</a> (incl. Decider) to have this page updated!
            </p>
          </div>,
        };
      }
    },
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

      if (localStorage["cph24.rmr.eub"]) {
        const teams = JSON.parse(localStorage["cph24.rmr.eub"]);
        if (teams.length === 16) {
          msg.push(<br />);
          msg.push(<p>EU Qualifier B Seeds: <a className="underline hover:text-nekoko-400" onClick={() => {
            delete localStorage['cph24.rmr.eub'];
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
  },
].map((r, id) => ({...r, id}));

const teamLogo = (code) => `https://img.majors.im/rmr/copenhagen2024_rmr/${code}.png`;

export default class Copenhagen2024RMR extends Regionals {
  defaultTab = 0;
  Regions = Regions;
  teamLogo = teamLogo;
  title = "PGL Major Copenhagen 2024 RMR Simulator";
  // subtitle = "EU-Decider Teams are based on your choices in EUA & EUB.";
}
