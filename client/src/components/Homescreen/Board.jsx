import React, { useState, useEffect } from "react";
import { generateBoard, revealEmpty } from "../../utils";
import Cell from "./Cell";

const DIFFICULTY = {
  easy: { rows: 10, cols: 10, mines: 10, cellSize: 35 },
  medium: { rows: 15, cols: 15, mines: 30, cellSize: 20 },
  hard: { rows: 20, cols: 20, mines: 100, cellSize: 18 },
};

function Board({ difficulty = "easy", setGameStatus: setParentGameStatus }) {
  const { rows, cols, mines, cellSize } = DIFFICULTY[difficulty];
  const [board, setBoard] = useState(() => generateBoard(rows, cols, mines));
  const [gameStatus, setGameStatus] = useState("playing");
  const [flaggedCount, setFlaggedCount] = useState(0);

  useEffect(() => {
    if (setParentGameStatus) setParentGameStatus(gameStatus);
  }, [gameStatus]);

  const revealAllMines = (b) => {
    const newBoard = b.map(row =>
      row.map(cell => (cell.mine ? { ...cell, revealed: true, highlight: true } : cell))
    );
    setBoard(newBoard);
  };

  const checkWinCondition = (b) => {
    const allSafeRevealed = b.every(row =>
      row.every(cell => (cell.mine ? true : cell.revealed))
    );

    if (allSafeRevealed) {
      setGameStatus("won");
      console.log("🎉 You Win! All safe cells revealed.");
    }
  };

  const handleLeftClick = (rIdx, cIdx) => {
    if (gameStatus !== "playing") return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const cell = newBoard[rIdx][cIdx];

    if (cell.revealed || cell.flagged) return;

    if (cell.mine) {
      cell.revealed = true;
      setBoard(newBoard);
      setGameStatus("lost");
      revealAllMines(newBoard);
      console.log("💥 Game Over! You clicked a mine.");
      return;
    }

    if (cell.adjacent === 0) {
      revealEmpty(newBoard, rows, cols, rIdx, cIdx);
      console.log("Empty");
    } else {
      cell.revealed = true;
      console.log(cell.adjacent);
    }

    setBoard(newBoard);
    checkWinCondition(newBoard);
  };

  const handleRightClick = (rIdx, cIdx) => {
    if (gameStatus !== "playing") return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const cell = newBoard[rIdx][cIdx];

    if (cell.revealed) return;

    cell.flagged = !cell.flagged;
    setFlaggedCount(prev => prev + (cell.flagged ? 1 : -1));
    setBoard(newBoard);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-bold">Flags Remaining: {mines - flaggedCount}</h3>
      <h4 className="text-md font-semibold">
        Status:{" "}
        {gameStatus === "playing"
          ? "⏳ Playing"
          : gameStatus === "won"
          ? "🎉 You Win!"
          : "💥 Game Over"}
      </h4>

      <div
        className="grid  gap-1 bg-gray-700 rounded-sm p-2 w-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        }}
      >
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className="relative"
              style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
            >
              <div
                className={`absolute inset-0 flex items-center justify-center text-base bg-gray-200 text-black ${
                  cell.highlight ? "bg-red-400 text-white font-bold" : ""
                }`}
              >
                {cell.mine ? "💣" : cell.adjacent > 0 ? cell.adjacent : ""}
              </div>

              <Cell
                revealed={cell.revealed}
                flagged={cell.flagged}
                  rIdx={rIdx}
  cIdx={cIdx} 
                onLeftClick={() => handleLeftClick(rIdx, cIdx)}
                onRightClick={() => handleRightClick(rIdx, cIdx)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Board;
