import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@/auth";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: NextRequest) {
  await dbConnect();

  const session = await auth();
  const user = session?.user as User;

  // Check for Authenticated User
  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 },
    );
  }

  try {
    const userId = user._id;
    const { acceptMessages } = await request.json();
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true },
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept messages",
        },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "User status to accept message updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  await dbConnect();

  const session = await auth();
  const user = session?.user as User;

  // Check for Authenticated User
  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 },
    );
  }

  try {
    const userId = user._id;
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error while getting Accepting Message status",
      },
      { status: 500 },
    );
  }
}
