import { describe, test, expect, beforeEach, vi } from 'vitest'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { DotProduct } from './DotProduct'
import { VALID_INPUTS } from './constants'

const testProblems: MatmulProblem[] = getTestProblems()

describe('DotProduct', () => {
  let dotProduct: any
  beforeEach(() => {
    dotProduct = render(<DotProduct problem={testProblems[0]} />)
  })
  test('renders 3 matrices (the factors and their product', () => {
    expect(dotProduct.getAllByTestId('matrix-display').length).toBe(3)
  })
  test('there is a numpad for digits 0 to 9, `decimal point` and `minus sign`', async () => {
    const buttons = dotProduct.getAllByRole('button')
    expect(buttons.length).toBe(12)
    for (let value of VALID_INPUTS) {
      expect(buttons.map((b: any) => b.textContent)).toContain(value)
    }
  })
  test('the user starts with 3 lives', () => {
    const lives = dotProduct.getAllByTestId('life')
    expect(lives.length).toBe(3)
  })
  test('only clicking the wrong button deducts a life`', async () => {
    const buttons = dotProduct.getAllByRole('button')
    await userEvent.click(buttons[0])
    expect(dotProduct.getAllByTestId('life').length).toBe(2)
    expect(buttons[10].textContent).toBe('0')
    await userEvent.click(buttons[10])
    expect(dotProduct.getAllByTestId('life').length).toBe(2)
  })
  test('user can input from the keyboard', async () => {
    await userEvent.keyboard('1')
    expect(dotProduct.getAllByTestId('life').length).toBe(2)
    await userEvent.keyboard('0')
    expect(dotProduct.getAllByTestId('life').length).toBe(2)
  })
  test('running out of lives shows game over', async () => {
    await userEvent.keyboard('123')
    expect(dotProduct.getByTestId('game-over-message')).toBeTruthy()
  })
  test('clicking the correct button updates the a matrix', async () => {
    const cell = dotProduct.getByTestId('matrix-top-cell-2-0')
    expect(cell.textContent).toBe('')
    await userEvent.keyboard('0')
    expect(cell.textContent).toBe('0')
  })
  test('submitting all the correct values shows "correct" or something like it', async () => {
    await userEvent.keyboard('123')
    expect(dotProduct.getByTestId('game-over-message')).toBeTruthy()
  })
})

function getTestProblems(): MatmulProblem[] {
  return [
    {
      id: 0,
      question: {
        left: {
          data: [[3, 1, -2]],
          rows: 1,
          columns: 3,
          name: 'b',
        },
        top: {
          data: [[1], [4], ['']],
          rows: 3,
          columns: 1,
          name: 'a',
        },
        product: {
          data: [[7]],
          rows: 1,
          columns: 1,
          name: 'a·b',
        },
      },
      answer: [
        {
          matrix: 'top',
          row: 2,
          column: 0,
          key: '0',
          value: 0,
        },
      ],
    },
    {
      id: 1,
      question: {
        left: {
          data: [[3, 1, 2]],
          rows: 1,
          columns: 3,
          name: 'b',
        },
        top: {
          data: [[1], [4], [10]],
          rows: 3,
          columns: 1,
          name: 'a',
        },
        product: {
          data: [[27]],
          rows: 1,
          columns: 1,
          name: 'a·b',
        },
      },
      answer: [
        {
          matrix: 'product',
          row: 0,
          column: 0,
          key: '2',
          value: '2_',
        },
        {
          matrix: 'product',
          row: 0,
          column: 0,
          key: '7',
          value: '27',
        },
      ],
    },
  ]
}
