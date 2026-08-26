import "server-only";
import crypto from "crypto";
import {redis} from "@/lib/redis";

export async function createVerificationToken(email: string) {
  try {
    await redis.ping();

    const token = crypto.randomUUID();

    await redis.set(
      `verification:${token}`,
      JSON.stringify({
        email,
      }),
      {
        ex: 60 * 2,
      }
    );

    return { email, token };

  } catch (err) {
    console.log("redisError:", err);
    throw new Error("Something went wrong");
  }
}






// import crypto from "crypto";
// import ioredis from "@/lib/ioredis";

// export async function createVerificationToken(email: string) {
//   try {
//     await ioredis.ping();

//     const token = crypto.randomUUID();

//     await ioredis.set(
//       `verification:${token}`,
//       JSON.stringify({
//         email,
//       }),
//       "EX",
//       60 * 2
//     );

//     return { email, token };

//   } catch (err) {
//     console.log("redisError:", err);
//     throw new Error("Redis connection failed");
//   }
// }