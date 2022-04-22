export function plus_minus(number) {
  if (number > 0) return `+${number}`
  if (number < 0) return `-${-number}`
  return "±0";
}
