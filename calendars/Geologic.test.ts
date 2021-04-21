import Geologic from "./Geologic";
import UniversalTimestamp from "../UniversalTimestamp";

test("fromUniversal", () => {
  const universal = UniversalTimestamp.parse("<---,---,--0,020+~~~#~~:~~:~~.~~~");
  const geo = new Geologic();
  geo.fromUniversal(universal);

  expect(geo.year).toBe(-20_000_000_000);
  expect(geo.precision).toBe(100_000_000);
});

test("toUniversal", () => {
  const geo = new Geologic();
  geo.year = -3_000;
  geo.precision = 1_000;
  const universal = geo.toUniversal();
  expect(universal.years).toBe(3_000);
  expect(universal.meridian).toBe("<");
  expect(universal.precision.year).toBe(1_000);
});

test("toString", () => {
  const geo = new Geologic();
  geo.year = -22_100_000;
  expect(geo.toString()).toBe("22.1My ago");
});
