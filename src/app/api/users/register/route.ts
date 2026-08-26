// import { RegisterUserDto } from "@/utils/dtos";
// import { registerSchema } from "@/utils/validationSchemas";
// import { NextResponse, NextRequest } from "next/server";
// import prisma from "@/lib/db";
// import bcrypt from "bcryptjs";
// import { AuthError } from "next-auth";
// import { createVerificationToken } from "@/utils/generateVerifycationToken";
// import { sendVerificationEmail } from "@/utils/ٍsendVerifycationEmail";

// /**
//  *  @method  POST
//  *  @route   ~/api/users/register
//  *  @desc    Create New User [(Register) (Sign Up) (انشاء حساب)]
//  *  @access  public
//  */
// export async function POST(request: NextRequest) {
//   try {
//     const body = (await request.json()) as RegisterUserDto;
//     const validation = registerSchema.safeParse(body);
//     if (!validation.success) {
//       return NextResponse.json(
//         { message: validation.error.errors[0].message },
//         { status: 400 },
//       );
//     }

//     const user = await prisma.user.findUnique({ where: { email: body.email } });
//     if (user) {
//       return NextResponse.json(
//         { message: "this user already exist, please login" },
//         { status: 400 },
//       );
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(body.password, salt);

//     const newUser = await prisma.user.create({
//       data: {
//         name: body.username,
//         email: body.email,
//         password: hashedPassword,
//       },
      
//     });

//     const {email, token}=await createVerificationToken(body.email)
//      await sendVerificationEmail(email,token)
      
       
  
//     return NextResponse.json(
//       {  message: "We've sent a verification email. Please verify your account within 2 minutes.",ok:false },
//       {
//         status: 201,
      
//       },
//     );

    
    
//   } catch (error:any) {
//       console.log("regester Error",error)
//      if (error instanceof AuthError)   { 
//           return NextResponse.json(
//             { message: error.cause?.err?.message ?? "register failed" },
//             { status: 400 },
//           );
//         }
//     return NextResponse.json(
//       { message: "internal server error" },
//       { status: 500 },
//     );
//   }
// }
