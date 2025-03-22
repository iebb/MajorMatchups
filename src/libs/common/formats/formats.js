import {getWinnerFromScoreCS2} from "../common";
import {DoubleElimination} from './DoubleElimination';
import {Elo2019} from "./Elo2019";
import {Knockout} from './Knockout';
import {SwissBuchholtzR1P} from "./SwissBuchholtzR1P";
import {SwissBuchholtzTB} from './SwissBuchholtzTB';
import {SwissBuchholtzTB_2024} from "./SwissBuchholtzTB_2024";
import { SwissBuchholtzTB_2024_R6_mod } from './SwissBuchholtzTB_2024_R6_mod';

export const Formats = {

  Knockout: 2,
  SingleElimination: 2,

  DoubleElimination: 4,

  SwissBuchholtz: 0,
  SwissBuchholtzWithTiebreaker: 0,
  SwissBuchholtzR1P: 1,

  SwissBuchholtz2024: 12024,
  DoubleElimination2024: 42024,
  Knockout2024: 22024,

  Elo2019: 12019,
  SwissBuchholtzTB_2024_R6_mod: 241111,
}

export const isSwissBuchholtzFormat = (f) => {
  return f === Formats.SwissBuchholtz ||
    f === Formats.SwissBuchholtzR1P ||
    f === Formats.SwissBuchholtz2024 ||
    f === Formats.SwissBuchholtzTB_2024_R6_mod;
}

export const isSwissBuchholtzOrEloFormat = (f) => {
  return f === Formats.SwissBuchholtz ||
    f === Formats.SwissBuchholtzR1P ||
    f === Formats.SwissBuchholtz2024 ||
    f === Formats.SwissBuchholtzTB_2024_R6_mod ||
    f === Formats.Elo2019;
}

export const FormatBinder = {
  [Formats.SwissBuchholtz]: SwissBuchholtzTB,
  [Formats.SwissBuchholtz2024]: SwissBuchholtzTB_2024,
  [Formats.SwissBuchholtzTB_2024_R6_mod]: SwissBuchholtzTB_2024_R6_mod,
  [Formats.SwissBuchholtzR1P]: SwissBuchholtzR1P,
  [Formats.SingleElimination]: Knockout,
  [Formats.DoubleElimination]: DoubleElimination,
  [Formats.DoubleElimination2024]: function (f, t) { return DoubleElimination.bind(this)(f, t, getWinnerFromScoreCS2) },
  [Formats.Knockout2024]: function (f, t) { return Knockout.bind(this)(f, t, getWinnerFromScoreCS2) },
  [Formats.Elo2019]: Elo2019,
}
