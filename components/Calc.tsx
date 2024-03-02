"use client";
import React from "react";
import { Calendar } from "./ui/calendar";

const Calc = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className=" flex justify-center -my-3 ">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md shadow"
      />
    </div>
  );
};

export default Calc;
