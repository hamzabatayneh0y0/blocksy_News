// import "server-only";

// import Redis from "ioredis";
// interface RedisCommands {
//   checkRateLimit(
//     key: string,
//     seconds: number
//   ): Promise<number>;
// }

// const ioredis = new Redis(process.env.REDIS_URL!)as Redis & RedisCommands;;


// ioredis.defineCommand("checkRateLimit", {
//   numberOfKeys: 1,
//   lua: `
//     local current = redis.call("INCR", KEYS[1])

//     if current == 1 then
//       redis.call("EXPIRE", KEYS[1], ARGV[1])
//     end

//     return current
//   `,
// });

// export default ioredis;