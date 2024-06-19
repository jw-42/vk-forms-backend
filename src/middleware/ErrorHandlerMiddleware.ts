import { Context } from "hono";
import {ApiError} from "../error/ApiError";

const ErrorHandlerMiddleware = async (err: any, c: Context) => {
    if (err instanceof ApiError) {
      return c.json({
          error_code: err.status,
          error_message: err.message
      }, err.status)
    } else {
      console.error(err)
      return c.json({
          error_code: 500,
          error_message: 'Internal Server Error'
      }, 500)
    }
}

export default ErrorHandlerMiddleware