import {blurDays, blurSeconds, blurYears} from "./blurNumber";

test("year with 10_000 precision", () => {
  const blurred = blurYears(111_222_333_444, 10_000);
  expect(blurred).toBe("111,222,33~,~~~");
});

test("year with 100_000_000 precision", () => {
  const blurred = blurYears(111_222_333_444, 100_000_000);
  expect(blurred).toBe("111,2~~,~~~,~~~");
});

test("year with 1 precision", () => {
  const blurred = blurYears(111_222_333_444, 1);
  expect(blurred).toBe("111,222,333,444");
});

test("other placeholder char", () => {
  const blurred = blurYears(111_222_333_444, 100_000, "-");
  expect(blurred).toBe("111,222,3--,---");
});

test("number with forced length - years", () => {
  const blurred = blurYears(1_222, 1);
  expect(blurred).toBe("000,000,001,222");
});

test("number with forced length - days", () => {
  const blurred = blurDays(12, 1);
  expect(blurred).toBe("012");
});

test("number with forced length - years with 10_000 precision", () => {
  const blurred = blurYears(12_234_567, 10_000);
  expect(blurred).toBe("000,012,23~,~~~");
});

test("day with 10 precision", () => {
  const blurred = blurDays(123, 10);
  expect(blurred).toBe("12~");
});

test("day with 1 precision", () => {
  const blurred = blurDays(123, 1);
  expect(blurred).toBe("123");
});

test("seconds with 10 precision", () => {
  const blurred = blurSeconds("12.345", 10);
  expect(blurred).toBe("1~.~~~");
});

test("seconds with 1 precision", () => {
  const blurred = blurSeconds("12.345", 1);
  expect(blurred).toBe("12.~~~");
});

test("seconds with 0.1 precision", () => {
  const blurred = blurSeconds("12.345", 0.1);
  expect(blurred).toBe("12.3~~");
});

test("seconds with 0.01 precision", () => {
  const blurred = blurSeconds("12.345", 0.01);
  expect(blurred).toBe("12.34~");
});

test("seconds with 0.0001 precision", () => {
  const blurred = blurSeconds("12.345", 0.001);
  expect(blurred).toBe("12.345");
});

test("no seconds with 0 precision", () => {
  const blurred = blurSeconds(0, 0);
  expect(blurred).toBe("~~.~~~");
});

test("numeric seconds with 10 precision", () => {
  const blurred = blurSeconds(12, 10);
  expect(blurred).toBe("1~.~~~");
});

test("numeric seconds with 1 precision", () => {
  const blurred = blurSeconds(12, 1);
  expect(blurred).toBe("12.~~~");
});

test("numeric seconds with 0.01 precision", () => {
  const blurred = blurSeconds(12, 0.01);
  expect(blurred).toBe("12.00~");
});