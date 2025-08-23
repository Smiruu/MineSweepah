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

export function generateBoard(rows, cols, mines) {
  // initialize the board
  const board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      revealed: false,
      flagged: false,
      mine: false,
      adjacent: 0,
    }))
  );

  // randomly place mines
  let placedMines = 0;
  while (placedMines < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placedMines++;
    }
  }




  // calculate adjacent mine counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) continue; // skip if it's a mine
      let count = 0;
      for (let [dr, dc] of DIRECTIONS) {
        const nr = r + dr,
          nc = c + dc;
        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          board[nr][nc].mine
        ) {
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
