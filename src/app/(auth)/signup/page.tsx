"use client";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useDebounceValue } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const SignUp = () => {
  const router = useRouter();
  const { toast } = useToast();

  //#region States
  const [username, setUsername] = useState("");
  const [debouncedUsername] = useDebounceValue(username, 500); // Use Debouncing to Check username availability
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [uniqueUsername, setUniqueUsername] = useState({
    isUnique: false,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  //#endregion

  //#region Custom Debouncing
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setDebouncedUsername(username);
  //   }, 1000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [username]);
  //#endregion

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUniqueUsername({
          isUnique: false,
          message: "",
        });
        try {
          // Make API call to check username availability
          const response = await axios.get("/api/auth/check-username", {
            params: {
              username: debouncedUsername,
            },
          });
          if (response) {
            setUniqueUsername({
              isUnique: true,
              message: response.data.message,
            });
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            // handle Axios error
            const axiosError = error as AxiosError<ApiResponse>;
            setUniqueUsername({
              isUnique: false,
              message:
                axiosError.response?.data.message ??
                "Error occurred during check username",
            });
          }
        } finally {
          setIsCheckingUsername(false); // Finally set IsCheckingUsername to true
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  //#region SignUp Form Handler
  const signupForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof signUpSchema>> = async (
    data,
  ) => {
    setIsSubmitting(true);
    try {
      if (!uniqueUsername.isUnique) {
        setIsSubmitting(false);
        return;
      }
      const response = await axios.post("/api/signUp", data);
      if (response) {
        toast({
          title: "Success",
          description: response.data?.message,
        });
        setIsSubmitting(false);
        router.push(`/verify-email/${data.username}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error.response?.data as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description: axiosError.message,
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    }
  };
  //#endregion

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">
      <div className="max-w-lg w-full p-12 rounded-xl shadow-md bg-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Create your account
          </h2>
          <p className="mt-4 text-sm text-gray-600">
            Join Real Echoes and start receiving authentic feedback
          </p>
        </div>
        <div className="form-wrapper">
          <Form {...signupForm}>
            <form
              onSubmit={signupForm.handleSubmit(onSubmit)}
              className="mt-8 space-y-6"
            >
              <FormField
                name="username"
                control={signupForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Username"
                          {...field}
                          value={username}
                          onChange={(e) => {
                            field.onChange(e);
                            setUsername(e.target.value);
                          }}
                        />
                        {isCheckingUsername && (
                          <div className="absolute inset-y-0 flex items-center right-0 pr-3">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage
                      className={
                        uniqueUsername.isUnique ? "text-green-600" : ""
                      }
                    >
                      {isCheckingUsername ? "" : uniqueUsername.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={signupForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={signupForm.control}
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

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Sign up"
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
