/**
 * Reduce the intended precision of a number by replacing part of it with a
 * non-significant placeholder character.
 * @param input Input number
 * @param precision How precise the number is intended to be
 * @param placeholderChar Character to use as a non-significant placeholder
 */
export default function blurNumber(
  input: number | string,
  precision: number,
  placeholderChar: string = "~"
): string {
  const workString = typeof input === "string" ? input : input + "";

  // how many digits from the decimal are imprecise.
  // A negative number means decimal precision
  const precisionLog = Math.log10(precision);

  // year (no decimal)
  if (!workString.includes(".")) {
    if (precisionLog > 0) {
      const filler = [];
      while (filler.length < precisionLog) {
        filler.push(placeholderChar);
      }
      const digits = workString.split("");
      digits.splice(digits.length - filler.length, filler.length, ...filler);
      return commafy(digits.join(""));
    } else {
      return commafy(workString);
    }
  } else {
    // seconds (with decimal)
    // 00.0000
    // we know where the decimal is, we can just take it out and put it back in later
    let noDecimal = workString.replace(".", "");

    const fillerLength =
      precisionLog > 0 ? 6 - precisionLog : 6 + precisionLog - 2;

    const filler = [];
    while (filler.length < fillerLength) {
      filler.push(placeholderChar);
    }

    const blurredChars = noDecimal.split("");
    blurredChars.splice(noDecimal.length - fillerLength, fillerLength, ...filler);
    // add the decimal back in
    blurredChars.splice(2, 0, ".");
    return blurredChars.join("");
  }
}

function commafy(input:string):string {
  const chars = input.split("");
  chars.splice(9, 0, ",");
  chars.splice(6, 0, ",");
  chars.splice(3, 0, ",");
  return chars.join("");
}