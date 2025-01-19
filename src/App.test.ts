import { describe, it, expect } from "vitest";
import { getCurrentCell } from "./App";

describe("getCurrentCell", () => {
  it("gets the next cell when the last one is filled", () => {
    const ans = {
      data: [
        [1, 21, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      rows: 3,
      columns: 3,
    };
    const userInput = "12134";
    const i = 1;
    const j = 1;
    expect(getCurrentCell(ans, userInput)).toEqual({ i, j });
  });

  it("gets the current cell when its only half-filled", () => {
    const ans = {
      data: [
        [1, 21, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      rows: 3,
      columns: 3,
    };
    const userInput = "12";
    const i = 0;
    const j = 1;
    expect(getCurrentCell(ans, userInput)).toEqual({ i, j });
  });
});
