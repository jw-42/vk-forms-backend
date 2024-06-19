import { config } from "dotenv";
import { Hono } from "hono";
import { Router } from "./routes";
import { serve } from "bun";
import { ApiError } from "./error/ApiError";
import ErrorHandlerMiddleware from "./middleware/ErrorHandlerMiddleware";

if (process.env.NODE_ENV === "production") {
  config({ path: ".env.production" });
} else {
  config({ path: ".env.development" });
}

const app = new Hono().basePath("/api");
const port = Number(process.env.PORT) ?? 3000;

app.route("/", Router);

app.notFound(() => {
  throw ApiError.notFound()
});

app.onError(ErrorHandlerMiddleware);

async function main() {
  try {
    serve({
      fetch: app.fetch,
      port,
    });
  } catch (e) {
    console.error(e);
  }
};

main()
  .then(() => console.log(`Server is running on port ${port}`))

export { app };
