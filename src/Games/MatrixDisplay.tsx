interface MatrixDisplayProps {
  matrix: Matrix
  label: string
}

export function MatrixDisplay({
  matrix,
  label = 'unlabelled',
}: MatrixDisplayProps): JSX.Element {
  return (
    <table data-testid={'matrix-display'}>
      <tbody>
        {matrix.data.map((row, i) => (
          <tr key={i} data-testid="matrix-row">
            {row.map((cell, j) => (
              <td
                className="border-2 border-black bg-white p-2 min-h-2 min-w-2"
                key={j}
                data-testid={`matrix-${label}-cell-${i}-${j}`}
              >
                {cell || '?'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
