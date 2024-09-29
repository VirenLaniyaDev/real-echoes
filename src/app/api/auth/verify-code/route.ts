import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username); // Decoding request data component which is actually a good practice.

    const user = await UserModel.findOne({
      username: decodedUsername,
    });

    // User not found
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found!",
        },
        { status: 500 }
      );
    }
    // Check if user already verified
    if (user.isVerified) {
      return Response.json(
        {
          success: false,
          message: "User already verified!",
        },
        { status: 500 }
      );
    }

    // Check if Code is valid or not
    const isCodeValid = user.verifyCode === code;
    if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Invalid Verification Code",
        },
        { status: 500 }
      );
    }

    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    // Check for Verify code expiration
    if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verify code has been expired, please signup again to get new verification code!",
        },
        { status: 500 }
      );
    }

    user.isVerified = true;
    await user.save();

    return Response.json(
      {
        success: true,
        message: "User verified",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
