import {  type NextAuthConfig } from "next-auth";

import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";



export default {
  trustHost:true,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking:true,

      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.login,
          email: profile.email,
          image: profile.avatar_url,
             isAdmin: false,
    emailVerified: new Date(),
        };
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking:true,

    
      
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture ,
             isAdmin: false,
    emailVerified: new Date(),
        };
      },
    }),
  ],
 
} satisfies NextAuthConfig;
