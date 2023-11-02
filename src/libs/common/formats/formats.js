import {SwissBuchholtzR1P} from "./SwissBuchholtzR1P";
import { SwissBuchholtzTB } from './SwissBuchholtzTB';
import { Knockout } from './Knockout';
import { DoubleElimination } from './DoubleElimination';

export const Formats = {
  SwissBuchholtz: 0,
  SwissBuchholtzWithTiebreaker: 0,

  SwissBuchholtzR1P: 1,

  Knockout: 2,
  SingleElimination: 2,

  DoubleElimination: 4,
}

export const FormatBinder = {
  [Formats.SwissBuchholtz]: SwissBuchholtzTB,
  [Formats.SwissBuchholtzR1P]: SwissBuchholtzR1P,
  [Formats.SingleElimination]: Knockout,
  [Formats.DoubleElimination]: DoubleElimination,
}
