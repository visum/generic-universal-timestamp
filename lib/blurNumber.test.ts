import blurNumber from "./blurNumber";

test("year with 10_000 precision", () => {
  const blurred = blurNumber(111_222_333_444, 10_000);
  expect(blurred).toBe("111,222,33~,~~~");
});

test("year with 100_000_000 precision", () => {
  const blurred = blurNumber(111_222_333_444, 100_000_000);
  expect(blurred).toBe("111,2~~,~~~,~~~");
});

test("year with 1 precision", () => {
  const blurred = blurNumber(111_222_333_444, 1);
  expect(blurred).toBe("111,222,333,444");
});

test("seconds with 10 precision", () => {
  const blurred = blurNumber("12.3456", 10);
  expect(blurred).toBe("1~.~~~~");
});

test("seconds with 1 precision", () => {
  const blurred = blurNumber("12.3456", 1);
  expect(blurred).toBe("12.~~~~");
});

test("seconds with 0.1 precision", () => {
  const blurred = blurNumber("12.3456", 0.1);
  expect(blurred).toBe("12.3~~~");
});

test("seconds with 0.01 precision", () => {
  const blurred = blurNumber("12.3456", 0.01);
  expect(blurred).toBe("12.34~~");
});

test("seconds with 0.0001 precision", () => {
  const blurred = blurNumber("12.3456", 0.0001);
  expect(blurred).toBe("12.3456");
});