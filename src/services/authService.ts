import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcryptjs from "bcryptjs";
import { User } from "next-auth";

export async function authenticateUser(credentials: {
  identifier: string;
  password: string;
}): Promise<User> {
  await dbConnect();

  const user = await UserModel.findOne({
    $or: [
      { email: credentials.identifier },
      { username: credentials.identifier },
    ],
  }).select("+password");

  // Test User
  // const user: User = {
  //   email: "test@test.abc",
  //   isVerified: true,
  //   isAcceptingMessages: true
  // };

  if (!user) {
    throw new Error("User not found!");
  }

  if (!user.isVerified) throw new Error("Please verify your account!");

  const isPasswordCorrect = bcryptjs.compareSync(
    credentials.password as string,
    user.password,
  );
  if (!isPasswordCorrect) throw new Error("Incorrect password!");

  return user;
}
