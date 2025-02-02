import { useState, ReactNode, useEffect, useMemo } from "react";
import "nes.css/css/nes.min.css";
import { PhonePad } from "./Components/PhonePad.tsx";
import {
  dotproduct,
  fullMatrix,
  Matrix,
  PartialMatrix,
  giveFeedbackMatrix,
  getExpression,
} from "./Classes/Matrix.tsx";
import { MatrixView, AnswerMatrix } from "./Components/MatrixView.tsx";
import { atom, useAtom } from "jotai";

const levels = [
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
  // {
  //   A: {
  //     data: [
  //       [1, 2, 3],
  //       [3, 4, 5],
  //       [6, 7, 8],
  //     ],
  //     rows: 3,
  //     columns: 3,
  //   },
  //   B: {
  //     data: [
  //       [1, 2, 3],
  //       [3, 4, 5],
  //       [6, 7, 8],
  //     ],
  //     rows: 3,
  //     columns: 3,
  //   },
  // },
];

const currentLevel = atom(0);

export default function App(): JSX.Element {
  const [levelId, setLevelId] = useAtom(currentLevel);
  const { A, B } = levels[levelId];
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
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <i className="nes-icon trophy is-large"></i>
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
    if (levelId + 1 >= levels.length) {
      setLevelsRemaining(false);
    } else {
      return setLevelId((levelId + 1) % levels.length);
    }
  }
  function clearInputs() {
    setUserInput("");
  }
  function reset() {
    setLevelsRemaining(true);
    clearInputs();
    setLevelId(0);
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
        className="ans"
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
          <i
            key={`life-${i + 1}`}
            className={`nes-icon is-large heart ${isEmpty}`}
          ></i>
        );
      })}
    </div>
  );
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
