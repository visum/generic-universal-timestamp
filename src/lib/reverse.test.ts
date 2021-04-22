import reverse from "./reverse";

test("Reverses a string", () => {
  const reversed = reverse("abcdefg");
  expect(reversed).toBe("gfedcba");
});