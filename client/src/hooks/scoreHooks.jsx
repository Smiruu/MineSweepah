import axios from "axios";
import { useState, useEffect } from "react";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const useSubmitScore = (time, gameStatus, difficulty = "easy") => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (gameStatus !== "won" || submitted) return; // Only submit on win

    const submitScore = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("access_token");
        const res = await API.post(
          "/api/scores/highscore",
          { time, difficulty },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Score submitted:", res.data);
        setSubmitted(true);
      } catch (err) {
        console.error("Error submitting score:", err);
        setError(err.response?.data?.error || "Failed to submit score");
      } finally {
        setLoading(false);
      }
    };

    submitScore();
  }, [time, gameStatus, difficulty, submitted]);

  return { loading, error, submitted };
};

export const getHighScore = async(difficulty) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await API.get("/api/scores/user-score", 
      {
        params: {difficulty},
        headers: {Authorization: `Bearer ${token}`}
      }
    );
    return response.data
  } catch (err) {
    throw new Error(err?.response?.data?.error || "Failed to get High Score")
  }
}