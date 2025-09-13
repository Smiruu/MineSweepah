import React, { useState, useEffect } from "react";
import { getLeaderboard } from "../../hooks/scoreHooks";
import { formatTime } from "../../utils";

function Leaderboard({ difficulty, gameCycle, user, access, authReady}) {
  const [leaderboard, setLeaderboard] = useState([]);

  const currentUser = user;



  useEffect(() => {
    if(!access || !authReady) return;
    
    const fetchLeaderboard = async () => {
      setLeaderboard([])
      const access_token = access
      console.log("Fetching leaderboard for", difficulty);
      try {
        const data = await getLeaderboard(difficulty, access_token);
        setLeaderboard(data.leaderboard);
      } catch (err) {
        
        console.error(err.message);
      }
    };
    fetchLeaderboard();
  }, [difficulty, gameCycle, access, authReady]);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 border-2 border-yellow-500">
      <h2 className="text-lg font-bold text-yellow-600 mb-3">
        🏅 Leaderboard ({difficulty})
      </h2>

      {leaderboard.length === 0 ? (
        <p className="text-gray-500 italic">Loading top 10...</p>
      ) : (
        <ul className="space-y-2">
          {leaderboard.map((entry, index) => {
            const isCurrentUser = currentUser?.id === entry.user_id;
            return (
              <li
                key={entry.user_id}
                className={`flex justify-between items-center p-2 rounded-lg ${
                  isCurrentUser
                    ? "bg-gray-800/70 text-green-400 font-bold"
                    : "bg-gray-50 text-gray-800"
                }`}
              >
                <span>
                  #{index + 1} —{" "}
                  <span className="font-semibold">
                    {isCurrentUser ? "You" : entry.profiles?.username || "Anonymous"}
                  </span>
                </span>
                <span className="font-bold">{formatTime(entry.high_score)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Leaderboard;