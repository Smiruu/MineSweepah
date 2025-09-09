import axios from "axios";


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const useSubmitScore = async(time, gameStatus, difficulty ) => {
  try {
    const token = localStorage.getItem("access_token")
    await API.post("/api/scores/highscore",
      {
        params: {time, gameStatus, difficulty},
        headers: {Authorization: `Bearer ${token}`}
      }
    )

  } catch (err) {
    throw new Error(err?.response?.data?.error || "Failed to set High Score");
  }
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
    if (err.response?.status === 404) {
      // return default high score of 0
      return { score: { high_score: 0 } };
    }
    throw new Error(err?.response?.data?.error || "Failed to get High Score");
  }
}

export const getLeaderboard = async(difficulty) => {
  try{
    const token = localStorage.getItem("access_token");
    const response = await API.get("/api/scores/leaderboard",
      {
        params:{difficulty},
        headers: {Authorization: `Bearer ${token}`}
      }
    );
    console.log(response.data)
    return response.data
  } catch(err){
    
    throw new Error(err?.response?.data?.error || "Failed to get Leaderboard")
  }
}