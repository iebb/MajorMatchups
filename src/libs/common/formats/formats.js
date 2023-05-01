import { SwissBuchholtzTB } from './SwissBuchholtzTB';
import { Knockout } from './Knockout';
import { DoubleElimination } from './DoubleElimination';

export const Formats = {
  SwissBuchholtz: 0,
  SwissBuchholtzWithTiebreaker: 0,

  Knockout: 2,
  SingleElimination: 2,

  DoubleElimination: 4,
}

export const FormatBinder = {
  [Formats.SwissBuchholtz]: SwissBuchholtzTB,
  [Formats.Knockout]: Knockout,
  [Formats.DoubleElimination]: DoubleElimination,
}
