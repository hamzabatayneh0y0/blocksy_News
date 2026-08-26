

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/db";
import authConfig from "./auth.config"
import cloudinary from "./lib/cloudinary";
import { EmailNotVerifiedError } from "./utils/types";


export const { handlers, signIn, signOut, auth } = NextAuth({
 callbacks: {
  async jwt({ token,session,trigger, user }) {

    if (user) {
      token.image=user.image as string|null
       token.emailVerified=user.emailVerified
      token.id = user.id as string;
      token.isAdmin = user.isAdmin as Boolean;
      
    }
     if (trigger === "update" && session) {
      token.name = session.name ?? token.name;
      token.image = session.image ?? token.image;
    }
    return token;
  },

  async session({ session, token }) {
    if(session.user && token.id)
      
    {  session.user.emailVerified=token.emailVerified as Date
      session.user.image=token.image as string|null
      session.user.id = token.id as string;
    session.user.isAdmin = token.isAdmin as boolean;
    session.user.name = token.name;
  
  }
      
    return session;
  },
async signIn({user ,account}){


    const userFomDb=await prisma.user.findUnique({where:{email:user.email||""}})

  
  if( !userFomDb?.emailVerified && account?.provider === "credentials" )

  {
      
   
       console.log("signIn Callback error", "EMAIL_NOT_VERIFIED")
     throw new EmailNotVerifiedError();
    
   
  }

 return true 
},
},
  adapter: PrismaAdapter(prisma),
  
  session: {
    strategy: "jwt",
  },

...authConfig,
 trustHost: true,
events:{
 async linkAccount({user ,account}){

 

  if(account.provider!=="credentials" &&user){
    user.emailVerified=new Date()
     await prisma.user.update({where:{id: parseInt(user.id)},
   data:{emailVerified:user.emailVerified}

   })

      if (!user.image) return;

    const imageUrl = await cloudinary.uploader.upload(user.image, {
        folder: "profile-images",
          public_id: `user-${user.id}`,
          overwrite: true,
          resource_type: "image",

    });
    user.image=imageUrl.secure_url

    await prisma.user.update({
      where: {
        email: user.email||undefined,
      },
      data: {
        image: imageUrl.secure_url,
        imagePublicId:imageUrl.public_id
      },
    });
  }
 }},





 pages:{
  signIn:"/login",
     error: "/login",
  }
});
