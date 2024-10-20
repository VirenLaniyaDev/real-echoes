"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

const handleCredentialsSignIn = async ({
  identifier,
  password,
}: {
  identifier: string;
  password: string;
}) => {
  try {
    const response = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });
    return response;
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: error.type,
        message: error.message,
      };
    }
    return {
      error: "Error",
      message: "Something went wrong!",
    };
  }
};

const handleSignOut = async () => {
  await signOut({ redirectTo: "/signin" });
};

export { handleCredentialsSignIn, handleSignOut };
