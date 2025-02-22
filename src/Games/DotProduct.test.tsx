// import { describe, test, expect, vi, beforeAll, beforeEach } from "vitest";
// import { MatmulProblem, blankify } from "./DotProduct";
// import { render, waitFor, screen, fireEvent } from "@testing-library/react"
// import { DotProduct } from "./DotProduct";
// import userEvent from '@testing-library/user-event';

// const url = "http://localhost:8000/workbook/api/dotproduct/";

// describe("DotProduct", () => {
//   test("can fetch a problem", async () => {
//     const response = await fetch(url);
//     const data = await response.json();
//     const firstProblem = data[0].question;
//     expect(firstProblem).toHaveProperty("left");
//     expect(firstProblem).toHaveProperty("top");
//     expect(firstProblem).toHaveProperty("product");
//   });

//   test("can blank the matrices to the user has to fill them in", async () => {
//     const response = await fetch(url);
//     const data = await response.json();
//     const firstProblem = data[0].question;

//     const b = blankify(firstProblem, firstProblem.blanks);
//     const keys = firstProblem.blanks[0];
//     expect(keys.matrix).toBe("product");
//     expect(keys.row).toBe(0);
//     expect(keys.column).toBe(0);
//     const actual = b[keys.matrix as keyof MatmulProblem] as Matrix;
//     expect(actual.data).toEqual(b.product.data);
//     expect(actual.data[keys.row]).toEqual(b.product.data[0]);
//     expect(actual.data[keys.row][keys.column]).toEqual(b.product.data[0][0]);
//     expect(actual.data[keys.row][keys.column]).toEqual(keys.symbol);
//   });
// });

// describe("DotProductComponent", () => {
//   let testData = [
//     {
//       "id": 20,
//       "question": {
//           "left": {
//               "data": [
//                   [
//                       1,
//                       0,
//                       -1
//                   ]
//               ],
//               "rows": 1,
//               "columns": 3,
//               "name": "b"
//           },
//           "top": {
//               "data": [
//                   [
//                       8
//                   ],
//                   [
//                       4
//                   ],
//                   [
//                       5
//                   ]
//               ],
//               "rows": 3,
//               "columns": 1,
//               "name": "a"
//           },
//           "product": {
//               "data": [
//                   [
//                       3
//                   ]
//               ],
//               "rows": 1,
//               "columns": 1,
//               "name": "a·b"
//           },
//           "blanks": [
//               {
//                   "matrix": "left",
//                   "row": 0,
//                   "column": 2,
//                   "symbol": "",
//                   "keys": "-1"
//               }
//           ],
//           "answers": [
//               "-1"
//           ]
//       },
//       "answer": [
//           "-1"
//       ]
//   }]

//   beforeAll( async () => {
//     global.fetch = vi.fn(() =>
//       Promise.resolve({
//         json: () =>
//           Promise.resolve(testData),
//       })
//     );

//     render(<DotProduct />);

//     // Ensure loading screen appears first
//     // expect(screen.getByText(/loading/i)).toBeInTheDocument();
  

//     const {left, top, product} = blankify(testData[0].question, testData[0].question.blanks);
//     const expectedCellValues = [...left.data.flat(), ...top.data.flat(), ...product.data.flat()]
    
//     expect(expectedCellValues[0]).toBe(1);
//     expect(expectedCellValues[1]).toBe(0);
//     expect(expectedCellValues[2]).toBe("");
//     expect(expectedCellValues[3]).toBe(8);
//     expect(expectedCellValues[4]).toBe(4);
//     expect(expectedCellValues[5]).toBe(5);
//     expect(expectedCellValues[6]).toBe(3);

//       // Wait for the component to update
//     await waitFor(async () => {
//       const cellValues = await screen.getAllByRole("cell").map(x => x.textContent);
//       expectedCellValues.forEach(value => {
//         expect(cellValues).toContain(value.toString())
//       })
    
//     }, { timeout: 3000 });
//   });

//   beforeEach(async () => {
//     render(<DotProduct />);
//     await waitFor(async () => {
//       const cellValues = await screen.getAllByRole("cell").map(x => x.textContent);
//       expectedCellValues.forEach(value => {
//         expect(cellValues).toContain(value.toString())
//       })
    
//     }, { timeout: 3000 });
//     vi.restoreAllMocks();
//   });

//   test("fetch is mocked return specific matrix data", async () => {
//     const data = await fetch(url).then((response) => response.json());

//     expect(data).toEqual([
//       {
//         "id": 20,
//         "question": {
//             "left": {
//                 "data": [
//                     [
//                         1,
//                         0,
//                         -1
//                     ]
//                 ],
//                 "rows": 1,
//                 "columns": 3,
//                 "name": "b"
//             },
//             "top": {
//                 "data": [
//                     [
//                         8
//                     ],
//                     [
//                         4
//                     ],
//                     [
//                         5
//                     ]
//                 ],
//                 "rows": 3,
//                 "columns": 1,
//                 "name": "a"
//             },
//             "product": {
//                 "data": [
//                     [
//                         3
//                     ]
//                 ],
//                 "rows": 1,
//                 "columns": 1,
//                 "name": "a·b"
//             },
//             "blanks": [
//                 {
//                     "matrix": "left",
//                     "row": 0,
//                     "column": 2,
//                     "symbol": "",
//                     "keys": "-1"
//                 }
//             ],
//             "answers": [
//                 "-1"
//             ]
//         },
//         "answer": [
//             "-1"
//         ]
//     },
//     ]);
//   });

//   test("key press of correct value unblanks a cell", async () => {
//     let cellValues = await screen.getAllByRole("cell").map(x => x.textContent);
//     const initialValueCount = cellValues.reduce((count, value) => { return value === "1" ? count+1 : count }, 0);
//     await userEvent.keyboard("1")
//     cellValues = await screen.getAllByRole("cell").map(x => x.textContent);
//     const finalValueCount = cellValues.reduce((count, value) => { return value === "1" ? count+1 : count }, 0);
//     expect(finalValueCount).toBe(initialValueCount + 1);
//   });
// });
