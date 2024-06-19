import { Hono } from "hono";
import { checkVKLaunchParams } from "../controllers/authController";

const auth = new Hono();

auth.post("/checkVKLaunchParams", ...checkVKLaunchParams);

export default auth;