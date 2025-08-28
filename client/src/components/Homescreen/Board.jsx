import React, { useState, useEffect } from "react";
import { generateBoard, revealEmpty, revealAllMines, formatTime } from "../../utils";
import Cell from "./Cell";

import {  useSubmitScore } from "../../hooks/scoreHooks";


const DIFFICULTY = {
  easy: { rows: 10, cols: 10, mines: 10, cellSize: 35 },
  medium: { rows: 15, cols: 15, mines: 30, cellSize: 28 },
  hard: { rows: 20, cols: 20, mines: 90, cellSize: 24 },
};

function Board({ difficulty = "easy", setGameStatus: setParentGameStatus }) {
  const { rows, cols, mines, cellSize } = DIFFICULTY[difficulty];
  const [board, setBoard] = useState(() => generateBoard(rows, cols, mines));
  const [gameStatus, setGameStatus] = useState("playing");
  const [flaggedCount, setFlaggedCount] = useState(0);
  const [time, setTime] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    if (setParentGameStatus) setParentGameStatus(gameStatus);
  }, [gameStatus]);

  useEffect(() => {
    let timer;
    if (timerStarted && gameStatus === "playing") {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timerStarted, gameStatus]);

  // Win condition: all mines flagged, all safe cells revealed
const checkWinCondition = (b) => {
  const allSafeRevealed = b.every((row) =>
    row.every((cell) => (cell.mine ? true : cell.revealed))
  );
  const allMinesFlagged = b.every((row) =>
    row.every((cell) => (cell.mine ? cell.flagged : true))
  );
  if (allSafeRevealed && allMinesFlagged) {
    setGameStatus("won");

  }
};


  const handleLeftClick = (rIdx, cIdx) => {
    if (gameStatus !== "playing") return;
    if (!timerStarted) setTimerStarted(true);

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    const cell = newBoard[rIdx][cIdx];

    if (cell.revealed || cell.flagged) return;

    if (cell.mine) {
      cell.revealed = true;
      setBoard(newBoard);
      setGameStatus("lost");
      setBoard(revealAllMines(newBoard));
      return;
    }

    if (cell.adjacent === 0) {
      revealEmpty(newBoard, rows, cols, rIdx, cIdx);
    } else {
      cell.revealed = true;
    }

    setBoard(newBoard);
    checkWinCondition(newBoard);
  };

  const handleRightClick = (rIdx, cIdx) => {
    if (gameStatus !== "playing") return;

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    const cell = newBoard[rIdx][cIdx];

    if (cell.revealed) return;

    cell.flagged = !cell.flagged;
    setFlaggedCount((prev) => prev + (cell.flagged ? 1 : -1));
    setBoard(newBoard);
    checkWinCondition(newBoard);
  };


  const { loading: scoreLoading, error: scoreError } = useSubmitScore(time, gameStatus, difficulty);
  

  // Optionally display score submission error
  if (scoreError) console.log("Score error:", scoreError);
  return (
    <div className="flex flex-col items-center gap-4 text-white">
      {/* Header Info */}
      <div className="flex gap-8 bg-gray-800/70 px-6 py-3 rounded-xl shadow-md">
        <h3 className="text-lg font-bold text-green-400">
          🚩 {mines - flaggedCount} Flags Left
        </h3>
        <h3 className="text-lg font-bold text-green-400">
          ⏱ {formatTime(time)}
        </h3>
        <h4
          className={`text-lg font-semibold ${
            gameStatus === "won"
              ? "text-green-400"
              : gameStatus === "lost"
              ? "text-red-400"
              : "text-yellow-400"
          }`}
        >
          {gameStatus === "playing"
            ? "⏳ Playing"
            : gameStatus === "won"
            ? "🎉 Victory!"
            : "💥 Game Over"}
        </h4>
      </div>

      {/* Game Board */}
      <div
        className="grid gap-1 bg-gray-900 rounded-lg p-3 shadow-xl border border-gray-700"
        style={{ gridTemplateColumns: `repeat(${cols}, ${cellSize}px)` }}
      >
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className="relative"
              style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
            >
              {cell.revealed && (
                <div
                  className={`absolute inset-0 flex items-center justify-center font-bold text-sm rounded-md
                    ${cell.mine ? "bg-red-600 text-white" : "bg-gray-800 text-green-400"}
                    ${cell.highlight ? "animate-pulse" : ""}`}
                >
                  {cell.mine ? "💣" : cell.adjacent > 0 ? cell.adjacent : ""}
                </div>
              )}

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
