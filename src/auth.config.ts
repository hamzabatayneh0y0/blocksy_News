import {  type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { loginSchema } from "./utils/validationSchemas";
import prisma from "@/lib/db";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { EmailNotVerifiedError, LoginError } from "./utils/types";


export default {
  providers: [
    Credentials({
    async authorize(credentials) {
    const validation = loginSchema.safeParse(credentials);

    if (!validation.success) {
      throw new LoginError();
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new LoginError();
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      throw new LoginError();
    }

    if (!user.emailVerified) {
      throw new EmailNotVerifiedError();
    }

    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      image: user.image,
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified,
    };
  },
}),
    

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
