import dbConnect from "@/lib/dbConnect";
import { auth } from "@/auth";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
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
    const userId = new mongoose.Types.ObjectId(user._id);

    const foundUser = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    console.log(foundUser); // TODO: Remove

    if (!foundUser || foundUser.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Messages not available!",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        messages: foundUser[0].messages,
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error while fetching user messages",
      },
      { status: 500 },
    );
  }
}
