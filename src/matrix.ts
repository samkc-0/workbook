// export function toLatex(
//   input: Matrix | Vector,
//   transpose: false | "transpose" = false
// ): string | never {
//   switch (isMatrixOrVector(input)) {
//     case "vector":
//       const vector = toArray(input);
//       const sep = transpose ? " \\\\ " : " & ";
//       let latexCells = vector.join(sep);
//       return "\\begin{bmatrix} " + latexCells + " \\end{bmatrix}";
//     case "matrix":
//       const matrix = toArray(input);
//       // Extract matrix elements
//       let latexRows = matrix.map((row: number[]) => row.join(" & "));
//       return "\\begin{bmatrix} " + latexRows.join(" \\\\ ") + " \\end{bmatrix}";
//     default:
//       throw new Error("The input must be a THREE.Matrix4 instance.");
//   }
// }

export type Matrix = { data: number[][]; rows: number; columns: number };
export type PartialMatrix = {
  data: (number | undefined)[][];
  rows: number;
  columns: number;
};
// export interface IMatrix {
//   data: number[][];
//   rows: number;
//   columns: number;
// }

// class Matrix implements IMatrix {
//   public rows: number;
//   public columns: number;
//   public data: number[][];
//   constructor(
//     data: number[][],
//     rows: number | undefined = undefined,
//     columns: number | undefined = undefined
//   ) {
//     this.data = data;
//     this.rows = rows || this.data.length;
//     if (columns) {
//       this.columns = columns;
//     } else if (this.data[0]) {
//       this.columns = this.data[0].length;
//     } else {
//       this.columns = 0;
//     }
//   }
//   dot(other: IMatrix) {
//     const result = dotproduct(this.data, other.data);
//     return new Matrix(result, this.columns, this.rows);
//   }
//   fromArray(arr: number[], rows: number, columns: number) {
//     const out = [];
//     for (let i = 0; i < rows; i++) {
//       out.push(this.data.slice(i * columns, i * columns + columns));
//     }
//     return out;
//   }
// }

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

// export function parseMatrix({ data }: Matrix): number[][] {
//   const rows = data.split(";").filter((row: string) => row.length !== 0);
//   const cells = rows.map((row: string) =>
//     row
//       .trim()
//       .split(" ")
//       .filter((cell) => cell.length !== 0)
//       .map(Number)
//   );
//   return cells;
// }

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
): string {
  let terms = [];
  for (let j = 0; j < A.columns; j++) {
    terms.push(`${A.data[row][j]}*${B.data[j][column]}`);
  }
  return terms.join(" + ");
}
