declare global {
  type Position3D =
    | { x: number; y: number; z: number }
    | [number, number, number]

  type Matrix = {
    data: (number | string)[][]
    rows: number
    columns: number
    name: string
  }

  type Blank = {
    matrix: string
    row: number
    column: number
    key: string // when you press this key,
    value: number | string // the cell specified by `matrix`[`row`][`column`] should contain this value
  }

  type MatmulQuestion = {
    left: Matrix
    top: Matrix
    product: Matrix
  }

  type MatmulProblem = {
    id: number
    question: MatmulQuestion
    answer: Blank[]
  }
}

export {}
