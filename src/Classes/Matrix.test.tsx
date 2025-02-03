import {
  dotproduct,
  fullMatrix,
  stringifyMatrix,
  giveFeedbackMatrix,
  PartialMatrix,
} from "./Matrix";
import { describe, expect, it } from "vitest";
import "@testing-library/dom";

describe("dotproduct", () => {
  it("can compute the dotproduct for two 3x3 matrices", () => {
    const a = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const b = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    const expected = [
      [6, 6, 6],
      [15, 15, 15],
      [24, 24, 24],
    ];
    expect(
      dotproduct(
        { data: a, rows: 3, columns: 3 },
        { data: b, rows: 3, columns: 3 }
      ).data
    ).toEqual(expected);
  });
});

describe("stringifyMatrix", () => {
  it("can put a matrix in string form", () => {
    const a = {
      data: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      rows: 3,
      columns: 3,
    };
    expect(stringifyMatrix(a)).toBe("1 2 3;4 5 6;7 8 9");
  });
});

describe("fullMatrix", () => {
  it("can make a matrix that is all ones with dimensions 2x3", () => {
    const expected = [
      [1, 1, 1],
      [1, 1, 1],
    ];
    const result = fullMatrix(2, 3, 1) as PartialMatrix;
    expect(result.data).toEqual(expected);
    expect(result.rows).toBe(2);
    expect(result.columns).toBe(3);
  });
});

describe("giveFeedbackMatrix", () => {
  it("works", () => {
    const answer = {
      data: [
        [1, 13, 5],
        [44, 2, 1],
        [0, 1, 0],
      ],
      rows: 3,
      columns: 3,
    };
    const submission = "11354";
    const expected = {
      data: [
        [1, 13, 5],
        [4, undefined, undefined],
        [undefined, undefined, undefined],
      ],
      columns: 3,
      rows: 3,
    };
    expect(giveFeedbackMatrix(answer, submission)).toEqual(expected);
  });
});
