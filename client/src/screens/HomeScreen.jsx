import React, { useState, useEffect} from "react";
import Board from "../components/Homescreen/Board";
import Navbar from "../components/Navbar";
import { getHighScore, getLeaderboard } from "../hooks/scoreHooks";


const DIFFICULTY_OPTIONS = ["easy", "medium", "hard"];

function HomeScreen() {
  const [difficulty, setDifficulty] = useState("easy");
  const [boardKey, setBoardKey] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing");
  const [highScore, setHighScore] = useState(0);
  const [leaderboard, setLeaderboard]= useState([]);

  const handlePlayAgain = () => {
    setBoardKey(prev => prev + 1);
    setGameStatus("playing");
  };

  useEffect( ()=> {
    const fetchHighScore= async() => {
      try {
            const data  = await getHighScore(difficulty);
            console.log("User high score:", data.score.high_score);
            // optionally set it in state
            setHighScore(data.score.high_score);
          } catch (err) {
            console.error(err.message);
          }
  }
    

    const fetchLeaderboard = async() => {
      try {
          const leaderboard= await getLeaderboard(difficulty);
          setLeaderboard(leaderboard.leaderboard);
      } catch (err) {
        console.error(err.message)
      }
    }
    fetchHighScore();
    fetchLeaderboard();
  },[difficulty]) 

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Navbar */}
      <Navbar />
      <h1>HighScore: {highScore}</h1>

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
      <div className="mt-4">
  <h2 className="text-lg font-bold">Leaderboard</h2>
  <ul>
    {leaderboard.map((entry, index) => (
      <li key={entry.user_id}>
        #{index + 1} — {entry.profiles.username} — {entry.high_score} 
        <span className="text-gray-500 text-sm">
          ({new Date(entry.updated_at).toLocaleString()})
        </span>
      </li>
    ))}
  </ul>
</div>
    </div>
  );
}

export default HomeScreen;
