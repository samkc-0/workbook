import { ReactNode } from "react";

export type Matrix = { data: number[][]; rows: number; columns: number };
export type PartialMatrix = {
  data: (number | undefined)[][];
  rows: number;
  columns: number;
};

export function reshape<T extends Matrix | PartialMatrix>(
  arr: number[],
  rows: number,
  columns: number
): T {
  const copied: (number | undefined)[] = [...arr];
  while (copied.length < rows * columns) copied.push(undefined);
  const data = [];
  for (let i = 0; i < rows; i++) {
    data.push(copied.slice(i * columns, i * columns + columns));
  }
  return { data, rows, columns } as T;
}

export function dotproduct(A: Matrix, B: Matrix) {
  const n = A.columns;
  const n_ = B.rows;
  if (n != n_) {
    throw new Error("dot prdocut only defined for (m, n).(n, p) -> (m, p)");
  }
  const data = Array.from({ length: A.rows }, () => Array(B.columns).fill(0));

  for (let i = 0; i < A.rows; i++) {
    for (let j = 0; j < B.columns; j++) {
      for (let k = 0; k < B.rows; k++) {
        data[i][j] += A.data[i][k] * B.data[k][j];
      }
    }
  }
  return { data, rows: A.rows, columns: B.columns };
}

export function stringifyMatrix(matrix: Matrix): string {
  return matrix.data
    .map((row) => {
      return row.join(" ");
    })
    .join(";");
}

export function fullMatrix(
  rows: number,
  columns: number,
  value: any = null
): Matrix {
  const data = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      row.push(value);
    }
    data.push(row);
  }
  return { data, rows, columns };
}

export function giveFeedbackMatrix(matrix: Matrix, s: string): PartialMatrix {
  // show the part of the matrix that is so far correct.
  const output = fullMatrix(matrix.rows, matrix.columns, 0) as PartialMatrix;
  output.rows = matrix.rows;
  output.columns = matrix.columns;
  let k = 0;
  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.columns; j++) {
      if (k < s.length) {
        const value = matrix.data[i][j];
        const valueLength = String(value).length;
        output.data[i][j] = parseInt(s.slice(k, k + valueLength));
        k += valueLength;
      } else {
        output.data[i][j] = undefined;
      }
    }
  }
  return output;
}

export function getExpression(
  A: Matrix,
  B: Matrix,
  row: number,
  column: number
): ReactNode {
  let terms: ReactNode[] = [];
  for (let j = 0; j < A.columns; j++) {
    terms.push(
      <span key={`${j}th-term`}>
        <span className="A-text">{A.data[row][j]}</span>×
        <span className="B-text">{B.data[j][column]}</span>
        {j < A.columns - 1 && " + "}
      </span>
    );
  }
  return terms;
}
