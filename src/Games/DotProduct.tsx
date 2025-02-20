import { useState, useEffect } from "react";

// import { useEffect } from "";
import "./DotProduct.css";

type Matrix = {
  data: number[][];
  rows: number;
  columns: number;
  name: string;
};

type Blank = {
  matrix: string;
  row: number;
  column: number;
  symbol: string;
  keys: string;
};

type MatmulProblem = {
  left: Matrix;
  top: Matrix;
  product: Matrix;
  blanks: Blank[];
  answers: string[];
};

export function DotProduct(): JSX.Element {
  const [problem, setProblem] = useState<MatmulProblem | null>(null);

  useEffect(() => {
    const doFetch = async () => {
      await fetch("http://localhost:8000/workbook/api/dotproduct/")
        .then((response) => {
          return response.json();
        })
        .then((problem) => {
          console.log(problem);
          setProblem(problem[0].question as MatmulProblem);
        });
    };
    doFetch();
  }, []);
  if (problem)
    return (
      <main
        className={`main min-h-screen w-screen bg-amber-500 max-w-[400px] mx-auto rounded-none border-0 lg:rounded-[40px] lg:border-[16px] lg:border-black shadow-2xl overflow-hidden`}
      >
        <div className="top-left-quadrant bg-red-300">
          <Information />
          <MatrixDisplay matrix={problem.top.data} />
        </div>
        <div className="top-right-quadrant bg-violet-600">
          <MatrixDisplay matrix={problem.top.data} />
          ok
        </div>
        <div className="bottom-left-quadrant bg-lime-600">
          <MatrixDisplay matrix={problem.top.data} />
        </div>
        <div className="bottom-right-quadrant bg-blue-300">
          <MatrixDisplay matrix={problem.top.data} />
        </div>
        <div className="controls-area bg-gray-300">
          <Numpad onClick={console.log} />
        </div>
      </main>
    );
  return <Loading />;
}

function Information(): JSX.Element {
  return <div>ok</div>;
}

function TopMatrix(): JSX.Element {
  return (
    <MatrixDisplay
      matrix={[
        [1, 2, 3],
        [3, 4, 5],
        [7, 8, 9],
      ]}
    />
  );
}

function LeftMatrix(): JSX.Element {
  return <>OK</>;
}

function ProductMatrix(): JSX.Element {
  return <>OK</>;
}

interface NumpadProps {
  onClick: (value: string) => void;
}

function Numpad({ onClick }: NumpadProps): JSX.Element {
  return (
    <div className="numpad min-h-full ">
      <Button value="1" />
      <Button value="2" />
      <Button value="3" />
      <Button value="4" />
      <Button value="5" />
      <Button value="6" />
      <Button value="7" />
      <Button value="8" />
      <Button value="9" />
      <Button value="-" />
      <Button value="0" />
      <Button value="." />
    </div>
  );

  function Button({ value }: { value: string }) {
    return (
      <button
        onClick={() => onClick(value)}
        value={value}
        className="bg-blue-500 hover:bg-blue-700 active:bg-blue-900 text-white font-bold border-blue-800 text-2xl border-2 transition-colors duration-100 ease-in-out"
      >
        {value}
      </button>
    );
  }
}
function MatrixDisplay({ matrix }: { matrix: number[][] }): JSX.Element {
  // Validate input
  if (!matrix || !Array.isArray(matrix) || matrix.length === 0) {
    return <div className="text-red-500">Invalid matrix input</div>;
  }

  // Get dimensions
  const cols: number = matrix[0].length;

  // Validate that all rows have the same length
  const isValidMatrix: boolean = matrix.every(
    (row) => Array.isArray(row) && row.length === cols
  );

  if (!isValidMatrix) {
    return (
      <div className="text-red-500">All rows must have the same length</div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <table className="bg-gray-100 rounded-lg overflow-hidden">
        <tbody>
          {matrix.map((row: number[], rowIndex: number) => (
            <tr key={rowIndex}>
              {row.map((number: number, colIndex: number) => (
                <td
                  key={`${rowIndex}-${colIndex}`}
                  className="
                    flex items-center justify-center
                    h-12 w-12
                    bg-white
                    border border-gray-300
                    text-lg font-mono
                    hover:bg-blue-50
                    transition-colors
                    overflow-hidden
                  "
                >
                  {number}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Loading(): JSX.Element {
  return (
    <div className="text-gray-600 h-screen w-screen text-3xl flex items-center justify-center">
      Loading...<span className="animate-spin">↻</span>
    </div>
  );
}
