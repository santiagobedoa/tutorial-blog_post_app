// importing express and the necessary controller functions
import express from "express";
import { login, logout, register } from "../controller/auth.js";

// creating a new router instance
const router = express.Router();

// defining routes for register, login, and logout
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// exporting the router instance
export default router;
