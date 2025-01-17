import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Vector2, Vector3, Vector4, Matrix2, Matrix3, Matrix4 } from "three";

type MatmulProps = { A: string; B: string; product: string };
type DisplayMatrixProps = { children: string; className: string };
type ExplainProps = { prompt: string };
type Matrix = { data: string; rows: number; columns: number };

function App(): JSX.Element {
  const A = { data: "1 2 3; 4 5 6; 7 8 9", rows: 3, columns: 3 };
  const B = { data: "1 1 1; 2 2 2; 1 0 1", rows: 3, columns: 3 };
  const ans = stringifyMatrix(dotproduct(parseMatrix(A), parseMatrix(B)));
  return (
    <div className="matrix-grid">
      <LabelMatrix A={A} B={B} />
      <Matrix matrix={B} highlight="columns" className="B" />
      <Matrix matrix={A} highlight={"rows"} className="A" />
      <Matrix matrix={ans} highlight="cells" className="ans" />
    </div>
  );
}

type MatrixProps = {
  matrix: Matrix;
  highlight: "rows" | "columns" | "cells";
  className: string;
};
function Matrix({
  matrix,
  highlight,
  className = "",
}: MatrixProps): JSX.Element {
  const arrayVersion = useMemo(() => parseMatrix(matrix), [matrix]);
  return (
    <table className={`matrix ${className}`}>
      <tbody>{display(arrayVersion)}</tbody>
    </table>
  );
  function display(array2D: number[][]): JSX.Element[] {
    return array2D.map((row: number[], i: number) => (
      <tr key={`row-${i}`} className="row">
        {row.map((cell: number, j: number) => {
          let group = highlight;
          switch (highlight) {
            case "rows":
              group += `-${i}`;
              break;
            case "columns":
              group += `-${j}`;
              break;
            case "cells":
              group += `-${i},${j}`;
              break;
            default:
              throw new Error(`Invalid group: ${highlight}`);
          }
          return (
            <td
              key={`col-${j}`}
              className={`cell ${group}`}
              onMouseEnter={() => highlightGroup(group)}
              onMouseLeave={() => unhighlightGroup(group)}
            >
              {cell}
            </td>
          );
        })}
      </tr>
    ));
  }

  function highlightGroup(highlightClass: string) {
    [...document.getElementsByClassName(highlightClass)].forEach((element) =>
      element.classList.add("highlighted")
    );
  }
  function unhighlightGroup(highlightClass: string) {
    [...document.getElementsByClassName(highlightClass)].forEach((element) =>
      element.classList.remove("highlighted")
    );
  }
}

function LabelMatrix({
  A,
  B,
  labels = ["A", "B"],
}: {
  A: Matrix;
  B: Matrix;
  labels: string[];
}): JSX.Element {
  return (
    <table className="label-matrix matrix">
      <tbody>
        {Array.from(new Array(B.rows)).map((_, i) => {
          return (
            <tr key={`labels-matrix-row-${i}`}>
              {Array.from(new Array(A.columns)).map((_, j) => {
                let content: string = "";
                if (i === Math.floor(A.rows / 2) && j === B.columns - 1)
                  content = labels[1];
                if (i === A.columns - 1 && j === Math.floor(B.rows / 2))
                  content = labels[0];
                return (
                  <td className="cell" key={`labels-matrix-cell-${i}-${j}`}>
                    {content}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function parseMatrix({ data }: Matrix): number[][] {
  const rows = data.split(";").filter((row) => row.length !== 0);
  const cells = rows.map((row) =>
    row
      .trim()
      .split(" ")
      .filter((cell) => cell.length !== 0)
      .map(Number)
  );
  return cells;
}

export function dotproduct(A: number[][], B: number[][]) {
  const m = A[0].length;
  const n = B.length;
  if (m != n) {
    throw new Error(
      "A has ${n} rows but B has ${n} columns, cannot compute dot product."
    );
  }
  const result = Array.from({ length: A.length }, () =>
    Array(B[0].length).fill(0)
  );

  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < B[0].length; j++) {
      for (let k = 0; k < B.length; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return result;
}

export function stringifyMatrix(matrix: number[][]) {
  return {
    data: matrix
      .map((row) => {
        return row.join(" ");
      })
      .join(";"),
    rows: matrix.length,
    columns: matrix[0].length,
  };
}

// // this has to be implemented in the backend because otherwise it will use up all the allocation

// // function Explain({ prompt }: ExplainProps): JSX.Element {
// //   const [textContent, setTextContent] = useState("");
// //   useEffect(() => {
// //     const doFetch = async () => {
// //       const url =
// //         "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY";
// //       const headers = { "Content-Type": "application/json" };
// //       const method = "POST";
// //       const body =
// //         '{"contents": [{"parts":[{"text": "Write a story about a magic backpack."}]}]}';
// //       await fetch(url, { method, headers, body })
// //         .then((response) => {
// //           return response.text();
// //         })
// //         .then((text) => {
// //           setText(() => text);
// //         });
// //     };
// //   }, []);
// //   return <div className="explanation">{textContent}</div>;
// }

// function Matmul({ A, B, product }: MatmulProps): JSX.Element {
//   return (
//     <>
//       <DisplayMatrix className="A">{A}</DisplayMatrix>
//       <DisplayMatrix className="B">{B}</DisplayMatrix>
//       <DisplayMatrix className="ans">{product}</DisplayMatrix>
//     </>
//   );
// }

// function DisplayMatrix({
//   children,
//   className,
// }: DisplayMatrixProps): JSX.Element {
//   useEffect(() => {
//     if (typeof window?.MathJax !== "undefined") {
//       window.MathJax.typeset();
//     }
//   }, []);
//   return (
//     <div className={className}>\( {toLatex(parseMatrix(children))} \)</div>
//   );
// }

// // This has to be implemented differently.
// // There should be a pair of matrices.
// // One is highlighted rowwise, the other is highlighted columnwise.
// // They are highlighted at the same time. This also highlights the cell that should be filled.
// // to actually you need row-to-latex functions,
// // also column-to-latex functions (harder).. maybe don't use latex.

// function isMatrixOrVector(m: any): "vector" | "matrix" | undefined {
//   if (m.isVector2 || m.isVector3 || m.isVector4) return "vector";
//   if (m.isMatrix2 || m.isMatrix3 || m.isMatrix4) return "matrix";
//   return undefined;
// }

// export function parseMatrix(matrixString: string): Matrix | Vector | never {
//   // only handles 2d, 3d, and 4d vectors and matrices for now.
//   let rows: string[] | undefined = undefined;
//   if (!matrixString.includes(";")) {
//     // it might be a vector
//     rows = matrixString.split(" ");
//   }
//   if (matrixString.endsWith(";")) {
//     matrixString = matrixString.slice(0, -1);
//   }
//   if (rows == undefined) {
//     rows = matrixString.split(";");
//   }
//   const array2d: number[][] = rows.map((row) => {
//     const cells = row
//       .trim()
//       .split(" ")
//       .map((cell) => cell.trim());
//     return cells.map((cell: string) => Number(cell));
//   });
//   console.log(array2d);
//   const dimension = getDimension(array2d);
//   switch (dimension) {
//     case "1x2":
//     case "2x1":
//       return new Vector2(...array2d.flat());
//     case "1x3":
//     case "3x1":
//       return new Vector3(...array2d.flat());
//     case "1x4":
//     case "4x1":
//       return new Vector4().fromArray(array2d.flat());
//       break;
//     case "2x2":
//       return new Matrix2().fromArray(array2d.flat());
//     case "3x3":
//       return new Matrix3().fromArray(array2d.flat());
//     case "4x4":
//       return new Matrix4().fromArray(array2d.flat());
//     default:
//       break;
//   }
//   throw new Error(`Unimplemented matrix dimension: ${dimension}`);
// }

// export function getDimension(array2d: number[] | number[][]): string | never {
//   let [m, n] = [0, 0];
//   if (typeof array2d[0] === "number") {
//     m = 1;
//   } else {
//     m = array2d.length;
//   }
//   if (m === 1) {
//     n = array2d.length;
//   } else if (typeof array2d[0] === "object") {
//     n = array2d[0].length;
//   } else {
//     throw new Error(`Invalid array2d: ${array2d.toString()}`);
//   }
//   return `${m}x${n}`;
// }

// export function toArray(input: Vector | Matrix) {
//   switch (isMatrixOrVector(input)) {
//     case "vector":
//       return input.toArray();
//     case "matrix":
//       const dim = Math.sqrt(input.elements.length);
//       const out: number[][] = [];
//       for (let i = 0; i < dim; i++) {
//         out.push([]);
//         for (let j = 0; j < dim; j++) {
//           out[i].push(input.elements[i * dim + j]);
//         }
//       }
//       return out;
//     default:
//       throw new Error(`Unsupported input ${input.toString()}`);
//   }
// }

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

export default App;
