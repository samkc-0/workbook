import { describe, test, expect, beforeAll, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MatrixDisplay } from './MatrixDisplay'

const matrix: Matrix = {
  data: [
    [1, 2, 3],
    [4, '', 6],
    [7, 8, 9],
  ],
  rows: 3,
  columns: 3,
  name: 'test',
}

describe('MatrixDisplay', () => {
  beforeEach(() => {
    render(<MatrixDisplay matrix={matrix} label={matrix.name} />)
  })
  test('exists.', () => {
    expect(screen.getByTestId('matrix-display')).toBeTruthy()
  })
  test('can be populated with the values of a number[][].', () => {
    const cells = screen.getAllByTestId('matrix-test-cell', { exact: false })
    expect(cells.length).toBeGreaterThan(0)
    expect(cells.length).toBe(matrix.rows * matrix.columns)
    cells.forEach((cell, i) => {
      if (i === 4) expect(cell.textContent).toBe('')
      else expect(cell.textContent).toBe((i + 1).toString())
    })
  })
})
