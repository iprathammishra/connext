"use client";
import React, { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Input } from "./ui/input";
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
} from "./ui/alert-dialog";
import { CalendarPrime } from "./ui/calendar-prime";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { TimePickerDemo } from "./Time";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const InfoMeetingBlock = () => {
  const [date, setDate] = React.useState<Date>();
  const [selectedPlatform, setSelectedPlatform] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [importanceLevel, setImportanceLevel] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = useState(true);
  const { data: session }: any = useSession();
  const [meetings, setMeetings] = useState([]);
  const { toast } = useToast();
  const [editingMeetingId, setEditingMeetingId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await getUserIdByEmail(session.user?.email);
        const userMeetings = await getMeetings(userId);
        setMeetings(userMeetings);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchData();
    }
  }, [session?.user?.email]);

  const getUserIdByEmail = async (email: string) => {
    try {
      const res = await fetch(
        "https://xback.netlify.app/.netlify/functions/app/users",
        {
          cache: "no-store",
        }
      );
      if (!res.ok) {
        throw new Error("Failed to get data.");
      }
      const userData = await res.json();
      const user = userData.find((user: any) => user.email === email);
      if (!user) {
        throw new Error("User not found.");
      }
      return user._id;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getMeetings = async (userId: string) => {
    try {
      const res = await fetch(
        `https://xback.netlify.app/.netlify/functions/app/users/${userId}/meetings`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to get data.");
      }

      const userMeetingData = await res.json();
      return userMeetingData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const extractTime = (datetimeString: string) => {
    const dateTime = new Date(datetimeString);
    const timeString = dateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return timeString;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Low":
        return "bg-green-500";
      case "Medium":
        return "bg-yellow-500";
      case "High":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="absolute mt-72 -ml-7">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  const handleDelete = async (meetingId: string) => {
    try {
      const userId = await getUserIdByEmail(session.user?.email);
      const res = await fetch(
        `https://xback.netlify.app/.netlify/functions/app/users/${userId}/meetings/${meetingId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        toast({
          className: "text-white border-zinc-700 bg-green-500",
          title: "Meeting successfully deleted!",
          description: "Try creating another meeting.",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const errorMessage = await res.text();
        throw new Error(`Failed to delete meeting: ${errorMessage}`);
      }
    } catch (error: any) {
      console.error("Error deleting meeting:", error.message);
      toast({
        className: "text-white border-zinc-700 bg-red-500",
        title: "Error deleting meeting",
        description: "Please try again later.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = await getUserIdByEmail(session.user?.email);
    const data = {
      title: title,
      description: message,
      urgency: importanceLevel,
      time: date,
      platform: selectedPlatform,
    };
    try {
      const res = await fetch(
        `https://xback.netlify.app/.netlify/functions/app/users/${userId}/meetings/${editingMeetingId}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        toast({
          className: "text-white border-zinc-700 bg-green-500",
          title: "Meeting successfully edited!",
          description: "Try editing another meeting.",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const errorMessage = await res.text();
        throw new Error(`Failed to edit meeting: ${errorMessage}`);
      }
    } catch (error: any) {
      console.error("Error editing the meeting:", error.message);
      toast({
        className: "text-white border-zinc-700 bg-red-500",
        title: "Error editing the meeting",
        description: "Please try again later.",
      });
    }
  };
  return (
    <>
      {meetings.length === 0 ? (
        <div></div>
      ) : (
        <div>
          <Badge className="bg-white text-black mb-3">
            Meetings Information
          </Badge>
          <div className="ml-16">
            <Carousel
              opts={{
                align: "start",
              }}
              orientation="vertical"
              className="w-[100%] max-w-2xl mt-8"
            >
              <CarouselContent className="-mt-1 h-[200px]">
                {meetings.map((m: any) => (
                  <CarouselItem key={m._id} className="pt-1 md:basis-1/2">
                    <div className="p-1">
                      <Card className="bg-transparent h-48 w-[600px] text-white border-zinc-600">
                        <CardContent className="aspect-square p-4">
                          <Badge
                            className={`text-[.7rem] text-black px-1 mb-1 ${getUrgencyColor(
                              m.urgency
                            )} font-bold`}
                          >
                            {m.urgency}
                          </Badge>
                          <Badge className=" text-[.7rem] text-white px-1 mb-1 ml-2 bg-transparent border-zinc-600 font-normal">
                            {m.platform}
                          </Badge>
                          <div className="text-xl w-82 h-7 overflow-y-auto">
                            {m.title}
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3 text-zinc-600" />
                            <p className="text-xs text-zinc-600">
                              {extractTime(m.time)}
                            </p>
                          </div>
                          <div className="text-xs text-zinc-600 w-[550px] h-12 mt-1 overflow-y-auto ">
                            {m.description}
                          </div>
                          <div className="mt-2 text-end">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant={"destructive"}
                                  className=" px-3 mr-2 text-xs h-6"
                                >
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-zinc-950 border-zinc-600">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete your meeting and remove
                                    your data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-transparent border-none w-20 hover:bg-transparent">
                                    <Button variant={"destructive"}>
                                      Cancel
                                    </Button>
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      handleDelete(m._id);
                                    }}
                                  >
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant={"secondary"}
                                  className=" px-3 mr-2 text-xs h-6"
                                  onClick={() => {
                                    setEditingMeetingId(m._id);
                                  }}
                                >
                                  Edit
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-zinc-950 border-zinc-600 w-[500px]">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    <Badge className="bg-white text-black">
                                      Edit Meeting
                                    </Badge>
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    <form onSubmit={handleSubmit}>
                                      <p className="text-[.8em]">
                                        Feed your meeting details and click save
                                        when you're done.
                                      </p>
                                      <Input
                                        type="text"
                                        placeholder="Meeting Title"
                                        className="placeholder:border-zinc-600 border-zinc-600 mt-2 text-white"
                                        value={title}
                                        onChange={(e) =>
                                          setTitle(e.target.value)
                                        }
                                        required
                                      />
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "w-[240px] justify-start text-left font-normal bg-transparent border-zinc-600 my-2",
                                              !date && "text-muted-foreground"
                                            )}
                                          >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? (
                                              format(date, "PPP")
                                            ) : (
                                              <span>Pick a date</span>
                                            )}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                          className="w-auto p-0"
                                          align="start"
                                        >
                                          <CalendarPrime
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      </Popover>
                                      <TimePickerDemo
                                        setDate={setDate}
                                        date={date}
                                      />
                                      <div className=" flex items-center">
                                        <div className=" mt-4">
                                          <Select
                                            onValueChange={setSelectedPlatform}
                                          >
                                            <SelectTrigger className="w-[180px] border-zinc-600">
                                              <SelectValue placeholder="Select a platform" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                <SelectLabel>
                                                  Platform
                                                </SelectLabel>
                                                <SelectItem value="Zoom">
                                                  Zoom
                                                </SelectItem>
                                                <SelectItem value="Google">
                                                  Google Meet
                                                </SelectItem>
                                                <SelectItem value="Microsoft">
                                                  Microsoft Teams
                                                </SelectItem>
                                                <SelectItem value="Cisco">
                                                  Cisco Webex
                                                </SelectItem>
                                                <SelectItem value="Other">
                                                  Other
                                                </SelectItem>
                                              </SelectGroup>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="ml-4 mt-4">
                                          <Select
                                            onValueChange={setImportanceLevel}
                                          >
                                            <SelectTrigger className="w-[180px] border-zinc-600">
                                              <SelectValue placeholder="Importance level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                <SelectLabel>
                                                  Importance
                                                </SelectLabel>
                                                <SelectItem value="Low">
                                                  Low
                                                </SelectItem>
                                                <SelectItem value="Medium">
                                                  Medium
                                                </SelectItem>
                                                <SelectItem value="High">
                                                  High
                                                </SelectItem>
                                              </SelectGroup>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <div className=" mt-3 grid w-full gap-1.5">
                                        <Label
                                          htmlFor="message-2"
                                          className="text-xs"
                                        >
                                          Your Message
                                        </Label>
                                        <Textarea
                                          placeholder="Type your meeting description here."
                                          id="message-2"
                                          className="border-zinc-600 overflow-y-auto resize-none placeholder:text-xs text-white"
                                          value={message}
                                          onChange={(e) =>
                                            setMessage(e.target.value)
                                          }
                                        />
                                      </div>

                                      <div className=" absolute bottom-6">
                                        <Button
                                          type="submit"
                                          disabled={
                                            !title ||
                                            !date ||
                                            !selectedPlatform ||
                                            !importanceLevel ||
                                            !message
                                          }
                                        >
                                          Edit Details
                                        </Button>
                                      </div>
                                    </form>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-transparent border-none w-20 hover:bg-transparent">
                                    <Button variant={"destructive"}>
                                      Cancel
                                    </Button>
                                  </AlertDialogCancel>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoMeetingBlock;
