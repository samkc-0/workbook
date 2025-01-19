import { useState, ReactNode, useEffect, useMemo } from "react";
import "./App.css";
import "nes.css/css/nes.min.css";
import { PhonePad } from "./PhonePad";
import {
  dotproduct,
  fullMatrix,
  Matrix,
  PartialMatrix,
  giveFeedbackMatrix,
  getExpression,
} from "./matrix";

type Highlighted = { mode: "row" | "column" | "cell"; i?: number; j?: number };

const levels = [
  {
    A: { data: [[1, 2]], rows: 1, columns: 2 },
    B: { data: [[3], [4]], rows: 2, columns: 1 },
  },
  {
    A: { data: [[1, 2, 3]], rows: 1, columns: 3 },
    B: { data: [[4], [5], [6]], rows: 3, columns: 1 },
  },
  {
    A: {
      data: [
        [1, 2],
        [3, 4],
      ],
      rows: 1,
      columns: 3,
    },
    B: { data: [[4], [5]], rows: 3, columns: 1 },
  },
  {
    A: {
      data: [
        [1, 2, 3],
        [3, 4, 5],
        [6, 7, 8],
      ],
      rows: 3,
      columns: 3,
    },
    B: {
      data: [
        [1, 2, 3],
        [3, 4, 5],
        [6, 7, 8],
      ],
      rows: 3,
      columns: 3,
    },
  },
];

export default function App(): JSX.Element {
  const { A, B } = levels[0];
  const ans = dotproduct(A, B);
  const [userInput, setUserInput] = useState<string>("");
  const [displayedSubmission, setDisplayedSubmission] = useState<PartialMatrix>(
    fullMatrix(ans.rows, ans.columns, 0)
  );
  const [currentCell, setCurrentCell] = useState<CellIndex>(
    getCurrentCell(ans, userInput)
  );

  const startingLives = 3;
  const [livesLeft, setLivesLeft] = useState<number>(startingLives);
  const answerAsString: string = useMemo(() => ans.data.flat().join(""), [ans]);
  const defaultInfo = "🟩⋅🟪";

  useEffect(() => {
    setCurrentCell(() => getCurrentCell(ans, userInput));
  }, []);

  useEffect(() => {
    setDisplayedSubmission(() => giveFeedbackMatrix(ans, userInput));
    setCurrentCell(() => getCurrentCell(ans, userInput));
    if (isComplete()) {
      getNext();
    }
    if (outOfLives()) {
      reset();
    }
  }, [userInput]);

  return (
    <main
      className="app"
      autoFocus
      tabIndex={0}
      onKeyDown={(event) => {
        console.log(event.key);
      }}
    >
      <Lives total={startingLives} left={livesLeft} />
      <Frame
        info={defaultInfo}
        A={A}
        B={B}
        ans={ans}
        submitted={displayedSubmission as Matrix}
        currentCell={currentCell}
      />
      <PhonePad onClick={submitAnswer} />
    </main>
  );

  function submitAnswer(value: string) {
    const testAns = userInput + value;
    console.log(testAns, answerAsString);
    if (answerAsString.startsWith(testAns)) {
      setUserInput(userInput + value);
    } else {
      setLivesLeft(livesLeft - 1);
    }
  }

  function outOfLives() {
    return livesLeft === 0;
  }
  function isComplete() {
    return userInput === String(ans.data.flat());
  }
  function getNext() {
    return;
  }
  function reset() {
    return;
  }

  function unpackLevel(id: number): Level {
    const { A, B } = levels[id];
    const ans = dotproduct(A, B);
    return { A, B, ans };
  }
}

function Frame({
  info,
  A,
  B,
  ans,
  submitted,
  currentCell,
}: {
  info: string;
  A: Matrix;
  B: Matrix;
  ans: Matrix;
  submitted: Matrix;
  currentCell: CellIndex;
}): JSX.Element {
  return (
    <div className="matrix-grid">
      <Info>{info}</Info>
      <MatrixView
        matrix={B}
        highlighted={{ mode: "column", j: currentCell.j }}
        className="B"
      />
      <MatrixView
        matrix={A}
        highlighted={{ mode: "row", i: currentCell.i }}
        className="A"
      />
      <AnswerMatrix
        ans={ans}
        submitted={submitted}
        highlighted={{ mode: "cell", i: currentCell.i, j: currentCell.j }}
        className="ans"
      />
    </div>
  );
}

function Info({ children }: { children: ReactNode }) {
  return <div className="info">{children}</div>;
}

type AnswerMatrixProps = {
  ans: Matrix;
  submitted: PartialMatrix;
  highlighted?: Highlighted;
  className: string;
};
function AnswerMatrix({
  ans,
  submitted,
  highlighted = undefined,
  className = "",
}: AnswerMatrixProps): JSX.Element {
  const matrix = (submitted as Matrix).data;
  return (
    <table className={`matrix ${className}`}>
      <tbody>{display(matrix)}</tbody>
    </table>
  );
  function display(array2D: number[][]): JSX.Element[] {
    return array2D.map((row: number[], i: number) => (
      <tr key={`row-${i}`} className="row">
        {row.map((cell: number, j: number) => {
          return (
            <td
              // contentEditable={true}
              key={`col-${j}`}
              className={`cell ${
                shouldHighlight(highlighted, i, j) && "highlighted"
              }`}
            >
              <span
                className={
                  ans.data[i][j] !== cell && cell ? "incorrect" : "correct"
                }
              >
                {cell}
              </span>
            </td>
          );
        })}
      </tr>
    ));
  }
}

type MatrixProps = {
  matrix: Matrix;
  highlighted?: Highlighted;
  className: string;
};
function MatrixView({
  matrix,
  highlighted,
  className = "",
}: MatrixProps): JSX.Element {
  return (
    <table className={`matrix ${className}`}>
      <tbody>{display(matrix.data)}</tbody>
    </table>
  );
  function display(array2D: number[][]): JSX.Element[] {
    return array2D.map((row: number[], i: number) => (
      <tr key={`row-${i}`} className={`row`}>
        {row.map((cell: number, j: number) => {
          return (
            <td
              key={`col-${j}`}
              className={`cell ${
                shouldHighlight(highlighted, i, j) ? "highlighted" : ""
              }`}
            >
              {cell}
            </td>
          );
        })}
      </tr>
    ));
  }
}

function Lives({ total, left }: { total: number; left: number }) {
  return (
    <div className="lives">
      {Array.from(new Array(total)).map((_, i) => {
        const isEmpty = i + 1 <= left ? "" : "is-empty";
        return (
          <i
            key={`life-${i + 1}`}
            className={`nes-icon is-large heart ${isEmpty}`}
          ></i>
        );
      })}
    </div>
  );
}

function shouldHighlight(
  highlighted: Highlighted | undefined,
  i: number,
  j: number
) {
  if (!highlighted) return;
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

type CellIndex = { i?: number; j?: number };
export function getCurrentCell(matrix: Matrix, userInput: string): CellIndex {
  let stringified = "";
  for (let i = 0; i < matrix.rows; i++) {
    if (userInput.length <= 0) break;
    for (let j = 0; j < matrix.columns; j++) {
      if (stringified == userInput) return { i, j };
      const initialStringified = stringified.slice(0, stringified.length);
      stringified += String(matrix.data[i][j]);
      if (
        userInput.length > initialStringified.length &&
        userInput.length < stringified.length
      )
        return { i, j };
    }
  }
  return { i: 0, j: 0 };
}
