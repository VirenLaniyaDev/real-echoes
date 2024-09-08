import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/lib/emailService";
import argon2 from "argon2";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // Check for already existed and verified user
    const existingUser = await UserModel.findOne({ username, isVerified: true });
    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "User already exists!",
        },
        { status: 500 }
      );
    }

    // User by email
    const existingUserByEmail = await UserModel.findOne({ email });

    const hashedPassword = await argon2.hash(password); // Encrypt Password using Argon2
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();  // Generate 6-digit verification code
    const verifyCodeExpiry = new Date();
    verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1); // 1 hour expiry date for verification code

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        // If user is verified then simply return with success false
        return Response.json(
          {
            success: false,
            message: "User already exists!",
          },
          { status: 500 }
        );
      } else {
        // Otherwise, Email not verified so update user details
        existingUserByEmail.username = username;
        existingUserByEmail.email = email;
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.save();
      }
    } else {
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry,
        isAcceptingMessage: false,
        isVerified: false,
        messages: [],
      });
      newUser.save();
    }

    // Send verification email to user
    const emailResponse = await sendVerificationEmail({
      email,
      username,
      verifyCode,
    });

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    // Success
    return Response.json(
      {
        success: true,
        message: "User registered successfully! Please verify your email.",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({
      success: false,
      message: "Error occurred during register user",
    });
  }
}
