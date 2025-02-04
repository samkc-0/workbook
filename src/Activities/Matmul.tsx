import { useState, ReactNode, useEffect, useMemo } from "react";
import { PhonePad } from "../Components/PhonePad.tsx";
import {
  dotproduct,
  fullMatrix,
  Matrix,
  PartialMatrix,
  giveFeedbackMatrix,
  getExpression,
} from "../Classes/Matrix.tsx";
import { AnswerMatrix, MatrixView } from "../Components/MatrixView.tsx";
type ProblemSet = { currentProblem: number; problems: MatmulTask[] };

const matmulProblems: ProblemSet = {
  currentProblem: 0,
  problems: [
    {
      A: {
        data: [
          [1, 2],
          [3, 4],
        ],
        rows: 2,
        columns: 2,
      },
      B: {
        data: [
          [3, 2],
          [3, 8],
        ],
        rows: 2,
        columns: 2,
      },
    },
    {
      A: {
        data: [
          [1, 2],
          [3, 4],
        ],
        rows: 2,
        columns: 2,
      },
      B: {
        data: [[2], [8]],
        rows: 2,
        columns: 1,
      },
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
  ],
};

export type MatmulTask = { A: Matrix; B: Matrix };
export default function Matmul(): JSX.Element {
  const [problemSet, setProblemSet] = useState(matmulProblems);
  const { A, B } = problemSet.problems[problemSet.currentProblem];
  const ans = dotproduct(A, B);
  const [userInput, setUserInput] = useState<string>("");
  const [displayedSubmission, setDisplayedSubmission] = useState<PartialMatrix>(
    fullMatrix(ans.rows, ans.columns, 0)
  );
  const [currentCell, setCurrentCell] = useState<CellIndex>(
    getCurrentCell(ans, userInput)
  );
  const [levelsRemaining, setLevelsRemaining] = useState<boolean>(true);

  const startingLives = 3;
  const [livesLeft, setLivesLeft] = useState<number>(startingLives);
  const answerAsString: string = useMemo(() => ans.data.flat().join(""), [ans]);
  const defaultInfo = (
    <div>
      <Lives total={startingLives} left={livesLeft} />
      <span className={"A-text"}>A</span>⋅<span className="B-text">B</span>
      <br />
      <div className="expression">
        {getExpression(A, B, currentCell.i, currentCell.j)}
        {" = ?"}
      </div>
    </div>
  );

  useEffect(() => {
    setCurrentCell(() => getCurrentCell(ans, userInput));
  }, []);

  useEffect(() => {
    console.log(getRefAns());
    setDisplayedSubmission(() => giveFeedbackMatrix(ans, userInput));
    setCurrentCell(() => getCurrentCell(ans, userInput));
    if (isComplete()) {
      flashColor("green");
      getNext();
    }
    if (outOfLives()) {
      flashColor("red");
      reset();
    }
  }, [userInput]);

  return (
    <>
      {levelsRemaining ? (
        <main
          className="app"
          autoFocus
          tabIndex={0}
          onKeyDown={(event) => {
            console.log(event.key);
          }}
        >
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
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="trophy">🏆</span>
          <button
            onClick={() => {
              reset();
              console.log("resetting");
            }}
          >
            Restart?
          </button>
        </div>
      )}
    </>
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
    return userInput === getRefAns();
  }
  function getNext() {
    clearInputs();
    const problemId = problemSet.currentProblem;
    const problems = problemSet.problems;
    if (problemId + 1 >= problems.length) {
      setLevelsRemaining(false);
    } else {
      setProblemSet((problemSet) => {
        return {
          ...problemSet,
          currentProblem: (problemId + 1) % problemSet.problems.length,
        };
      });
    }
  }
  function clearInputs() {
    setUserInput("");
  }
  function reset() {
    setLevelsRemaining(true);
    clearInputs();
    setProblemSet((problemSet) => {
      return {
        ...problemSet,
        currentProblem: 0,
      };
    });
  }

  function getRefAns(): string {
    return String(ans.data.flat()).split(",").join("");
  }

  function flashColor(colorName: string) {
    console.log(colorName);
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
  info: string | ReactNode;
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
        className="answer"
      />
    </div>
  );
}

function Info({ children }: { children: ReactNode }) {
  return (
    <div className="info">
      <p className="title"></p>
      {children}
    </div>
  );
}

function Lives({ total, left }: { total: number; left: number }) {
  return (
    <div className="lives">
      {Array.from(new Array(total)).map((_, i) => {
        const isEmpty = i + 1 <= left ? "" : "is-empty";
        return (
          <span key={`life-${i + 1}`} className={`heart ${isEmpty}`}>
            ❤️
          </span>
        );
      })}
    </div>
  );
}

type CellIndex = { i: number | undefined; j: number | undefined };

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
