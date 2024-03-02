"use client";
import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";

const RapidMeetingBlock = () => {
  const { data: session }: any = useSession();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className=" absolute items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }
  return (
    <>
      {meetings.length === 0 ? (
        <div className=" text-sm">No meetings</div>
      ) : (
        <div>
          <Badge className="bg-white text-black mb-3">Upcoming Meetings</Badge>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-[100%] max-w-[600px] ml-16"
          >
            <CarouselContent className="bg-transparent ">
              {meetings.map((m: any) => (
                <CarouselItem
                  key={m._id}
                  className="md:basis-1/2 lg:basis-1/3 p-1 ml-7"
                >
                  <Card className="bg-transparent w-44 h-40 border-zinc-600 text-white">
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
                      <div className="text-xl w-36 h-7 overflow-y-auto">
                        {m.title}
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3 text-zinc-600" />
                        <p className="text-xs text-zinc-600">
                          {extractTime(m.time)}
                        </p>
                      </div>
                      <div className="text-xs text-zinc-600 w-36 h-12  bottom-5 absolute overflow-y-auto">
                        {m.description}
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
    </>
  );
};

export default RapidMeetingBlock;
