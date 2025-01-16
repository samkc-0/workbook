import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

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

type MatmulProps = { A: string; B: string; product: string };
function Matmul({ A, B, product }: MatmulProps): JSX.Element {
  return (
    <>
      {A}.{B}={product}
    </>
  );
}

export default App;
