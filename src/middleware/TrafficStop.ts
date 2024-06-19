import { createClient } from "redis";
import { ApiError } from "../error/ApiError";
import { Context, Next } from "hono";
import { getConnInfo } from "hono/cloudflare-workers";

const redisClient = createClient({
  url: "redis://localhost:6379",
});
redisClient.connect();

const TrafficStop = async (c: Context, next: Next) => {
  const info = getConnInfo(c);
  const ip = info.remote.address ?? "127.0.0.1";
  const key = `rateLimit:${ip}`;

  const currentRequests = await redisClient.get(key);

  if (currentRequests !== null) {
    if (parseInt(currentRequests) >= Number(process.env.RATE_LIMIT_PER_MINUTE)) {
      throw ApiError.tooManyRequests();
    }
  }

  const ttl = await redisClient.ttl(key);

  if (ttl === -2) {
    await redisClient.setEx(key, 60, "1");
  } else {
    await redisClient.incr(key);
  }

  // console.log(
  //   `[${c.req.method}]\t${c.req.path}\t\tIP: ${ip}\t\tRate Limit: ${currentRequests}`
  // );

  const loadTTL = await redisClient.ttl("load");

  if (loadTTL === -2) {
    await redisClient.setEx("load", 60, "1");
  } else {
    await redisClient.incr("load");
  }

  return next();
};

export default TrafficStop;
