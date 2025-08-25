import express from "express";
import ScoresController from "./scoresController.js";
import {authMiddleware} from "../../middleware/authMiddleware.js"

const router = express.Router();

// All routes require authentication
router.post("/highscore", authMiddleware, ScoresController.upsertScore);
router.get("/leaderboard", authMiddleware, ScoresController.getLeaderboard);
router.get("/user-score", authMiddleware, ScoresController.getUserHighScore);

export default router;
