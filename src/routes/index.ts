import { cors } from "hono/cors";
import { Hono } from "hono";
import { logger } from "hono/logger";

import auth from "./auth";
import forms from "./forms";
import questions from "./questions";
import options from "./options";
import answers from "./answers";
import stats from "./stats";

import TrafficStop from "../middleware/TrafficStop";
import AuthorizationMiddleware from "../middleware/AuthorizationMiddleware";

const Router = new Hono();

Router.use(cors());
Router.use(logger());
Router.use(TrafficStop);

Router.route("/auth", auth);

Router.use(AuthorizationMiddleware);

Router.route("/forms", forms);
Router.route("/questions", questions);
Router.route("/options", options);
Router.route("/answers", answers);
Router.route("/stats", stats);

export { Router }