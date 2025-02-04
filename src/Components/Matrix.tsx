import { Cell, PedagogicalMatrix } from "../Classes/PedagogicalMatrix";

export function Matrix({ data }: { data: PedagogicalMatrix }) {
  return (
    <table>
      <tbody>
        {data.Data.map((row: Cell[], i: number) => {
          return (
            <tr key={i}>
              {row.map((cell: Cell, j: number) => {
                return (
                  <td className={cell.Highlighted ? "highlighted" : ""} key={j}>
                    {cell.Value}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
