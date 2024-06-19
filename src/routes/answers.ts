import { Hono } from "hono";
import {
  create, complete
} from "../controllers/answersController";

const forms = new Hono();

forms.post("/create", ...create);
forms.post("/complete", ...complete);

export default forms;