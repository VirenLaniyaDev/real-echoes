"use server"

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const handleCredentialsSignIn = async ({
  identifier,
  password,
}: {
  identifier: string;
  password: string;
}) => {
  try {
    const response = await signIn("credentials", { identifier, password, redirect: false });
    return response;
  } catch (error) {
    if (error instanceof AuthError) {
      console.log("Auth Error");
      return {
        error: error.type,
        message: error.message
      }
    }
    return {
      error: "Error",
      message: "Something went wrong!"
    }
  }
};

export { handleCredentialsSignIn };
