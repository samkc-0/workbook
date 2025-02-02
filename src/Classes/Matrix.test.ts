import {
  reshape,
  dotproduct,
  fullMatrix,
  stringifyMatrix,
  giveFeedbackMatrix,
  PartialMatrix,
  getExpression,
} from "./Classes/Matrix";
import { describe, expect, it } from "vitest";

// describe("parseMatrix can parse a...", () => {
//   it("2D matrix", () => {
//     const result = parseMatrix({ data: "1 0; 0 1;", rows: 2, columns: 2 });
//     expect(result[0][0]).toBe(1);
//     expect(result[1][1]).toBe(1);
//   });

//   it("3D matrix", () => {
//     const result = parseMatrix({
//       data: "1 0 0; 0 1 0; 0 0 1;",
//       rows: 3,
//       columns: 3,
//     });
//     expect(result).not.toBeUndefined();
//     expect(result[0][0]).toBe(1);
//     expect(result[1][1]).toBe(1);
//     expect(result[2][2]).toBe(1);
//   });

//   it("4D matrix", () => {
//     const result = parseMatrix({
//       data: "1 0 0 0; 0 1 0 0 ; 0 0 1 0; 0 0 0 1;",
//       rows: 3,
//       columns: 3,
//     });
//     expect(result).not.toBeUndefined();
//     expect(result[0][0]).toBe(1);
//     expect(result[1][1]).toBe(1);
//     expect(result[2][2]).toBe(1);
//     expect(result[3][3]).toBe(1);
//   });
// });

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

describe("reshshape", () => {
  it("reshapes a flat array to a 2d array", () => {
    const expected = [
      [1, 1, 1],
      [1, 1, 1],
    ];
    const test = [1, 1, 1, 1, 1, 1];
    expect(reshape(test, 2, 3)).toEqual(expected);
  });
  it("pads a short array array with zeros before reshaping", () => {
    const expected = [
      [1, 1, 0],
      [0, 0, 0],
    ];
    const test = [1, 1];
    expect(reshape(test, 2, 3).data).toEqual(expected);
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

describe("getExpression", () => {
  it("can get the expression to compute a cell", () => {
    const a = {
      data: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      rows: 3,
      columns: 3,
    };
    const b = {
      data: [
        [1, 1, 1],
        [3, 1, 1],
        [5, 1, 1],
      ],
      rows: 3,
      columns: 3,
    };
    const expected = "1*1 + 2*3 + 3*5";
    expect(getExpression(a, b, 0, 0)).toBe(expected);
  });
});

// describe("toLatex can convert to latex a...", () => {
//   it("2D vector", () => {
//     const v = new Vector2().fromArray([1, 2]);
//     let latex = toLatex(v);
//     expect(latex).toBe(`\\begin{bmatrix} 1 & 2 \\end{bmatrix}`);

//     latex = toLatex(v, "transpose");
//     expect(latex).toBe(`\\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix}`);
//   });
//   it("2D matrix", () => {
//     const latex = toLatex(new Matrix2().fromArray([1, 2, 3, 4]));
//     expect(latex).toBe(`\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}`);
//   });
// });

// describe("toArray", () => {
//   it("converts a matrix to a 2D array", () => {
//     const m2 = new Matrix2();
//     expect(toArray(m2)).toEqual([
//       [1, 0],
//       [0, 1],
//     ]);
//   });
//   it("converts a vector to a 1D array", () => {
//     const v2 = new Vector2(1, 0);
//     expect(toArray(v2)).toEqual([1, 0]);
//   });
// });

// it("getDimension gets a matrix dimension in the format 'mxn'", () => {
//   const result = getDimension([
//     [0, 1],
//     [1, 0],
//   ]);
//   expect(result).toBe("2x2");
// });
