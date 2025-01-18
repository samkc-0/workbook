import { useMemo, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import "./App.css";

type Matrix = { data: string; rows: number; columns: number };

function App(): JSX.Element {
  // const A = { data: "1 2 3; 4 5 6; 7 8 9", rows: 3, columns: 3 };
  // const B = { data: "1 1 1; 2 2 2; 1 0 1", rows: 3, columns: 3 };
  const A = { data: "1 2; 3 4", rows: 2, columns: 2 };
  const B = { data: "1 2; 3 4", rows: 2, columns: 2 };
  const ans = stringifyMatrix(dotproduct(parseMatrix(A), parseMatrix(B)));
  const [submitted, setSubmitted] = useState<number[]>([]);
  const signatureCanvas = useRef(null);
  return (
    <div
      onKeyDown={(event) => {
        submitAnswer(parseInt(event.key));
      }}
    >
      <Frame
        A={A}
        B={B}
        ans={ans}
        submitted={parseSubmission(submitted, A.rows, B.columns)}
      />
      <SignatureCanvas
        ref={signatureCanvas}
        penColor="green"
        canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
        onEnd={() => submitAnswer(1)}
      />
    </div>
  );
  function submitAnswer(ans: number) {
    submitted.push(ans);
    console.log(ans);
  }

  function parseSubmission(
    submitted: number[],
    rows: number,
    columns: number
  ): Matrix {
    let data = "";
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        data += submitted.pop();
        data += " ";
      }
      data += ";";
    }
    return { data, rows, columns };
  }
}

function Frame({
  A,
  B,
  ans,
  submitted,
}: {
  A: Matrix;
  B: Matrix;
  ans: Matrix;
  submitted: Matrix;
}): JSX.Element {
  return (
    <>
      <div className="matrix-grid">
        {/* <LabelMatrix A={A} B={B} labels={["A", "B", "A.B"]} />
         */}
        <canvas width="auto" />
        <Matrix matrix={B} highlight="columns" className="B" />
        <Matrix matrix={A} highlight={"rows"} className="A" />
        <AnswerMatrix matrix={submitted} highlight="cells" className="ans" />
      </div>
    </>
  );
}

// function PhonePad({}): JSX.Element {
//   return (
//     <table className="phone-pad">
//       <tbody>
//         <tr>
//           <td>
//             <button value="1">1</button>
//           </td>
//           <td>
//             <button value="2">2</button>
//           </td>
//           <td>
//             <button value="3">3</button>
//           </td>
//         </tr>
//         <tr>
//           <td>
//             <button value="4">4</button>
//           </td>
//           <td>
//             <button value="5">5</button>
//           </td>
//           <td>
//             <button value="6">6</button>
//           </td>
//         </tr>
//         <tr>
//           <td>
//             <button value="7">7</button>
//           </td>
//           <td>
//             <button value="8">8</button>
//           </td>
//           <td>
//             <button value="9">9</button>
//           </td>
//         </tr>
//         <tr>
//           <td>
//             <button value="b" style={{ backgroundColor: "maroon" }}>
//               b
//             </button>
//           </td>
//           <td>
//             <button value="0">0</button>
//           </td>
//           <td>
//             <button value="n" style={{ backgroundColor: "darkgreen" }}>
//               n
//             </button>
//           </td>
//         </tr>
//       </tbody>
//     </table>
//   );
// }

function AnswerMatrix({
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
              // contentEditable={true}
              key={`col-${j}`}
              className={`cell ${group}`}
              onMouseEnter={
                highlight === "cells" ? () => highlightGroup(i, j) : () => {}
              }
              onMouseLeave={
                highlight === "cells" ? () => unhighlightGroup(i, j) : () => {}
              }
            ></td>
          );
        })}
      </tr>
    ));
  }

  function highlightGroup(i: number, j: number) {
    [...document.getElementsByClassName(`cells-${i},${j}`)].forEach((element) =>
      element.classList.add("highlighted")
    );
    [...document.getElementsByClassName(`rows-${i}`)].forEach((element) =>
      element.classList.add("highlighted")
    );
    [...document.getElementsByClassName(`columns-${j}`)].forEach((element) =>
      element.classList.add("highlighted")
    );
  }
  function unhighlightGroup(i: number, j: number) {
    [...document.getElementsByClassName(`cells-${i},${j}`)].forEach((element) =>
      element.classList.remove("highlighted")
    );
    [...document.getElementsByClassName(`rows-${i}`)].forEach((element) =>
      element.classList.remove("highlighted")
    );
    [...document.getElementsByClassName(`columns-${j}`)].forEach((element) =>
      element.classList.remove("highlighted")
    );
  }
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
            <td key={`col-${j}`} className={`cell ${group}`}>
              {cell}
            </td>
          );
        })}
      </tr>
    ));
  }
}

function LabelMatrix({
  A,
  B,
  labels = ["A", "B", "A.B"],
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
                if (i == A.columns - 1 && j == B.rows - 1) content = labels[2];
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
