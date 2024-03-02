import Auth from "@/components/Auth";
import Image from "next/image";

import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Authentication",
};

export default async function Authentication() {
  const session = await getServerSession();
  if (!session) {
    return (
      <div className="flex">
        <div className="h-screen bg-[#141414] w-1/2">
          <div className=" m-5 inline-block">
            <Image
              src={"/connect-logo.png"}
              alt="logo"
              width={80}
              height={80}
            />
          </div>
          <div className=" bottom-10 left-5 absolute w-[700px] text-2xl">
            “Everything is linked together, everything is inseparable.” —Dalai
            Lama XIV
          </div>
        </div>
        <div className=" w-1/2">
          <Auth />
        </div>
      </div>
    );
  } else if (session) {
    redirect("/");
  }
}
