import { scoreGuess } from "../lib/scoring";

describe("Wordle Scoring Algorithm", () => {
  test("All correct letters", () => {
    const result = scoreGuess("CRUMB", "CRUMB");
    expect(result).toEqual(["correct", "correct", "correct", "correct", "correct"]);
  });

  test("Mixed correct, present, absent", () => {
    const result = scoreGuess("CROWN", "CRUMB");
    expect(result).toEqual(["correct", "correct", "absent", "absent", "absent"]);
  });

  test("Present letter duplicates handling", () => {
    const result = scoreGuess("ROBOT", "TOAST");
    expect(result).toEqual(["absent", "correct", "absent", "present", "absent"]);
  });
});

