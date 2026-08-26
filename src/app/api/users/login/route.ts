// import { LoginUserDto } from "@/utils/dtos";
// import prisma from "@/lib/db";
// import { NextResponse, NextRequest } from "next/server";

// import { LogInRateLimit } from "@/utils/loginratelimite";
// import { signIn } from "@/auth";
// import { AuthError } from "next-auth";
// import { createVerificationToken } from "@/utils/generateVerifycationToken";
// import { sendVerificationEmail } from "@/utils/ٍsendVerifycationEmail";

// /**
//  *  @method  POST
//  *  @route   ~/api/users/login
//  *  @desc    Login User [(Log In) (Sign In) (تسجیل الدخول)]
//  *  @access  public
//  */
// export async function POST(request: NextRequest) {
//   try {
//     const body = (await request.json()) as LoginUserDto;
//     const allowed = await LogInRateLimit( body.email);

//     if (!allowed) {
//       return Response.json(
//         { message: "Too many requests, please try again later" },
//         { status: 429 },
//       );
//     }

//     try {
//       await signIn("credentials", { ...body, redirect: false });

//       return NextResponse.json(
//         { message: "Login successful", ok: true },
//         {
//           status: 200,
//         },
//       );
//     } catch (error: any) {
    
//       if (error instanceof AuthError) {
//          console.log("Error login signin:" ,error.cause?.err?.message)
//         if (error.cause?.err?.message === "EMAIL_NOT_VERIFIED") {
//           const { email, token } = await createVerificationToken(body.email);

//           console.log("login route token , email:", token, email);
//           const emailRes = await sendVerificationEmail(email, token);

//           return NextResponse.json(
//             {
//               message:
//                 "We've sent a verification email. Please verify your account within 2 minutes.",
//               ok: false,
//             },
//             {
//               status: 200,
//             },
//           );
//         }
//         return NextResponse.json(
//           { message: error.cause?.err?.message ?? "Login failed" },
//           { status: 400 },
//         );
//       }
//       throw new Error(error.message);
//     }
//   } catch (error: any) {
//          console.log("Error login catch:" ,error.message)

//     return NextResponse.json(
//       { message: "Something Went Wrong" },
//       { status: 500 },
//     );
//   }
// }
