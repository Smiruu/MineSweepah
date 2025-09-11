import express from "express";
import AuthController from "./authController.js";
import {authMiddleware} from "../../middleware/authMiddleware.js"

const router = express.Router();

router.post("/signup", AuthController.userRegister)
router.post("/login", AuthController.userLogin)
router.post("/logout", AuthController.userLogout)
router.get("/user", authMiddleware, AuthController.getUser)
export default router;