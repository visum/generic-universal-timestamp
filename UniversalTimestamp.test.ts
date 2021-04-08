import UniversalTimestamp from "./UniversalTimestamp";

describe("UniversalTimestamp", () => {
  test("constructor", () => {
    expect(() => {const ts = new UniversalTimestamp();}).not.toThrow();
  });

  test("parses", () => {
    const validTimestamps = [
      "<---,---,--8,310+---#--:--:--.---", // 13.8 BYA, Big Bang
      "<---,209,152,000+---#--:--:--.---", // 251.902 MYA, Beginning of Triassic
      ">000,000,001,983+205#--:--:--.---", // Somebody's Birthday
      ">000,000,001,969+205#16:50:35.---", // July 24, 1969, 16:50:35 UTC, Apollo 11 Moon landing
    ];

    const results = [
      {
        year: 13_800_000_000,
        precision: {
          year: 100_000_000
        },
        meridianFlag: "<"
      },
      {
        year: 251_902_000,
        precision: {
          year: 1000
        },
        meridianFlag: "<"
      },
      {
        year: 1938,
        precision: {
          year: 1,
          day: 1
        },
        meridianFlag: ">"
      },
      {
        year: 1969,
        precision: {
          year: 1,
          day: 1,
          hour: 1,
          minute: 1,
          second: 1
        }
      }
    ];

    const timestamps = validTimestamps.map((item) => {
      const timestamp = new UniversalTimestamp();
      timestamp.parse(item);
      return timestamp;
    });

    timestamps.forEach((item, index) => {
      expect(item).toMatchObject(results[index]);
    });
  });
});
