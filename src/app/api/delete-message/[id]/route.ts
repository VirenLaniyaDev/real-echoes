import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  await dbConnect();

  const session = await auth();
  const user: User = session?.user as User;

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
    console.log(params);
    const userId = new mongoose.Types.ObjectId(user._id);
    const messageId = new mongoose.Types.ObjectId(params.id);

    const updatedUser = await UserModel.updateOne(
      { _id: userId },
      { $pull: { messages: { _id: messageId } } },
    );

    if (updatedUser.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message Deleted",
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error deleting message",
      },
      { status: 500 },
    );
  }
}
