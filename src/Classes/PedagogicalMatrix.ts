type CellValue = number | string | undefined;
// type Result = { highlightedMatrix: PedagogicalMatrix, value: PedagogicalMatrix}
export class Cell {
  private value: CellValue;
  private highlighted: boolean;
  constructor(value: CellValue, highlighed: boolean = false) {
    this.value = value;
    this.highlighted = highlighed;
  }

  public get Value() {
    return this.value;
  }

  public get PrettyValue(): string {
    const value = this.value;
    if (typeof value == "number") {
      return String(value);
    } else {
      return "";
    }
  }

  public get Highlighted() {
    return this.highlighted;
  }
  public set Highlighted(state: boolean) {
    this.highlighted = state;
  }
}

export interface IMatrix<T> {
  data: T[][];
  flat: T[];
  rows: number;
  columns: number;
  Rows: number;
  Columns: number;
  GetCell: (i: number, j: number) => Cell;
  GetRow: (i: number) => IMatrix<T>;
  GetColumn: (j: number) => IMatrix<T>;
  GetNthCell: (n: number) => Cell;
  Dot: (other: IMatrix<T>) => IMatrix<T>;
  Cross: (other: IMatrix<T>) => IMatrix<T>;
  Det: () => number;
  Transpose: () => IMatrix<T>;
  stringify: () => string;
  Flat: T[];
  Without: (i: number, j: number) => IMatrix<T>;
}

export class PedagogicalMatrix {
  private data: Cell[][];
  private flat: Cell[];
  private readonly rows: number;
  private readonly columns: number;
  constructor(data: CellValue[][], rows: number, columns: number) {
    // ensure correct number of rows is specified
    if (!(data.length === rows))
      throw new Error(
        `Tried to create a matrix of ${rows} rows, using data with ${data.length} rows.`
      );
    // ensure correct number of columns is specified
    data.forEach((row, i) => {
      if (!(row.length === columns))
        throw new Error(
          `Tried to create a matrix of ${columns} columns, but row ${i} has ${row.length}columns.`
        );
    });
    this.rows = rows;
    this.columns = columns;
    this.data = [];
    for (let i = 0; i < this.rows; i++) {
      this.data.push([]);
      for (let j = 0; j < this.columns; j++) {
        this.data[i].push(new Cell(data[i][j], false));
      }
    }
    this.flat = this.data.flat();
  }
  static FromArray(
    array: CellValue[],
    rows: number,
    columns: number
  ): PedagogicalMatrix {
    if (rows * columns != array.length)
      throw new Error(
        `cells in ${array} are not equal to ${rows}x${columns}=${
          rows * columns
        }. Cannot make a ${rows}x${columns} matrix from this array.`
      );
    const data = Array.from(new Array(rows)).map(() =>
      Array.from(new Array(columns)).fill(undefined)
    );
    array.forEach((value, k) => {
      const i = Math.floor(k / rows);
      const j = k % columns;
      data[i][j] = value;
    });
    return new PedagogicalMatrix(data, rows, columns);
  }

  private get values(): CellValue[][] {
    return this.data.map((row: Cell[]) => {
      return row.map((cell: Cell) => {
        return cell.Value;
      });
    });
  }

  public get Data() {
    return this.data;
  }
  public get Rows() {
    return this.rows;
  }
  public get Columns() {
    return this.columns;
  }

  public GetCell(i: number, j: number): Cell {
    if (i >= this.rows || i < 0)
      throw new Error(
        `${this.rows}x${this.columns} Matrix has no row ${i} (indexing starts at 0)`
      );
    if (j >= this.columns || j < 0)
      throw new Error(
        `${this.rows}x${this.columns} Matrix has no column ${j} (indexing starts at 0)`
      );
    return this.data[i][j];
  }

  public GetNthCell(n: number): Cell {
    // get the nth cell from the flattened matrix
    // n = (cells per row) * i + j
    return this.flat[n];
  }

  public GetRow(i: number): PedagogicalMatrix {
    const data: CellValue[] = [];
    for (let j = 0; j < this.Columns; j++) {
      data.push(this.GetCell(i, j).Value);
    }
    const row = new PedagogicalMatrix([data], 1, data.length);
    for (let j = 0; j < row.Columns; j++) {
      row.data[0][j].Highlighted = this.data[i][j].Highlighted;
    }
    return row;
  }

  public GetColumn(j: number): PedagogicalMatrix {
    const data: CellValue[][] = [];
    for (let i = 0; i < this.Rows; i++) {
      data.push([this.GetCell(i, j).Value]);
    }
    const column = new PedagogicalMatrix(data, this.Columns, 1);
    for (let i = 0; i < column.Rows; i++) {
      column.data[i][0].Highlighted = this.data[i][j].Highlighted;
    }
    return column;
  }

  public Dot(other: PedagogicalMatrix): PedagogicalMatrix {
    const n = this.Columns;
    const n_ = other.Rows;
    if (n != n_) {
      throw new Error("dot prdocut only defined for (m, n).(n, p) -> (m, p)");
    }
    const data = Array.from({ length: this.Rows }, () =>
      Array(other.Columns).fill(0)
    );

    for (let i = 0; i < this.Rows; i++) {
      for (let j = 0; j < other.Columns; j++) {
        for (let k = 0; k < other.Rows; k++) {
          const x = this.GetCell(i, k).Value;
          const y = other.GetCell(k, j).Value;
          if (typeof x !== "number" || typeof y !== "number")
            throw new Error(
              `Cannot multiply 'this'[${i},${k}]=${x} by 'other'[${k},${k}]=${y}`
            );
          data[i][j] += x * y;
        }
      }
    }
    return new PedagogicalMatrix(data, this.Rows, other.Columns);
  }

  public Det(): number {
    if (this.Rows !== this.Columns)
      throw new Error(
        `Determinant is only defined for square (nxn) matrices. This is a ${this.Rows}x${this.Columns} matrix.`
      );
    if (this.Rows == 1) {
      const determinant = this.GetCell(0, 0).Value;
      if (typeof determinant !== "number")
        throw new Error(
          `The 1x1 matrix has a single cell with value ${determinant} which is not a number, so cannot be a determinant.`
        );
      return determinant;
    }
    if (this.Rows === 2) {
      const [a, b, c, d] = this.Flat.map((cell) => cell.Value);
      if (
        typeof a !== "number" ||
        typeof b !== "number" ||
        typeof c !== "number" ||
        typeof d !== "number"
      )
        throw new Error(
          `a * d - b * c = ${a} * ${d} - ${b} * ${c} and cannot be used to compute the determinant.`
        );
      return a * d - b * c;
    } else {
      let determinant = 0;
      for (let j = 0; j < this.Columns; j++) {
        const coefficient = this.GetCell(0, j).Value;
        if (typeof coefficient !== "number")
          throw new Error(
            `'this'[0,j]=${coefficient} and cannot be used to compute the determinant.`
          );
        determinant += Math.pow(-1, j) * coefficient * this.Without(0, j).Det();
      }
      return determinant;
    }
  }

  public Cross(other: PedagogicalMatrix): number {
    console.log(`getting cross product of ${this} and ${other}`);
    throw Error("Not implmented");
  }

  public Transpose(
    highlight: "values" | "positions" | "no" = "no"
  ): PedagogicalMatrix {
    const data: CellValue[][] = [];
    for (let j = 0; j < this.Columns; j++) {
      data.push([]);
      for (let i = 0; i < this.Rows; i++) {
        data[j].push(this.GetCell(i, j).Value);
      }
    }
    const t = new PedagogicalMatrix(data, this.Columns, this.Rows);
    if (highlight == "values") {
      for (let i = 0; i < this.Rows; i++) {
        for (let j = 0; j < this.Columns; j++) {
          t.data[j][i].Highlighted = this.data[i][j].Highlighted;
        }
      }
    } else if (highlight == "positions") {
      if (this.Rows !== this.Columns)
        throw new Error(
          "Cannot highlight the same cell positions for the transpose of a non-square matrix"
        );
      for (let i = 0; i < this.Rows; i++) {
        for (let j = 0; j < this.Columns; j++) {
          t.data[i][j].Highlighted = this.data[i][j].Highlighted;
        }
      }
    }
    return t;
  }

  private stringify(): string {
    const cells = this.data.flat();
    return cells.map((cell) => cell.PrettyValue).join("");
  }

  public ValidateInput(userInput: string) {
    return this.stringify() == userInput;
  }

  public get Flat(): Cell[] {
    return this.flat;
  }

  public Without(i: number, j: number): PedagogicalMatrix {
    const data: CellValue[][] = [];
    let skipped_i = 0;
    for (let i_ = 0; i_ < this.Rows; i_++) {
      if (i === i_) {
        skipped_i = 1;
        continue;
      }
      data.push([]);
      for (let j_ = 0; j_ < this.Columns; j_++) {
        if (j === j_) continue;
        data[i_ - skipped_i].push(this.GetCell(i_, j_).Value);
      }
    }
    return new PedagogicalMatrix(data, this.Rows - 1, this.Columns - 1);
  }

  public Copy(): PedagogicalMatrix {
    const copy = new PedagogicalMatrix(this.values, this.Rows, this.Columns);
    for (let i = 0; i < copy.Rows; i++) {
      for (let j = 0; j < copy.Columns; j++) {
        copy.data[i][j].Highlighted = this.data[i][j].Highlighted;
      }
    }
    return copy;
  }

  public HighlightCell(i: number, j: number): PedagogicalMatrix {
    this.GetCell(i, j); // ensure cell exists
    const copy = this.Copy();
    copy.data[i][j].Highlighted = true;
    return copy;
  }

  public HighlightRow(i: number): PedagogicalMatrix {
    this.GetCell(i, 0); // ensure row exists
    const copy = this.Copy();
    for (let j = 0; j < copy.Columns; j++) {
      copy.data[i][j].Highlighted = true;
    }
    return copy;
  }

  public HighlightColumn(j: number): PedagogicalMatrix {
    this.GetCell(0, j); // ensure row exists
    const copy = this.Copy();
    for (let i = 0; i < copy.Rows; i++) {
      copy.data[i][j].Highlighted = true;
    }
    return copy;
  }
}
