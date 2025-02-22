import React, { useMemo, useReducer } from "react";
import { PedagogicalMatrix } from "../Classes/PedagogicalMatrix";

interface Matrix {
  data: (number | string)[][];
  rows: number;
  columns: number;
  name: string;
}

interface MatrixProps {
  matrix: Matrix;
}

export function MatrixDisplay({ matrix }: MatrixProps): JSX.Element {
  return (
    <div className="bg-red-300 p-0 shadow-2xl drop-shadow-md">
      <table className="w-full border-collapse">
        <tbody>
          {matrix.data.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => {
                const highlighted = cell === "" ? "bg-lime-300" : "";
                return (
                  <td
                    key={j}
                    className={` border-2 border-black p-3 text-center w-[3rem] ${
                      highlighted || "bg-white"
                    }`}
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MatrixDisplay;
