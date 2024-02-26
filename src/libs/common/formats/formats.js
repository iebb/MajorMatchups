import {getWinnerFromScoreCS2} from "../common";
import {Elo2019} from "./Elo2019";
import {SwissBuchholtzR1P} from "./SwissBuchholtzR1P";
import { SwissBuchholtzTB } from './SwissBuchholtzTB';
import { Knockout } from './Knockout';
import { DoubleElimination } from './DoubleElimination';
import {SwissBuchholtzTB_2024} from "./SwissBuchholtzTB_2024";

export const Formats = {

  Knockout: 2,
  SingleElimination: 2,

  DoubleElimination: 4,

  SwissBuchholtz: 0,
  SwissBuchholtzWithTiebreaker: 0,
  SwissBuchholtzR1P: 1,

  SwissBuchholtz2024: 12024,
  DoubleElimination2024: 42024,

  Elo2019: 12019,
}

export const isSwissBuchholtzFormat = (f) => {
  return f === Formats.SwissBuchholtz || f === Formats.SwissBuchholtzR1P || f === Formats.SwissBuchholtz2024;
}

export const isSwissBuchholtzOrEloFormat = (f) => {
  return f === Formats.SwissBuchholtz || f === Formats.SwissBuchholtzR1P || f === Formats.SwissBuchholtz2024 || f === Formats.Elo2019;
}

export const FormatBinder = {
  [Formats.SwissBuchholtz]: SwissBuchholtzTB,
  [Formats.SwissBuchholtz2024]: SwissBuchholtzTB_2024,
  [Formats.SwissBuchholtzR1P]: SwissBuchholtzR1P,
  [Formats.SingleElimination]: Knockout,
  [Formats.DoubleElimination]: DoubleElimination,
  [Formats.DoubleElimination2024]: function (f, t) { return DoubleElimination.bind(this)(f, t, getWinnerFromScoreCS2) },
  [Formats.Elo2019]: Elo2019,
}
