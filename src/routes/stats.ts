import { Hono } from "hono";
import {
  get
} from "../controllers/statsController";

const forms = new Hono();

forms.post("/get", ...get);

export default forms;