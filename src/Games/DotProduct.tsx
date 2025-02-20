import "./DotProduct.css";

export function DotProduct(): JSX.Element {
  return (
    <main className={`main min-h-screen w-screen bg-amber-500`}>
      <div className="top-left-quadrant bg-red-300">
        <Information />
      </div>
      <div className="top-right-quadrant bg-violet-600">
        <TopMatrix />
      </div>
      <div className="bottom-left-quadrant bg-lime-600">
        <LeftMatrix />
      </div>
      <div className="bottom-right-quadrant bg-blue-300">
        <ProductMatrix />
      </div>
      <div className="controls-area bg-gray-300">
        <Numpad />
      </div>
    </main>
  );
}

function Information(): JSX.Element {
  return <>OK</>;
}

function TopMatrix(): JSX.Element {
  return <>OK</>;
}

function LeftMatrix(): JSX.Element {
  return <>OK</>;
}

function ProductMatrix(): JSX.Element {
  return <>OK</>;
}

function Numpad(): JSX.Element {
  return <>OK</>;
}
