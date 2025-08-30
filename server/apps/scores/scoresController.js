import { supabase } from "../../database/supabase.js";

class ScoresController {
  // Insert or update only if it's a better score
  static upsertScore = async (req, res) => {
    try {

    const { time, difficulty } = req.body;
    const user_id = req.user.id; 


      if (!user_id || !time || !difficulty) {
        return res
          .status(400)
          .json({ error: "user_id, time, and difficulty are required" });
      }

      // Check if user already has a score for this difficulty
      const { data: existingScore, error: fetchError } = await supabase
        .from("scores")
        .select("high_score")
        .eq("user_id", user_id)
        .eq("difficulty", difficulty)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      // If no score yet OR new time is better -> update/insert
      if (!existingScore || time < existingScore.high_score) {
        const { data, error } = await supabase
          .from("scores")
          .upsert(
            {
              user_id,
              difficulty,
              high_score: time,
              updated_at: new Date(),
            },
            { onConflict: ["user_id", "difficulty"] } // must match unique constraint
          )
          .select()
          .single();

        if (error) throw error;

        return res.status(200).json({ success: true, score: data });
      }

      // If worse, do nothing — keep old score
      return res.status(200).json({
        success: true,
        message: "Existing score is better, not updated",
        score: existingScore,
      });
    } catch (err) {
      console.error("Error upserting score:", err.message);
      return res.status(500).json({ error: "Failed to update score" });
    }
  };

  // Get leaderboard (top 10 per difficulty)
  static getLeaderboard = async (req, res) => {
    try {
      const { difficulty } = req.query;
      const user_id =  req.user.id
      if (!difficulty) {
        return res.status(400).json({ error: "difficulty is required" });
      }

      const { data: leaderboard, error: leaderboardError } = await supabase
        .from("scores")
        .select("user_id, high_score, updated_at")
        .eq("difficulty", difficulty)
        .order("high_score", { ascending: false })
        .limit(10);

      if (leaderboardError) throw leaderboardError;

      let userEntry = null;

      if(user_id) {
        
        const inTop10 = leaderboard.find((entry) => entry.user_id === user_id);

        if(!inTop10){
          //fetch user's score
          const {data:userScore, error: userError} = await supabase
          .from("scores")//identify table
          .select("user_id", "high_score", "updated_at")//select columns
          .eq("difficulty", difficulty)// equal to difficulty
          .eq("user_id", user_id)//equal to user
          .single();//return only one row

          if(userError && userError.code !== "PGRST116") throw userError;

          if(userScore){
            //find user rank by counting higher score above theirs
            const {count, error: countError} = await supabase
            .from("scores")
            .select("*", {count: "exact", head:true})
            .eq("difficulty", difficulty)
            .gt("high_score", userScore.high_score);
            
            if(countError) throw countError;

            userEntry = {
              ...userScore,
              rank: count +1,
            }
          }
        }
      }

      return res.status(200).json({ leaderboard, user: userEntry });
    } catch (err) {
      console.error("Error fetching leaderboard:", err.message);
      return res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  };

  // Get user’s best score (per difficulty)
  static getUserHighScore = async (req, res) => {
    try {
      const { difficulty } = req.query;
      const user_id =  req.user.id;

      if (!user_id || !difficulty) {
        return res
          .status(400)
          .json({ error: "user_id and difficulty are required" });
      }

      const { data, error } = await supabase
        .from("scores")
        .select("user_id, high_score, updated_at")
        .eq("user_id", user_id)
        .eq("difficulty", difficulty)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      if (!data)
        return res
          .status(404)
          .json({ message: "No score found for this user and difficulty" });

      return res.status(200).json({ score: data });
    } catch (err) {
      console.error("Error fetching user high score:", err.message);
      return res
        .status(500)
        .json({ error: "Failed to fetch user high score" });
    }
  };
}

export default ScoresController;
