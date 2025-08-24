import express from "express";
import AuthController from "./authController.js";

const router = express.Router();

router.post("/signup", AuthController.userRegister)
router.post("/login", AuthController.userLogin)

export default router;