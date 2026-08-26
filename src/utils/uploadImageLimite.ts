import {   redis } from "@/lib/redis";

export async function uploudProfileImageLimite(

 id:string
) {
 
 const key = `profile-image-change:user:${id}`;
   

  

  return await redis.get(key);;
}




