import React, { useState } from "react";
import Board from "../components/Homescreen/Board";

const DIFFICULTY_OPTIONS = ["easy", "medium", "hard"];

function HomeScreen() {
  const [difficulty, setDifficulty] = useState("easy");
  const [boardKey, setBoardKey] = useState(0); // key to reset board
  const [gameStatus, setGameStatus] = useState("playing"); // will get updated from Board

  const handlePlayAgain = () => {
    setBoardKey(prev => prev + 1); // triggers a new board
    setGameStatus("playing");
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <Board
        key={boardKey} // force re-render for new board
        difficulty={difficulty}
        setGameStatus={setGameStatus} // pass a callback to get game status from Board
      />

      {gameStatus === "lost" || gameStatus === "won" ? (
        <button
          onClick={handlePlayAgain}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Play Again
        </button>
      ) : null}

      <div className="mt-4 flex gap-2">
        {DIFFICULTY_OPTIONS.map(level => (
          <button
            key={level}
            onClick={() => {
              setDifficulty(level);
              setBoardKey(prev => prev + 1); // reset board when difficulty changes
              setGameStatus("playing");
            }}
            className={`px-3 py-1 rounded ${
              difficulty === level
                ? "bg-blue-500 text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default HomeScreen;
