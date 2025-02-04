import { describe, expect, test } from "vitest";
import { PedagogicalMatrix } from "./PedagogicalMatrix";

const matrix = new PedagogicalMatrix(
  [
    [1, 21, 3],
    [4, 5, 6],
    [7, 8, 9],
  ],
  3,
  3
);

const vec2d = new PedagogicalMatrix([[1, 2, 3]], 1, 3);
const vec2dTransposed = new PedagogicalMatrix([[1], [2], [3]], 3, 1);

describe("PedagogicalMatrix", () => {
  test("can get the Rows by public get", () => {
    expect(matrix.Rows).toBe(3);
  });
  test("can get the Columns by public get", () => {
    expect(matrix.Columns).toBe(3);
  });
  test("can get cells in row i, column j", () => {
    expect(matrix.GetCell(2, 2).Value).toBe(9);
  });
  test("can get cells in row i", () => {
    const row: PedagogicalMatrix = matrix.GetRow(2);
    expect(row.GetCell(0, 0).Value).toBe(matrix.GetCell(2, 0).Value);
    expect(row.GetCell(0, 1).Value).toBe(matrix.GetCell(2, 1).Value);
    expect(row.GetCell(0, 2).Value).toBe(matrix.GetCell(2, 2).Value);
  });

  test("can get cells in column j", () => {
    const column: PedagogicalMatrix = matrix.GetColumn(2);
    expect(column.GetCell(0, 0).Value).toBe(matrix.GetCell(0, 2).Value);
    expect(column.GetCell(1, 0).Value).toBe(matrix.GetCell(1, 2).Value);
    expect(column.GetCell(2, 0).Value).toBe(matrix.GetCell(2, 2).Value);
  });

  test("can get the nth cell reading left-right, top-bottom like a book", () => {
    expect(matrix.GetNthCell(0).Value).toBe(1);
    expect(matrix.GetNthCell(1).Value).toBe(21);
    expect(matrix.GetNthCell(2).Value).toBe(3);
    expect(matrix.GetNthCell(3).Value).toBe(4);
    expect(matrix.GetNthCell(4).Value).toBe(5);
    expect(matrix.GetNthCell(5).Value).toBe(6);
    expect(matrix.GetNthCell(6).Value).toBe(7);
    expect(matrix.GetNthCell(7).Value).toBe(8);
    expect(matrix.GetNthCell(8).Value).toBe(9);
  });

  test("can get the dot product with another matrix", () => {
    const first = new PedagogicalMatrix(
      [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      3,
      3
    );
    const other = new PedagogicalMatrix(
      [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
      3,
      3
    );
    const expected = new PedagogicalMatrix(
      [
        [6, 6, 6],
        [15, 15, 15],
        [24, 24, 24],
      ],
      3,
      3
    );
    expect(first.Dot(other).Flat).toEqual(expected.Flat);
    expect(vec2d.Dot(vec2dTransposed).Flat).toEqual(
      new PedagogicalMatrix([[14]], 1, 1).Flat
    );
  });

  test("can transpose the matrix", () => {
    const copy = vec2d.HighlightCell(0, 0);
    const copyT = vec2dTransposed.HighlightCell(0, 0);
    expect(copy.Transpose("values")).toEqual(copyT);
    expect(copy.Flat.map((cell) => cell.Highlighted)).toEqual(
      copyT.Flat.map((cell) => cell.Highlighted)
    );
  });

  test("Can get a matrix without row i, column j using PedagogocialMatrix.Withou(i, j)", () => {
    expect(matrix.Without(0, 0)).toEqual(
      new PedagogicalMatrix(
        [
          [5, 6],
          [8, 9],
        ],
        2,
        2
      )
    );
    expect(matrix.Without(1, 1)).toEqual(
      new PedagogicalMatrix(
        [
          [1, 3],
          [7, 9],
        ],
        2,
        2
      )
    );
    expect(matrix.Without(2, 2)).toEqual(
      new PedagogicalMatrix(
        [
          [1, 21],
          [4, 5],
        ],
        2,
        2
      )
    );
  });
  test("can get the determinant of a 2x2 matrix", () => {
    const matrix = new PedagogicalMatrix(
      [
        [1, 2],
        [3, 4],
      ],
      2,
      2
    );
    expect(matrix.Det()).toEqual(-2);
  });
  test("can get the determinant of a 3x3 matrix", () => {
    const matrix = new PedagogicalMatrix(
      [
        [1, 2, 3],
        [3, 2, 1],
        [2, 1, 3],
      ],
      3,
      3
    );
    expect(matrix.Det()).toEqual(-12);
  });
  test("can get the determinant of a 4x4 matrix", () => {
    const matrix = new PedagogicalMatrix(
      [
        [10, 11, 5, 6],
        [0, 7, 1, 99],
        [3, 8, 8, 0],
        [-3, 0, 5, 0],
      ],
      4,
      4
    );
    expect(matrix.Det()).toEqual(10503);
  });

  test("can highlight cell i,j", () => {
    expect(matrix.GetCell(2, 1).Highlighted).toBe(false);
    const highlighted = matrix.HighlightCell(2, 1);
    expect(matrix.GetCell(2, 1).Highlighted).toBe(false);
    expect(highlighted.GetCell(2, 1).Highlighted).toBe(true);
  });

  test("can make a new copy of the matrix that is a different matrix in memory", () => {
    const copy = matrix.Copy();
    expect(copy).toEqual(matrix);
    expect(copy).not.toBe(matrix);
  });

  test("can highlight a whole row", () => {
    expect(
      matrix.GetRow(1).Flat.every((cell) => cell.Highlighted === false)
    ).toBe(true);
    const highlighted = matrix.HighlightRow(1);
    expect(highlighted).not.toEqual(matrix);
    const rowToCheck = highlighted.GetRow(1).Flat;
    expect(
      matrix.GetRow(1).Flat.every((cell) => cell.Highlighted === false)
    ).toBe(true);
    expect(rowToCheck.every((cell) => cell.Highlighted === true)).toBe(true);
  });

  test("can highlight a whole column", () => {
    expect(
      matrix.GetColumn(1).Flat.every((cell) => cell.Highlighted === false)
    ).toBe(true);
    const highlighted = matrix.HighlightColumn(1);
    expect(highlighted).not.toEqual(matrix);
    const columnToCheck = highlighted.GetColumn(1).Flat;
    expect(
      matrix.GetColumn(1).Flat.every((cell) => cell.Highlighted === false)
    ).toBe(true);
    expect(columnToCheck.every((cell) => cell.Highlighted === true)).toBe(true);
  });
});
