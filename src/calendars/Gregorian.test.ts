import Gregorian from "./Gregorian";
import UniversalTimestamp from "../UniversalTimestamp";

test("isLeap", () => {
  const calendar = new Gregorian();
  calendar.year = 1999;
  expect(calendar.isLeap).toBe(false);
  calendar.year = 2000;
  expect(calendar.isLeap).toBe(true);
  calendar.year = 1900;
  expect(calendar.isLeap).toBe(false);
});

test("fromUniversal", () => {
  const universal = UniversalTimestamp.parse(">000,000,002,000+359#05:00:02.123");
  const gregorian = new Gregorian();
  gregorian.fromUniversal(universal);
  expect(gregorian.toString()).toBe("2000-12-24 05:00:02.123");
});

test("toUniversal", () => {
  const gregorian = new Gregorian();
  gregorian.year = 1999;
  gregorian.day = 24;
  gregorian.month = 6;
  gregorian.hour = 12;
  gregorian.minute = 6;
  gregorian.second = "30.000";

  const universal = gregorian.toUniversal();

  expect(universal.toString()).toBe(">000,000,001,999+175#12:06:30.000");
});

test("1582", () => {
  const gregorian = new Gregorian();
  gregorian.year = 1582;
  gregorian.month = 10;
  gregorian.day = 4;

  expect(gregorian.getDayOfYear()).toBe(277);
  gregorian.day = 15;
  expect(gregorian.getDayOfYear()).toBe(278);
  gregorian.month = 12;
  gregorian.day = 31;
  expect(gregorian.getDayOfYear()).toBe(355);
});