import { useEffect, useRef } from "react";

const values: string[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "-",
  "0",
  ".",
];

export function PhonePad({
  onClick,
}: {
  onClick: (value: string) => void;
}): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current!.focus();
  });
  return (
    <div
      className="phone-pad"
      autoFocus
      ref={ref}
      tabIndex={0}
      onKeyDown={(event) => {
        console.log(event.key);
        if (
          Array.from(new Array(10))
            .map((_, i) => String(i))
            .includes(event.key)
        )
          onClick(event.key);
      }}
    >
      {values.map((value) => (
        <button
          className="nes-btn is-primary"
          key={`${value}-key`}
          onClick={() => onClick(value)}
        >
          {value}
        </button>
      ))}
    </div>
  );
}
