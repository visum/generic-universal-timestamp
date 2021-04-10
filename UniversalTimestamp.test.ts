import UniversalTimestamp from "./UniversalTimestamp";

describe("UniversalTimestamp", () => {
  test("constructor", () => {
    expect(() => {const ts = new UniversalTimestamp();}).not.toThrow();
  });

  test("Parses Billions BC", () => {
    //13.8 BYA, Big Bang
    const ts = UniversalTimestamp.parse("<---,---,--8,310+~~~#~~:~~:~~.~~~");
    expect(ts.years).toBe(13_800_000_000);
    expect(ts.precision.year).toBe(100_000_000);
    expect(ts.meridian).toBe("<");
  });

  test("Parses Millions BC", () => {
    const ts = UniversalTimestamp.parse("<---,209,152,000+~~~#~~:~~:~~.~~~");
    expect(ts.years).toBe(251_902_000);
    expect(ts.precision.year).toBe(1_000);
    expect(ts.meridian).toBe("<");
  });

  test("Parses AD year/day", () => {
    const ts = UniversalTimestamp.parse(">000,000,001,983+205#~~:~~:~~.~~~");
    expect(ts.years).toBe(1_983);
    expect(ts.days).toBe(205);
    expect(ts.precision.year).toBe(1);
    expect(ts.precision.day).toBe(1);
    expect(ts.meridian).toBe(">");
  });

  test("Parses AD year/day/hour/minute/second", () => {
    const ts = UniversalTimestamp.parse(">000,000,001,969+205#16:50:35.~~~");
    expect(ts.years).toBe(1969);
    expect(ts.meridian).toBe(">");
    expect(ts.hours).toBe(16);
    expect(ts.minutes).toBe(50);
    expect(ts.seconds).toBe(35);
    expect(ts.precision.second).toBe(1);
  });

  test("Parses AD to hundredth of second", () => {
    const ts = UniversalTimestamp.parse(">000,000,002,000+359#05:00:02.12~");
    expect(ts.seconds).toBe(2.120);
    expect(ts.precision.second).toBe(0.01);
  });

  test("Parses AD to tenth of millisecond", () => {
    const ts = UniversalTimestamp.parse(">000,000,002,000+359#05:00:02.123");
    expect(ts.seconds).toBe(2.123);
    expect(ts.precision.second).toBe(0.001);
  });

  test("Round-trip parse and toString year only", () => {
    const start = "<---,209,152,000+~~~#~~:~~:~~.~~~";
    const ts = UniversalTimestamp.parse(start);
    expect(ts.toString()).toBe(start);
  });

  test("Round-trip parse and toString year day hour minute second", () => {
    const start = ">000,123,~~~,~~~+012#11:22:33.~~~";
    const ts = UniversalTimestamp.parse(start);
    expect(ts.toString()).toBe(start);
  });

});
