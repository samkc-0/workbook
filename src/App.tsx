import { JSX } from 'react'
import { MostBasicGame } from './Games/MostBasicGame.tsx'
import { DotProduct, DotProductMain } from './Games/DotProduct'
import { BrowserRouter, Routes, Route } from 'react-router'

const chapters = [
  // "Most Basic Game",
  'Dot Product',
  'Matrix Multiplication',
  'Linear Layer',
  'Activation',
  'Artificial Neuron',
  'Batch',
  'Connection',
  'Hidden Layer',
  'Deep',
  'Wide',
  'Softmax',
  'Gradient',
]
export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<Menu />} />
        <Route path={'/basic'} element={<MostBasicGame question="abcd" />} />
        <Route path={'/dotproduct'} element={<DotProductMain />} />
      </Routes>
    </BrowserRouter>
  )
}

function Menu() {
  return <>You made it to the main menu</>
}
