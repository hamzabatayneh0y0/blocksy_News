import "next-auth";
import { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      emailVerified:Date|null
    } & DefaultSession["user"];
  }
}


declare module "next-auth" {
  interface User {
    id:string
    isAdmin: boolean;
     emailVerified:Date|null
  }
}

