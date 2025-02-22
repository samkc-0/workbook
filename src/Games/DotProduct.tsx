import { useState, useEffect, useReducer } from "react";
import { MatrixDisplay } from "./MatrixDisplay";
import { VALID_INPUTS } from "./constants";

type InputValue = (typeof VALID_INPUTS)[number];
const url = "http://localhost:8000";

export type Matrix = {
  data: (number | string)[][];
  rows: number;
  columns: number;
  name: string;
};

export type Blank = {
  matrix: string;
  row: number;
  column: number;
  symbol: string;
  keys: string;
};

export type MatmulProblem = {
  left: Matrix;
  top: Matrix;
  product: Matrix;
  blanks: Blank[];
  answers: string[];
};

type BlankActionGetNext = { type: "get_next" };
type BlankActionPopulate = { type: "populate"; payload: Blank[] };
type BlanksAction = BlankActionGetNext | BlankActionPopulate;

export function DotProduct(): JSX.Element {
  const [problem, setProblem] = useState<MatmulProblem | undefined>(undefined);
  const [userInput, setUserInput] = useState<string>("");

  const [blanksIndex, setBlanksIndex] = useState<number>(0);

  function getCurrentBlank(): Blank {
    if (!problem) throw new Error(`No problem to get blanks from`);
    return problem.blanks[blanksIndex];
  }

  function handleSubmit(value: string): void {
    
  }
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
    if (VALID_INPUTS.includes(event.key as InputValue)) handleSubmit(event.key);
  }

  useEffect(() => {
    const doFetch = async () => {
      await fetch(`${import.meta.env.VITE_API_URL}/dotproduct/`)
        .then((response) => response.json())
        .then((payload) => {
          const storedProgress = JSON.parse(
            localStorage.getItem("userProgress") || "{}"
          );
          const questionNumber =
            storedProgress.dotProduct?.currentQuestion || 0;
          const blanks = payload[questionNumber].question.blanks;
          setProblem(
            blankify(payload[questionNumber].question, blanks) as MatmulProblem
          );
        });
    };
    doFetch();
  }, []);

  useEffect(() => {
    if (problem) setProblem((prev) => blankifyCurrent(prev as MatmulProblem));
  }, [blanksIndex]);

  if (!problem) return <Loading />;

  return (
    <div
      className="flex items-center justify-center w-screen h-screen bg-slate-200"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <main
        className={`
          aspect-[9/16]
          w-full
          max-w-[400px]
    
          rounded-none
          border-0
          lg:rounded-[40px]
          lg:border-[16px]
          lg:border-black
          shadow-2xl
          overflow-hidden
        `}
      >
        {/* Aquí metemos el grid que se expande a todo el contenedor */}
        <div className="grid grid-cols-2 grid-rows-[1fr_1fr_auto] w-full h-full">
          <div className="top-left-quadrant bg-red-300 flex justify-center items-center rounded-br-md border-r-2 border-b-2 border-t-2 border-gray-600 drop-shadow-md">
            <div className="bg-amber-100 text-balance align-middle text-center">
              Just information sits here.
            </div>
          </div>
          <div className="top-right-quadrant flex justify-center items-center">
            <MatrixDisplay matrix={problem.top} />
          </div>
          <div className="bottom-left-quadrant flex justify-center items-center">
            <MatrixDisplay matrix={problem.left} />
          </div>
          <div className="bottom-right-quadrant flex justify-center items-center">
            <MatrixDisplay matrix={problem.product} />
          </div>
          <div className="controls-area bg-gray-300 col-span-2">
            <Numpad onClick={handleSubmit} />
          </div>
        </div>
      </main>
    </div>
  );

  function blankifyCurrent(prev: MatmulProblem): MatmulProblem {
    return blankify(prev, prev.blanks.slice(blanksIndex));
  }
}

function Numpad({
  onClick,
}: {
  onClick: (value: string) => void;
}): JSX.Element {
  return (
    <div className="grid grid-cols-3 grid-rows-[1fr_1fr_1fr] w-full h-full md:justify-start">
      {VALID_INPUTS.map((value: string) => {
        return <Button key={value} value={value} />;
      })}
    </div>
  );

  function Button({ value }: { value: string }) {
    return (
      <button
        onClick={() => onClick(value)}
        value={value}
        className="bg-blue-500 hover:bg-blue-700 active:bg-blue-900
                   text-white font-bold border-blue-800 text-2xl border-2
                   transition-colors duration-100 ease-in-out
                   flex items-center justify-center"
      >
        {value}
      </button>
    );
  }
}

function Loading(): JSX.Element {
  return (
    <div className="text-gray-600 h-screen w-screen text-3xl flex items-center justify-center">
      Loading...<span className="animate-spin">↻</span>
    </div>
  );
}

export function blankify(p: MatmulProblem, blanks: Blank[]): MatmulProblem {
  const b = JSON.parse(JSON.stringify(p));
  for (const keys of blanks) {
    b[keys.matrix].data[keys.row][keys.column] = keys.symbol;
  }
  return b;
}
