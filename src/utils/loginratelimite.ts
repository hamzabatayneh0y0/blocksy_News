import {  ratelimitStrict } from "@/lib/redis";

export async function LogInRateLimit(

 email:string
) {
 
  const identifier =
    `login:user:${email}`
   

  const { success } = await ratelimitStrict.limit(identifier);

  return success;
}



// "server-only"
// import ioredis from "../lib/ioredis"
// export async function LogInRateLimit(email:string) {
  
//   const key = `rate:login:${email}`;

 

     
//  const requests = await ioredis.checkRateLimit(key, 60);
//   return requests <= 5;
// }

