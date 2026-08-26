import crypto from "crypto";
import { redis } from "@/lib/redis";

export async function createForgotPasswordToken(

  email: string
) {
  const token = crypto.randomUUID();

 
  try {
      await redis.ping();
  
      const token = crypto.randomUUID();
  
      await redis.set(
        `forgotPassword:${token}`,
    JSON.stringify({
   
      email,
    }),
    
      {
        ex: 60 * 2
      }
    
      );
  
      return { email, token };
  
    } catch (err) {
      console.log("redisError:", err);
      throw new Error("Something went wrong");
    }
}



// import crypto from "crypto";
// import  ioredis  from "@/lib/ioredis";

// export async function createForgotPasswordToken(

//   email: string
// ) {
//   const token = crypto.randomUUID();

//   await ioredis.set(
//     `forgotPassword:${token}`,
//     JSON.stringify({
   
//       email,
//     }),
    
//       "EX",  60*2, 
    
//   );

  

//   return {email, token};
  
// }
