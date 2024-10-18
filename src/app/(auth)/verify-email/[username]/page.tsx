"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/schemas/verifySchema";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  //#region State
  const [isSubmitting, setIsSubmitting] = useState(false);
  //#endregion

  //#region Verify Email Form Handler
  const verifyEmailForm = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof verifySchema>> = async (
    data
  ) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/auth/verify-code", {
        username: params.username,
        code: data.code,
      });
      if (response.data?.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        router.push("/signin");
      }
      setIsSubmitting(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error.response?.data as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description: axiosError.message,
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    }
  };
  //#endregion

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">
      <div className="max-w-lg w-full p-12 rounded-xl shadow-md bg-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Verify your account
          </h2>
          <p className="mt-4 text-sm text-gray-600">
            Enter the verification code sent to your email
          </p>
        </div>
        <div className="form-wrapper">
          <Form {...verifyEmailForm}>
            <form
              onSubmit={verifyEmailForm.handleSubmit(onSubmit)}
              className="mt-8 space-y-6"
            >
              <FormField
                name="code"
                control={verifyEmailForm.control}
                render={({ field }) => (
                  <FormItem className="flex justify-center items-center">
                    <FormLabel className="sr-only">Verification Code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={1} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={4} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Verify Email"
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Didn't receive the code?{" "}
              <Button
                className="font-medium text-indigo-600 hover:text-indigo-700"
                variant="link"
              >
                Resend
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
