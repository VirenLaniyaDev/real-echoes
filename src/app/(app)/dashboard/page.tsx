"use client";
import React, { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import MessageCard from "@/components/message-card";
import { Message } from "@/model/User";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const session = useSession();

  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  //#region Copy Profile Link
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileLink = `${baseUrl}/u/${session?.data?.user.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileLink);
    toast({
      title: "Profile Link Copied!",
    });
  };
  //#endregion

  //#region Accept Messages
  const acceptMessagesForm = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = acceptMessagesForm;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    try {
      const response = await axios.get("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {}
  }, [setValue]);

  // Handle Switch Change
  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ||
            "Error during changing Accept Messages",
          variant: "destructive",
        });
      }
    } finally {
      setIsSwitchLoading(false);
    }
  };
  //#endregion

  //#region Messages
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsRefreshing(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        if (response?.data) {
          setMessages(response.data.messages as Message[]);
          if (refresh) {
            toast({
              title: "Refreshed Messages",
              description: "Showing latest Messages",
            });
          }
        }
        setIsRefreshing(false);
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
        setIsRefreshing(false);
      }
    },
    [setIsRefreshing],
  );

  const handleOnMessageDelete = (messageId: string) => {
    const updatedMessages = messages.filter(
      (message) => message._id !== messageId,
    );
    setMessages(updatedMessages);
  };
  //#endregion

  useEffect(() => {
    fetchAcceptMessages();
    fetchMessages();
  }, [setValue, fetchAcceptMessages, fetchMessages]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 mt-10 space-y-10">
      <div className="welcome-text">
        <h2 className="text-3xl font-semibold">
          Welcome, {session.data?.user.username}
        </h2>
      </div>
      <div className="copy-link space-y-3">
        <h5>Copy Your Unique Link</h5>
        <div className="flex justify-between items-center space-x-3">
          <Input disabled value={profileLink} />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          {...register("acceptMessages")}
          id="accept-messages"
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <Label htmlFor="accept-messages">Accept Messages :</Label>
        <span>{acceptMessages ? "On" : "Off"}</span>
      </div>
      <Separator />
      <div>
        <Button onClick={() => fetchMessages(true)}>
          <RefreshCw className={cn("mr-0", isRefreshing && "animate-spin")} />
          <span>Refresh</span>
        </Button>
      </div>
      {messages.length > 0 ? (
        <div className="my-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {messages.map((message) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleOnMessageDelete}
            />
          ))}
        </div>
      ) : (
        <div className="grid place-content-center">No messages to display</div>
      )}
    </div>
  );
};

export default Dashboard;
