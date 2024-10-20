import React from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Message } from "@/model/User";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { cn } from "@/lib/utils";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (id: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id as string}`,
      );
      if (!response) throw new Error("Something went wrong!");
      toast({
        title: response.data.success ? "Success" : "Error",
        description: response.data.message,
        variant: response.data.success ? "default" : "destructive",
      });
      onMessageDelete(message._id as string);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong!",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={cn("pt-6 w-full")}>
      <CardHeader className={cn("space-y-4")}>
        <div className="flex justify-between items-center">
          <CardDescription>
            {new Date(message.createdAt).toLocaleString()}
          </CardDescription>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <X />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="mt-10">
          <CardTitle className="text-xl">{message.content}</CardTitle>
        </div>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
