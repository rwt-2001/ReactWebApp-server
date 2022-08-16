import express from "express";
import { googleSignIn, signIn, signUp } from "../controllers/user.js";
const userRoutes = express.Router();

userRoutes.post('/signin', signIn);
userRoutes.post('/signup', signUp)
userRoutes.post('/googlesignin', googleSignIn);
export default userRoutes;