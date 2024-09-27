import { Resend } from "resend";
import { VerifyEmailTemplate } from "@/helpers/email/verifyEmailTemplate";
import { ApiResponse } from "@/types/ApiResponse";

const resend = new Resend(process.env.RESEND_APIKEY);

export async function sendVerificationEmail({
  email,
  username,
  verifyCode,
}: {
  email: string;
  username: string;
  verifyCode: string;
}): Promise<ApiResponse> {
  try {
    const emailResponse = await resend.emails.send({
      from: "virenlaniya.developer@gmail.com",
      to: email,
      subject: "Real Echoes - Email Verification",
      react: VerifyEmailTemplate({ username, verifyCode }),
    });

    if (!emailResponse.error) {
      throw emailResponse.error;
    }

    return {
      success: true,
      message: "Verification email sent",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
