const english_ordinal_rules = new Intl.PluralRules("en", {type: "ordinal"});
const suffixes = {
  one: "st",
  two: "nd",
  few: "rd",
  other: "th"
};
export function ordinal(number) {
  const suffix = suffixes[english_ordinal_rules.select(number)];
  return (number + suffix);
}

//
// export function dingbats(num) {
//   // if (num < 10) return ;
//   if (num <= 20) return String.fromCodePoint(0x2469 - 10 + num);
//   if (num <= 35) return String.fromCodePoint(0x3251 - 21 + num);
//   if (num <= 50) return String.fromCodePoint(0x32b1 - 35 + num);
//   return `${num}`;
// }

export function dingbats(num) {
  // if (num <= 20) return String.fromCodePoint(0x2488 - 1 + num);
  return `${num}`;
}
