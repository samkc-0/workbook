import type { Matrix, PartialMatrix } from "../Classes/Matrix";
type Highlighted = { mode: "row" | "column" | "cell"; i?: number; j?: number };
export type AnswerMatrixProps = {
  ans: Matrix;
  submitted: PartialMatrix;
  highlighted?: Highlighted;
  className: string;
};
export function AnswerMatrix({
  ans,
  submitted,
  highlighted = undefined,
  className = "answer",
}: AnswerMatrixProps): JSX.Element {
  return (
    <table className={`matrix ${className}`}>
      {display((submitted as Matrix).data)}
    </table>
  );
  function display(array2D: number[][]): JSX.Element {
    return (
      <tbody>
        {array2D.map((row: number[], i: number) => (
          <tr key={`row-${i}`} className="row">
            {row.map((cell: number, j: number) => {
              return (
                <td
                  // contentEditable={true}
                  key={`col-${j}`}
                  className={`cell nes-container ${
                    shouldHighlight(ans, highlighted, i, j) && "highlighted"
                  }`}
                >
                  <span
                    className={
                      ans.data[i][j] !== cell && cell ? "incorrect" : "correct"
                    }
                  >
                    {cell || (
                      <span style={{ color: "rgba(0,0,0,0)" }}>
                        {ans.data[i][j]}
                      </span>
                    )}
                  </span>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    );
  }
}

export type MatrixProps = {
  matrix: Matrix;
  highlighted?: Highlighted;
  className: string;
};
export function MatrixView({
  matrix,
  highlighted,
  className = "",
}: MatrixProps): JSX.Element {
  return (
    <table className={`matrix ${className}`}>{display(matrix.data)}</table>
  );
  function display(array2D: number[][]): JSX.Element {
    return (
      <tbody>
        {array2D.map((row: number[], i: number) => (
          <tr key={`row-${i}`} className="row">
            {row.map((cell: number, j: number) => {
              return (
                <td
                  key={`row-${i},col-${j}`}
                  className={`cell nes-container ${
                    shouldHighlight(matrix, highlighted, i, j)
                      ? "highlighted"
                      : ""
                  }`}
                >
                  {cell}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    );
  }
}

function shouldHighlight(
  matrix: Matrix | PartialMatrix,
  highlighted: Highlighted | undefined,
  i: number,
  j: number
) {
  if (matrix.rows < 1 || matrix.columns < 1) return false;
  if (!highlighted) return false;
  switch (highlighted.mode) {
    case "row":
      return highlighted.i === i;
    case "column":
      return highlighted.j === j;
    case "cell":
      return highlighted.i === i && highlighted.j === j;
    default:
      return false;
  }
}
