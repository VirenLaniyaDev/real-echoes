import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
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
    const { username, content } = await request.json();

    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: true,
          message: "User not found.",
        },
        { status: 404 },
      );
    }

    // is user accepting messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: true,
          message: "User is not accepting the messages.",
        },
        { status: 403 },
      );
    }

    const newMessage = { content: content, createdAt: new Date() };

    user.messages.push(newMessage as Message);

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Unexpected error occurred during sending message.",
      },
      { status: 500 },
    );
  }
}
