// directions to check neighbors
const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

// export function generateBoard(rows, cols, mines) {
//   const board = Array.from({ length: rows }, () =>
//     Array.from({ length: cols }, () => ({
//       revealed: false,
//       flagged: false,
//       mine: false,
//       adjacent: 0,
//     }))
//   );

//   // Fixed mine positions for testing (row, col)
//   const minePositions = [
//     [0, 0],
//     [1, 0],
//     [2, 0],
//     [3, 0],
//     [4, 0],
//     [5, 0],
//     [6, 0],
//     [7, 0],
//     [8, 0],
//     [9, 0],
//   ];

//   // Place mines at fixed positions
//   minePositions.slice(0, mines).forEach(([r, c]) => {
//     board[r][c].mine = true;
//   });

//   // calculate adjacent mine counts
//   const DIRECTIONS = [
//     [-1, -1], [-1, 0], [-1, 1],
//     [0, -1],          [0, 1],
//     [1, -1], [1, 0], [1, 1],
//   ];

//   for (let r = 0; r < rows; r++) {
//     for (let c = 0; c < cols; c++) {
//       if (board[r][c].mine) continue;
//       let count = 0;
//       for (let [dr, dc] of DIRECTIONS) {
//         const nr = r + dr, nc = c + dc;
//         if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) {
//           count++;
//         }
//       }
//       board[r][c].adjacent = count;
//     }
//   }

//   return board;
// }
export function generateEmptyBoard(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      revealed: false,
      flagged: false,
      mine: false,
      adjacent: 0,
    }))
  );
}

export function placeMines(board, rows, cols, mines, safeRow, safeCol) {
  let placedMines = 0;

  while (placedMines < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);

    // avoid placing mine on first clicked cell
    if (board[r][c].mine) continue;
    if (r === safeRow && c === safeCol) continue;

    board[r][c].mine = true;
    placedMines++;
  }

  // calculate adjacent counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) continue;

      let count = 0;
      for (let [dr, dc] of DIRECTIONS) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) {
          count++;
        }
      }
      board[r][c].adjacent = count;
    }
  }

  return board;
}

export function revealEmpty(board, rows, cols, row, col) {
  const queue = [[row, col]];

  while (queue.length > 0) {
    const [currentRow, currentCol] = queue.shift();
    const cell = board[currentRow][currentCol];

    if (cell.revealed) continue;
    cell.revealed = true;

    if (cell.adjacent === 0 && !cell.mine) {
      for (const [dRow, dCol] of DIRECTIONS) {
        const newRow = currentRow + dRow;
        const newCol = currentCol + dCol;

        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols &&
          !board[newRow][newCol].revealed &&
          !board[newRow][newCol].flagged
        ) {
          queue.push([newRow, newCol]);
        }
      }
    }
  }

  return board;
}

export function revealAllMines(board) {
  return board.map((row) =>
    row.map((cell) =>
      cell.mine ? { ...cell, revealed: true, highlight: true } : cell
    )
  );
}


export function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
