import { ratelimitNormal } from "@/lib/redis";
import { User } from "next-auth";

export async function GlobalRateLimit(
  request: Request,
  user: User | undefined
) {
  
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const identifier = user
    ? `global:user:${user.id}`
    : `global:ip:${ip}`;

  const { success } = await ratelimitNormal.limit(identifier);

  return success;
}





// import ioredis from "../lib/ioredis"
// import { JWTPayload } from "./types";
// export async function GlobalRateLimit(request: Request, user: JWTPayload | null) {
//  const ip =
//   request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
//   request.headers.get("x-real-ip") ||
//   "unknown";



// const identifier = user
//   ? `rate:global:user:${user.id}`
//   : `rate:global:ip:${ip}`;


//  const requests = await ioredis.checkRateLimit(identifier, 60);

//    return Number(requests) <= 100;



// //   const requests = await ioredis.incr(key);

// //   if (requests === 1) {
// //     await ioredis.expire(key, 60);
// //   }

// //   return requests <= 100;
// }