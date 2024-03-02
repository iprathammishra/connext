import Calc from "@/components/Calc";
import InfoMeetingBlock from "@/components/InfoMeetingBlock";
import Nav from "@/components/Nav";
import RapidMeetingBlock from "@/components/RapidMeetingBlock";

import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();
  if (!session) {
    redirect("/authentication");
  }
  return (
    <>
      <div>
        <Nav />
      </div>
      <div className="flex ">
        <div className="h-screen w-1/2">
          <div className="mt-5 ml-8 inline-block">
            <RapidMeetingBlock />
          </div>
          <div className="mt-5 ml-8 inline-block">
            <InfoMeetingBlock />
          </div>
        </div>
        <div className=" w-1/2">
          <Calc />
        </div>
      </div>
    </>
  );
}
