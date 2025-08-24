import express from "express";
import AuthController from "./authController.js";

const router = express.Router();

router.post("/signup", AuthController.userRegister)
router.post("/login", AuthController.userLogin)
router.post("/logout", AuthController.userLogout)

export default router;