import React, { useState, useEffect} from "react";
import Board from "../components/Homescreen/Board";
import Navbar from "../components/Navbar";
import { getHighScore } from "../hooks/scoreHooks";

const DIFFICULTY_OPTIONS = ["easy", "medium", "hard"];

function HomeScreen() {
  const [difficulty, setDifficulty] = useState("easy");
  const [boardKey, setBoardKey] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing");
  const [highScore, setHighScore] = useState(0);

  const handlePlayAgain = () => {
    setBoardKey(prev => prev + 1);
    setGameStatus("playing");
  };

  useEffect( ()=> {
    const fetchHighScore= async() => {
      try {
            const { score } = await getHighScore("easy");
            console.log("User high score:", score);
            // optionally set it in state
            setHighScore(score);
          } catch (err) {
            console.error(err.message);
          }
  }
    fetchHighScore();
  },[]) 

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Navbar */}
      <Navbar />

      {/* Minesweeper Board */}
      <Board
        key={boardKey}
        difficulty={difficulty}
        setGameStatus={setGameStatus}
      />

      {/* Modal for Win/Loss */}
      {gameStatus !== "playing" && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center">
            <h2
              className={`text-xl font-bold mb-4 ${
                gameStatus === "lost" ? "text-red-600" : "text-green-600"
              }`}
            >
              {gameStatus === "lost" ? "💥 Boom! You Lost" : "🎉 You Won!"}
            </h2>
            <button
              onClick={handlePlayAgain}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Difficulty Selector */}
      <div className="mt-4 flex gap-2">
        {DIFFICULTY_OPTIONS.map(level => (
          <button
            key={level}
            onClick={() => {
              setDifficulty(level);
              setBoardKey(prev => prev + 1);
              setGameStatus("playing");
            }}
            className={`px-3 py-1 rounded border-2 ${
              difficulty === level
                ? "bg-blue-500 text-white border-blue-600"
                : "bg-gray-200 hover:bg-gray-300 border-gray-400"
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
