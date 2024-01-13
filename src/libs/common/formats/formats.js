import {SwissBuchholtzR1P} from "./SwissBuchholtzR1P";
import { SwissBuchholtzTB } from './SwissBuchholtzTB';
import { Knockout } from './Knockout';
import { DoubleElimination } from './DoubleElimination';
import {SwissBuchholtzTB_2024} from "./SwissBuchholtzTB_2024";

export const Formats = {
  SwissBuchholtz: 0,
  SwissBuchholtzWithTiebreaker: 0,

  SwissBuchholtzR1P: 1,
  SwissBuchholtz2024: 100,

  Knockout: 2,
  SingleElimination: 2,

  DoubleElimination: 4,
}

export const isSwissBuchholtzFormat = (f) => {
  return f === Formats.SwissBuchholtz || f === Formats.SwissBuchholtzR1P || f === Formats.SwissBuchholtz2024;
}

export const FormatBinder = {
  [Formats.SwissBuchholtz]: SwissBuchholtzTB,
  [Formats.SwissBuchholtz2024]: SwissBuchholtzTB_2024,
  [Formats.SwissBuchholtzR1P]: SwissBuchholtzR1P,
  [Formats.SingleElimination]: Knockout,
  [Formats.DoubleElimination]: DoubleElimination,
}
