import { useEffect, useRef, useState } from 'react'
import { VALID_INPUTS } from './constants'
import { MatrixDisplay } from './MatrixDisplay'

type InputValue = (typeof VALID_INPUTS)[number]

export function DotProductMain(): JSX.Element {
  const [problemSet, setProblemSet] = useState<MatmulProblem[] | undefined>(
    undefined
  )
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/dotproduct`)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        setProblemSet(data as MatmulProblem[])
        setLoading(false)
      })
      .catch((error) => {
        throw new Error(
          `Failed to fetch DotProduct problem set. The error was ${error}.`
        )
      })
  }, [])
  if (loading) return <Loading />
  else if (problemSet) return <DotProduct problem={problemSet[0]} />
  else throw new Error("Failed to load 'DotProduct'")
}

interface DotProductProps {
  problem: MatmulProblem
}
export function DotProduct({ problem }: DotProductProps): JSX.Element {
  console.log(JSON.stringify(problem))
  const [question, setQuestion] = useState<MatmulQuestion>(problem.question)
  const answer = problem.answer
  const [answerIndex, setAnswerIndex] = useState<number>(0)
  const [lives, setLives] = useState<number>(3)
  const main = useRef<HTMLElement | null>(null)

  const handleSubmit = (value: InputValue) => {
    if (!answer.length) return
    if (value != answer[answerIndex].key) {
      console.log(
        `User was supposed to press ${answer[answerIndex].key} but pressed ${value}`
      )
      console.log(`Deducting 1 life.`)
      setLives(lives - 1)
    } else handleCorrectAnswer()
  }
  const handleKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
    const key = event.key as InputValue
    if (VALID_INPUTS.includes(key)) handleSubmit(key)
  }

  useEffect(() => {
    if (main.current) main.current.focus()
  }, [])

  if (lives < 1) return <GameOver />
  return (
    <main
      className={`main min-h-screen w-screen bg-amber-500`}
      tabIndex={0}
      onKeyDown={handleKeyPress}
      ref={main}
    >
      <div className="top-left-quadrant bg-red-300">
        <Lives remaining={lives} />
      </div>
      <div className="top-right-quadrant bg-violet-600">
        <MatrixDisplay matrix={question.top} label="top" />
      </div>
      <div className="bottom-left-quadrant bg-lime-600">
        <MatrixDisplay matrix={question.left} label="left" />
      </div>
      <div className="bottom-right-quadrant bg-blue-300">
        <MatrixDisplay matrix={question.product} label="product" />
      </div>
      <div className="controls-area bg-gray-300">
        <Numpad handleClick={handleSubmit} />
      </div>
    </main>
  )

  function handleCorrectAnswer() {
    updateQuestion(answerIndex)
    setAnswerIndex(answerIndex + 1)
  }

  async function updateQuestion(answerIndex: number): Promise<void> {
    const { matrix, row, column, value } = answer[answerIndex]
    const updatedQuestion = { ...question }
    switch (matrix) {
      case 'top':
        updatedQuestion.top.data[row][column] = value
        break
      case 'left':
        updatedQuestion.left.data[row][column] = value
        break
      case 'product':
        updatedQuestion.product.data[row][column] = value
        break
      default:
        throw new Error(
          `Matrix ${matrix} doesn't exist, should be 'top', 'left', or 'product'`
        )
    }
    await setQuestion(updatedQuestion)
    console.log('updated the cell', question[matrix].data[row][column])
  }
}

interface NumpadProps {
  handleClick: (value: InputValue) => void
}
function Numpad({ handleClick }: NumpadProps): JSX.Element {
  return (
    <div data-testid="numpad">
      {VALID_INPUTS.map((value: InputValue) => {
        return (
          <button key={value} onClick={() => handleClick(value)}>
            {value}
          </button>
        )
      })}
    </div>
  )
}

interface LivesProps {
  remaining: number
}
function Lives({ remaining }: LivesProps) {
  if (remaining < 0)
    throw new Error(
      `Lives remaining should never be negative, but its value is ${remaining}`
    )
  return (
    <div id="lives">
      {Array.from({ length: remaining }, (_, i) => {
        return (
          <span key={i} data-testid="life">
            ❤️
          </span>
        )
      })}
    </div>
  )
}

function GameOver(): JSX.Element {
  return (
    <div id="game-over-message" data-testid="game-over-message">
      <h1>Game Over</h1>
    </div>
  )
}

function Loading(): JSX.Element {
  return (
    <h1>
      Loading <span className="animate-spin">o</span>
    </h1>
  )
}
