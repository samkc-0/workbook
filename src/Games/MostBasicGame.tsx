import { ReactNode, useEffect, useRef, useState } from "react";
import { Texts } from "../Text";

export type GameState = "win" | "lose" | "play";
export type ExerciseProps = { chapter: string; onExit: () => void };

export function MostBasicGame({
  onExit,
}: { question: string } & Partial<ExerciseProps>) {
  const [gameState, setGameState] = useState<GameState>("play");
  const [question, setQuestion] = useState<string | null>(null);
  const [userInput, setUserInput] = useState<string>("");
  const DEFAULT_STARTING_LIVES = 3;
  const [livesRemaining, setLivesRemaining] = useState<number>(
    DEFAULT_STARTING_LIVES
  );
  const divRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const url = `${import.meta.env.VITE_API_URL}/basic/`;
    console.log(url);
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (progress < data.slice(0, 5).length) {
          setQuestion(data[progress].question);
        } else {
          setGameState("win");
        }
      })
      .then(() => {
        divRef.current?.focus();
      });
  }, [question, progress]);

  useEffect(() => {
    if (userInput === question) {
      setProgress(progress + 1);
      setUserInput("");
    } else if (livesRemaining === 0) {
      setGameState("lose");
    }
  }, [userInput, question, livesRemaining]);

  if (!question)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-gray-600">{Texts.LOADING}</div>
      </div>
    );

  if (gameState !== "play")
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center space-y-6">
        <p className="text-3xl font-bold text-gray-800">
          {gameState === "win" ? Texts.YOU_WON : Texts.YOU_LOST}
        </p>
        <button
          onClick={onExit}
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          {Texts.GO_BACK}
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center space-y-8">
      <button
        onClick={onExit}
        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
      >
        ← {Texts.GO_BACK}
      </button>
      <Lives remaining={livesRemaining} />
      <p className="text-xl text-gray-600 font-medium">
        {Texts.PRESS}:{" "}
        <span className="font-mono text-gray-800">{question}</span>
      </p>
      <div
        ref={divRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="text-green-600 text-2xl font-mono outline-none border-2 border-gray-200 p-4 w-72 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
      >
        {userInput + "_"}
      </div>
    </div>
  );

  function handleKeyDown({ key }: React.KeyboardEvent<HTMLDivElement>) {
    handleInput(key);
  }

  function handleInput(value: string) {
    if (question?.startsWith(userInput + value)) {
      setUserInput(userInput + value);
    } else {
      setLivesRemaining(livesRemaining - 1);
    }
  }
}

export function randomString(stringLength: number): string {
  return Array.from(new Array(stringLength))
    .map(() => getRandomAlnumChar())
    .join("");
}

export function getRandomAlnumChar(): string {
  return Math.random().toString(36).charAt(2);
}

export function Lives({ remaining }: { remaining: number }): ReactNode {
  return (
    <span className="flex space-x-2">
      {Array.from({ length: remaining }, (_, i) => (
        <span key={`life-${i}`} className="life heart"></span>
      ))}
    </span>
  );
}
