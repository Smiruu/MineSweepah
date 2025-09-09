import React, { useState, useEffect, use } from "react";
import Board from "../components/Homescreen/Board";
import Navbar from "../components/Navbar";
import { getHighScore, useSubmitScore } from "../hooks/scoreHooks";
import Leaderboard from "../components/Homescreen/Leaderboard";
import { useNavigate } from "react-router-dom";


const DIFFICULTY_OPTIONS = ["easy", "medium", "hard"];

function HomeScreen() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState("easy");
  const [boardKey, setBoardKey] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing");
  const [highScore, setHighScore] = useState(0);
  const [gameCycle, setGameCycle] = useState(0); // 🔑 trigger refresh
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  useEffect(() => {
  const saveScore = async () => {
    if (gameStatus === "won") {
      console.log("Auto-saving high score");
      setLoading(true);
      try {
        await useSubmitScore(time, gameStatus, difficulty);
        setGameCycle((prev) => prev + 1); // refresh leaderboard & highscore
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  saveScore();
}, [gameStatus]);
  const handlePlayAgain = async() => {    
    setBoardKey((prev) => prev + 1);
    setGameStatus("playing");
    setGameCycle((prev) => prev + 1); // trigger refresh for leaderboard & highscore
  };

  useEffect(() =>{
    const access_token = localStorage.getItem("access_token")
    if(!access_token){
      navigate("/")
    }
  })

  useEffect(() => {
    const fetchHighScore = async () => {
      try {
        const data = await getHighScore(difficulty);
        console.log("User high score:", data.score.high_score);
        setHighScore(data.score.high_score);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchHighScore();
  }, [difficulty, gameCycle]); // 🔑 refetch when difficulty or play again changes



  return (
    <div className="min-h-screen">
      {/* Navbar at top */}
      <Navbar />

      {/* Main two-column layout */}
      <div className="flex flex-row items-start gap-8 px-8 py-6">
        {/* Left column */}
        <div className="flex-1 flex flex-col items-center gap-6">
          {/* High Score Card */}
          <div className="w-full max-w-sm bg-gray-800/70 shadow-lg rounded-2xl p-4 text-center border-2 border-blue-500">
            <h1 className="text-xl font-bold text-green-400">🏆 High Score</h1>
            <p className="text-3xl font-extrabold text-green-400 mt-2">
              {highScore}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Difficulty:{" "}
              <span className="capitalize font-medium text-blue-500">
                {difficulty}
              </span>
            </p>
          </div>

          {/* Minesweeper Board */}
          <Board
            key={boardKey}
            difficulty={difficulty}
            setTime={setTime}
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
  disabled={loading} // 🔒 disable button while saving
  className={`mt-2 px-4 py-2 rounded w-full text-white ${
    loading
      ? "bg-gray-400 cursor-not-allowed" // 🔒 disabled style
      : "bg-green-500 hover:bg-green-600"
  }`}
>
  {loading ? "Saving score..." : "Play Again"}
</button>
              </div>
            </div>
          )}

          {/* Difficulty Selector */}
          <div className="mt-4 flex gap-2">
            {DIFFICULTY_OPTIONS.map((level) => (
              <button
                key={level}
                onClick={() => {
                  setDifficulty(level);
                  setBoardKey((prev) => prev + 1);
                  setGameStatus("playing");
                  setGameCycle((prev) => prev + 1); // 🔑 refresh leaderboard & highscore
                }}
                className={`px-3 py-1 rounded border-2 transition-colors ${
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

        {/* Right column (Leaderboard) */}
        <div className="w-80">
          <Leaderboard difficulty={difficulty} gameCycle={gameCycle} />
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
