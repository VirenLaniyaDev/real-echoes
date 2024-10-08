import dbConnect from "@/lib/dbConnect";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import UserModel from "@/model/User";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const queryParams = {
    username: searchParams.get("username"),
  };

  await dbConnect();

  try {
    const result = UsernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : "Invalid username",
        },
        { status: 500 },
      );
    }

    const user = await UserModel.findOne({
      username: queryParams.username,
      isVerified: true,
    });

    if (user) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already taken!",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 },
    );
  } catch (error) {
    // console.log("Error while checking username!"); //TODO: Remove
    return NextResponse.json(
      {
        success: false,
        message: error,
      },
      { status: 500 },
    );
  }
}
