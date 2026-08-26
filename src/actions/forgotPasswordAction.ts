"use server"
import { createForgotPasswordToken } from "@/utils/generateForgotPasswordToken";
import { forgotPasswordSchema } from "@/utils/validationSchemas";
import { sendForgotPasswordEmail } from "@/utils/ٍsendForgotPasswordEmail";
import { AuthError } from "next-auth";
import prisma from "@/lib/db";



export const forgotPasswordAction=async(userEmail:string)=>{
    try{

          const validation = forgotPasswordSchema.safeParse({email:userEmail});
              if (!validation.success) {

               throw new Error (validation.error.errors[0].message) 
                
               
              }
              const user = await prisma.user.findUnique({where:{email:userEmail},select:{email:true}})
              if(!user){
                throw new Error("Invalid Email")
              }
             const{email,token}= await createForgotPasswordToken(userEmail)
              await sendForgotPasswordEmail(email,token)
              return {message:
                "We've sent a verification email. Please verify your account within 2 minutes."}
           
            
    }
    catch(err:any){
         console.log("ForgotPasswordAction-CatchError:",err)
        if(err instanceof AuthError)
        throw new Error(err.cause?.err?.message ?? "something went wrong");

        throw new Error(  err.message|| "something went wrong")
    }

}