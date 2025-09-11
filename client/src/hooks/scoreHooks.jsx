import axios from "axios";


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const useSubmitScore = async(time, difficulty ) => {
  try {

    await API.post("/api/scores/highscore",{time, difficulty},{
      withCredentials: "include",
    }
    )

  } catch (err) {
    throw new Error(err?.response?.data?.error || "Failed to set High Score");
  }
};

export const getHighScore = async(difficulty) => {
  try {
    const response = await API.get("/api/scores/user-score",
      {
      withCredentials: "include",
      params: { difficulty}
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

    const response = await API.get("/api/scores/leaderboard",
      {
      withCredentials: "include",
      params: {difficulty}
    }
    );
    return response.data
  } catch(err){
    
    throw new Error(err?.response?.data?.error || "Failed to get Leaderboard")
  }
}