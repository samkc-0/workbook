import { Matrix3, Matrix2, Vector2, Vector3, Vector4 } from "three";
import {
  dotproduct,
  getDimension,
  parseMatrix,
  stringifyMatrix,
  toArray,
  toLatex,
} from "./App";
import { describe, expect, it } from "vitest";

describe("parseMatrix can parse a...", () => {
  it("2D matrix", () => {
    const result = parseMatrix("1 0; 0 1;");
    expect(result[0][0]).toBe(1);
    expect(result[1][1]).toBe(1);
  });

  it("3D matrix", () => {
    const result = parseMatrix("1 0 0; 0 1 0; 0 0 1;");
    expect(result).not.toBeUndefined();
    expect(result[0][0]).toBe(1);
    expect(result[1][1]).toBe(1);
    expect(result[2][2]).toBe(1);
  });

  it("4D matrix", () => {
    const result = parseMatrix("1 0 0 0; 0 1 0 0 ; 0 0 1 0; 0 0 0 1;");
    expect(result).not.toBeUndefined();
    expect(result[0][0]).toBe(1);
    expect(result[1][1]).toBe(1);
    expect(result[2][2]).toBe(1);
    expect(result[3][3]).toBe(1);
  });
});

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
    expect(dotproduct(a, b)).toEqual(expected);
  });
});

describe("stringifyMatrix", () => {
  it("can put a matrix in string form", () => {
    const a = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    expect(stringifyMatrix(a)).toBe("1 2 3;4 5 6;7 8 9");
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
