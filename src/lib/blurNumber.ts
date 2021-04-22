/**
 * Reduce the intended precision of a number by replacing part of it with a
 * non-significant placeholder character.
 */

function commafy(input: string): string {
  if (input.length < 4) {
    return input;
  }
  const chars = input.split("");
  chars.splice(9, 0, ",");
  chars.splice(6, 0, ",");
  chars.splice(3, 0, ",");
  return chars.join("");
}

export function blurYears(
  input: string | number,
  precision: number,
  placeholderChar: "~" | "-" = "~"
): string {
  const workString = typeof input === "string" ? input : input + "";
  const precisionLog = Math.log10(precision);
  const digits = workString.split("");
  const length = 12;

  const filler = [];
  while (filler.length < precisionLog) {
    filler.push(placeholderChar);
  }
  digits.splice(digits.length - filler.length, filler.length, ...filler);
  while (digits.length < length) {
    digits.unshift("0");
  }
  return commafy(digits.join(""));
}

export function blurDays(input: string | number, precision: number): string {
  if (precision === 0) {
    return "~~~";
  }

  const workString = typeof input === "string" ? input : input + "";
  const precisionLog = Math.log10(precision);
  const digits = workString.split("");
  const length = 3;

  const filler = [];
  while (filler.length < precisionLog) {
    filler.push("~");
  }
  digits.splice(digits.length - filler.length, filler.length, ...filler);
  while (digits.length < length) {
    digits.unshift("0");
  }

  return digits.join("");
}

export function blurSeconds(input: string | number, precision: number): string {
  if (precision === 0) {
    return "~~.~~~";
  }
  const workString = typeof input === "string" ? input : input + "";
  const precisionLog = Math.log10(precision);

  const noDecimal = workString.replace(".", "");
  const digits = noDecimal.split("");

  if (precisionLog === 1) {
    return [digits[0], "~", ".", "~", "~", "~"].join("");
  }

  if (precisionLog === 0) {
    return [digits[0], digits[1], ".", "~", "~", "~"].join("");
  }

  const fillerLength = 5 + precisionLog - 2;

  const filler = [];
  while (filler.length < fillerLength) {
    filler.push("~");
  }

  while(digits.length < 5 - fillerLength) {
    digits.push("0");
  }

  digits.splice(5 - fillerLength, fillerLength, ...filler);
  // add the decimal back in
  digits.splice(2, 0, ".");
  return digits.join("");
}
