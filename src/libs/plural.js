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
