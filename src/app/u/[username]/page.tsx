"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { messageSchema } from "@/schemas/messageSchema";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const SendMessage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams<{ username: string }>();

  // 1. Define your form.
  const messageForm = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  // submit handler.
  const onSubmit: SubmitHandler<z.infer<typeof messageSchema>> = async (
    data,
  ) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username: params.username,
        content: data.content,
      });
      toast({
        title: response.data.success ? "Success" : "Error",
        description: response.data.message,
        variant: response.data.success ? "default" : "destructive",
      });
      messageForm.reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error.response?.data as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description: axiosError.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 mt-10 space-y-10">
      <h2 className="text-3xl font-semibold">Public Profile Link</h2>
      <Form {...messageForm}>
        <form
          onSubmit={messageForm.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <FormField
            control={messageForm.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">
                  Send Anonymous Message to @{params.username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting} className="mt-5">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Send it"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SendMessage;
