"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { signInSchema } from "@/schemas/signInSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
// import axios, { AxiosError } from "axios";
// import { ApiResponse } from "@/types/ApiResponse";
import { handleCredentialsSignIn } from "@/actions/authActions";

const SignIn = () => {
  //#region Variables & Initializers
  const router = useRouter();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  //#endregion

  //#region Sign in Form Handler
  const credentialsForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof signInSchema>> = async (
    data,
  ) => {
    setIsSubmitting(true);
    try {
      const response = await handleCredentialsSignIn({
        identifier: data.identifier,
        password: data.password,
      });
      if (response?.error) {
        switch (response?.error) {
          case "CredentialsSignin":
            toast({
              title: "SignIn Failed",
              description: "Invalid Username or Password!",
              variant: "destructive",
            });
            break;
          default:
            toast({
              title: "Error",
              description: "Something went wrong!",
              variant: "destructive",
            });
            break;
        }
      }
      if (response) router.push("/dashboard");
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
    }
  };
  //#endregion

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">
      <div className="max-w-lg w-full p-12 rounded-xl shadow-md bg-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-4 text-sm text-gray-600">
            Welcome back to Real Echoes
          </p>
        </div>
        <div className="form-wrapper">
          <Form {...credentialsForm}>
            <form
              onSubmit={credentialsForm.handleSubmit(onSubmit)}
              className="mt-8 space-y-6"
            >
              <FormField
                control={credentialsForm.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Username/Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username or email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={credentialsForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isPasswordVisible ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                        />
                        <div className="absolute inset-y-0 flex items-center right-0 pr-3">
                          {isPasswordVisible ? (
                            <EyeOff
                              className="h-4 w-4"
                              onClick={() => setIsPasswordVisible(false)}
                            />
                          ) : (
                            <Eye
                              className="h-4 w-4"
                              onClick={() => setIsPasswordVisible(true)}
                            />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center">
                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot your Password?
                  </Link>
                </div>
              </div>

              <Button className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="text-center">
                <p className="mt-2 text-sm text-gray-600">
                  Don&apos;t have account?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
