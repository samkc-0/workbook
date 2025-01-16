import { Matrix3, Matrix2, Vector2, Vector3, Vector4 } from "three";
import { getDimension, parseMatrix, toArray, toLatex } from "./App";
import { describe, expect, it } from "vitest";

describe("parseMatrix can parse a...", () => {
  it("2D vector", () => {
    let result = parseMatrix("1 0") as Vector2;
    expect(result).not.toBeUndefined();
    expect(result.x).toBe(1);
    expect(result.y).toBe(0);
    result = parseMatrix("1;0") as Vector2;
    expect(result).not.toBeUndefined();
    expect(result.x).toBe(1);
    expect(result.y).toBe(0);
  });

  it("3D vector", () => {
    let result = parseMatrix("1 0 0") as Vector3;
    expect(result).not.toBeUndefined();
    expect(result.x).toBe(1);
    expect(result.y).toBe(0);
    expect(result.z).toBe(0);
    result = parseMatrix("1;0;0") as Vector3;
    expect(result).not.toBeUndefined();
    expect(result.x).toBe(1);
    expect(result.y).toBe(0);
    expect(result.z).toBe(0);
  });

  it("4D vector", () => {
    let result = parseMatrix("1 0 0 1") as Vector4;
    expect(result).not.toBeUndefined();
    expect(result.x).toBe(1);
    expect(result.y).toBe(0);
    expect(result.z).toBe(0);
    expect(result.w).toBe(1);
    result = parseMatrix("1;0;0;1") as Vector4;
    expect(result).not.toBeUndefined();
    expect(result.x).toBe(1);
    expect(result.y).toBe(0);
    expect(result.z).toBe(0);
    expect(result.w).toBe(1);
  });

  it("2D matrix", () => {
    const result = parseMatrix("1 0; 0 1;") as Matrix2;
    expect(result).not.toBeUndefined();
    expect(result.elements[0]).toBe(1);
    expect(result.elements[3]).toBe(1);
  });

  it("3D matrix", () => {
    const result = parseMatrix("1 0 0; 0 1 0; 0 0 1;") as Matrix3;
    expect(result).not.toBeUndefined();
    expect(result.elements[0]).toBe(1);
    expect(result.elements[4]).toBe(1);
    expect(result.elements[8]).toBe(1);
  });

  it("4D matrix", () => {
    const result = parseMatrix(
      "1 0 0 0; 0 1 0 0 ; 0 0 1 0; 0 0 0 1;"
    ) as Matrix4;
    expect(result).not.toBeUndefined();
    expect(result.elements[0]).toBe(1);
    expect(result.elements[5]).toBe(1);
    expect(result.elements[10]).toBe(1);
    expect(result.elements[15]).toBe(1);
  });
});

describe("toLatex can convert to latex a...", () => {
  it("2D vector", () => {
    const v = new Vector2().fromArray([1, 2]);
    let latex = toLatex(v);
    expect(latex).toBe(`\\begin{bmatrix} 1 & 2 \\end{bmatrix}`);

    latex = toLatex(v, "transpose");
    expect(latex).toBe(`\\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix}`);
  });
  it("2D matrix", () => {
    const latex = toLatex(new Matrix2().fromArray([1, 2, 3, 4]));
    expect(latex).toBe(`\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}`);
  });
});

describe("toArray", () => {
  it("converts a matrix to a 2D array", () => {
    const m2 = new Matrix2();
    expect(toArray(m2)).toEqual([
      [1, 0],
      [0, 1],
    ]);
  });
  it("converts a vector to a 1D array", () => {
    const v2 = new Vector2(1, 0);
    expect(toArray(v2)).toEqual([1, 0]);
  });
});

it("getDimension gets a matrix dimension in the format 'mxn'", () => {
  const result = getDimension([
    [0, 1],
    [1, 0],
  ]);
  expect(result).toBe("2x2");
});
