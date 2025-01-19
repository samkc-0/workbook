export function PhonePad({
  onClick,
}: {
  onClick: (value: string) => void;
}): JSX.Element {
  return (
    <div className="phone-pad">
      <button value="1" onClick={() => onClick("1")}>
        1
      </button>
      <button value="2" onClick={() => onClick("2")}>
        2
      </button>
      <button value="3" onClick={() => onClick("3")}>
        3
      </button>
      <button value="4" onClick={() => onClick("4")}>
        4
      </button>
      <button value="5" onClick={() => onClick("5")}>
        5
      </button>
      <button value="6" onClick={() => onClick("6")}>
        6
      </button>
      <button value="7" onClick={() => onClick("7")}>
        7
      </button>
      <button value="8" onClick={() => onClick("8")}>
        8
      </button>
      <button value="9" onClick={() => onClick("9")}>
        9
      </button>
      {/* <div value="back" onClick={() => onClick("back")}>
        ←
      </div> */}
      <button value="0" onClick={() => onClick("0")}>
        0
      </button>
      {/* <button value="next" onClick={() => onClick("next")}>
        →
      </button> */}
    </div>
  );
}
