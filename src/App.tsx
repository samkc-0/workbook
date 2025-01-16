import { ReactNode } from "react";
import "./App.css";
import { Vector2, Vector3, Vector4, Matrix2, Matrix3, Matrix4 } from "three";

type MatmulProps = { A: string; B: string; product: string };
type DisplayMatrixProps = { children: string; className: string };
type Matrix = Matrix2 | Matrix3 | Matrix4;
type Vector = Vector2 | Vector3 | Vector4;

function App() {
  return (
    <>
      <Matmul
        A={"1 0 0; 0 1 0; 0 0 1;"}
        B={"2 2 2; 2 2 2; 2 2 2"}
        product={"2 2 2; 2 2 2; 2 2 2"}
      />
    </>
  );
}

function Matmul({ A, B, product }: MatmulProps): JSX.Element {
  return (
    <>
      <DisplayMatrix className="A">{A}</DisplayMatrix>
      <DisplayMatrix className="B">{B}</DisplayMatrix>
      <DisplayMatrix className="ans">{product}</DisplayMatrix>
    </>
  );
}

function DisplayMatrix({
  children,
  className,
}: DisplayMatrixProps): JSX.Element {
  return <div className={className}>{toLatex(parseMatrix(children))}</div>;
}

function isMatrixOrVector(m: any): "vector" | "matrix" | undefined {
  if (m.isVector2 || m.isVector3 || m.isVector4) return "vector";
  if (m.isMatrix2 || m.isMatrix3 || m.isMatrix4) return "matrix";
  return undefined;
}

export function parseMatrix(matrixString: string): Matrix | Vector | never {
  // only handles 2d, 3d, and 4d vectors and matrices for now.
  let rows: string[] | undefined = undefined;
  if (!matrixString.includes(";")) {
    // it might be a vector
    rows = matrixString.split(" ");
  }
  if (matrixString.endsWith(";")) {
    matrixString = matrixString.slice(0, -1);
  }
  if (rows == undefined) {
    rows = matrixString.split(";");
  }
  const array2d: number[][] = rows.map((row) => {
    const cells = row
      .trim()
      .split(" ")
      .map((cell) => cell.trim());
    return cells.map((cell: string) => Number(cell));
  });
  console.log(array2d);
  const dimension = getDimension(array2d);
  switch (dimension) {
    case "1x2":
    case "2x1":
      return new Vector2(...array2d.flat());
    case "1x3":
    case "3x1":
      return new Vector3(...array2d.flat());
    case "1x4":
    case "4x1":
      return new Vector4().fromArray(array2d.flat());
      break;
    case "2x2":
      return new Matrix2().fromArray(array2d.flat());
    case "3x3":
      return new Matrix3().fromArray(array2d.flat());
    case "4x4":
      return new Matrix4().fromArray(array2d.flat());
    default:
      break;
  }
  throw new Error(`Unimplemented matrix dimension: ${dimension}`);
}

export function getDimension(array2d: number[] | number[][]): string | never {
  let [m, n] = [0, 0];
  if (typeof array2d[0] === "number") {
    m = 1;
  } else {
    m = array2d.length;
  }
  if (m === 1) {
    n = array2d.length;
  } else if (typeof array2d[0] === "object") {
    n = array2d[0].length;
  } else {
    throw new Error(`Invalid array2d: ${array2d.toString()}`);
  }
  return `${m}x${n}`;
}

export function toArray(input: Vector | Matrix) {
  switch (isMatrixOrVector(input)) {
    case "vector":
      return input.toArray();
    case "matrix":
      const dim = Math.sqrt(input.elements.length);
      const out: number[][] = [];
      for (let i = 0; i < dim; i++) {
        out.push([]);
        for (let j = 0; j < dim; j++) {
          out[i].push(input.elements[i * dim + j]);
        }
      }
      return out;
    default:
      throw new Error(`Unsupported input ${input.toString()}`);
  }
}

export function toLatex(
  input: Matrix | Vector,
  transpose: false | "transpose" = false
): string | never {
  switch (isMatrixOrVector(input)) {
    case "vector":
      const vector = toArray(input);
      const sep = transpose ? " \\\\ " : " & ";
      let latexCells = vector.join(sep);
      return "\\begin{bmatrix} " + latexCells + " \\end{bmatrix}";
    case "matrix":
      const matrix = toArray(input);
      // Extract matrix elements
      let latexRows = matrix.map((row: number[]) => row.join(" & "));
      return "\\begin{bmatrix} " + latexRows.join(" \\\\ ") + " \\end{bmatrix}";
    default:
      throw new Error("The input must be a THREE.Matrix4 instance.");
  }
}

export default App;
