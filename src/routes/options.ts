import { Hono } from "hono";
import {
  create, edit
} from "../controllers/optionsController";

const forms = new Hono();

forms.post("/create", ...create);
forms.post("/edit", ...edit);
// forms.post("/getAll", ...getAll);
// forms.post("/getById", ...getById);

export default forms;