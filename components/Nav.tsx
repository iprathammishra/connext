"use client";
import { cn } from "@/lib/utils";
import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import { Button } from "./ui/button";
import { IoIosAddCircle } from "react-icons/io";
import { Input } from "./ui/input";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Badge } from "./ui/badge";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
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
import { useSession, signOut } from "next-auth/react";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Upcoming Meetings",
    href: "#",
    description: "A quick carousal for upcoming meetings.",
  },
  {
    title: "Meeting Information",
    href: "#",
    description: "A more intuitive carousal to update and remove a meeting.",
  },
  {
    title: "Meeting Description",
    href: "#",
    description: "Write and store meeting description.",
  },
  {
    title: "Platform",
    href: "#",
    description: "Add a platform badge.",
  },
  {
    title: "Importance Level",
    href: "#",
    description: "Add an importance level badge.",
  },
  {
    title: "Get Email Alerts.",
    href: "#",
    description: "Get email alerts before your meeting.",
  },
];

const Nav = () => {
  const [date, setDate] = React.useState<Date>();
  const [selectedPlatform, setSelectedPlatform] = React.useState("");
  const [title, setTitle] = React.useState("");

  const [importanceLevel, setImportanceLevel] = React.useState("");
  const [message, setMessage] = React.useState("");
  const { toast } = useToast();

  const { data: session }: any = useSession();

  const getUsers = async () => {
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
      return userData;
    } catch (error) {
      console.log(error);
    }
  };

  const getUserIdByEmail = async (email: String) => {
    try {
      const users = await getUsers();
      const user = users.find((user: any) => user.email === email);
      if (!user) {
        throw new Error("User not found.");
      }
      return user._id;
    } catch (error) {
      console.log(error);
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
        `https://xback.netlify.app/.netlify/functions/app/users/${userId}/meetings`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        toast({
          className: "text-white border-zinc-700 bg-green-500",
          title: "Meeting successfully saved!",
          description: "Try creating another meeting.",
        });
        setInterval(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error("Failed to create a user.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex ml-10 my-4 ">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent h-8">
                Getting started
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="#"
                      >
                        <Image
                          src={"/connect-logo.png"}
                          alt="logo"
                          width={100}
                          height={100}
                          className="rounded"
                        />

                        <div className="mb-2 mt-4 text-lg font-medium">
                          /connext
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Beautifully designed to manage your meetings.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="#" title="Introduction">
                    Never miss a meeting again.
                  </ListItem>
                  <ListItem href="#" title="How to use?">
                    Click on &quot;New Meeting&quot; button and get started.
                  </ListItem>
                  <ListItem href="#" title="Edit">
                    Check &quot;Meeting Information&quot; badge to edit or
                    delete meetings.
                  </ListItem>
                  <Button
                    onClick={() => {
                      signOut();
                    }}
                    className="h-8"
                    variant={"destructive"}
                  >
                    Logout
                  </Button>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent h-8">
                Components
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="h-8" variant={"secondary"}>
                  <IoIosAddCircle className="mr-2 h-5 w-5" />
                  New Meeting
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-zinc-950 border-zinc-600 w-[500px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    <Badge className="bg-white text-black">New Meeting</Badge>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <form onSubmit={handleSubmit}>
                      <p className="text-[.8em]">
                        Feed your meeting details and click save when
                        you&apos;re done.
                      </p>
                      <Input
                        type="text"
                        placeholder="Meeting Title"
                        className=" placeholder:border-zinc-600 border-zinc-600 mt-2 text-white"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
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
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarPrime
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <TimePickerDemo setDate={setDate} date={date} />
                      <div className=" flex items-center">
                        <div className=" mt-4">
                          <Select onValueChange={setSelectedPlatform}>
                            <SelectTrigger className="w-[180px] border-zinc-600">
                              <SelectValue placeholder="Select a platform" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Platform</SelectLabel>
                                <SelectItem value="Zoom">Zoom</SelectItem>
                                <SelectItem value="Google">
                                  Google Meet
                                </SelectItem>
                                <SelectItem value="Microsoft">
                                  Microsoft Teams
                                </SelectItem>
                                <SelectItem value="Cisco">
                                  Cisco Webex
                                </SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="ml-4 mt-4">
                          <Select onValueChange={setImportanceLevel}>
                            <SelectTrigger className="w-[180px] border-zinc-600">
                              <SelectValue placeholder="Importance level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Importance</SelectLabel>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className=" mt-3 grid w-full gap-1.5">
                        <Label htmlFor="message-2" className="text-xs">
                          Your Message
                        </Label>
                        <Textarea
                          placeholder="Type your meeting description here."
                          id="message-2"
                          className="border-zinc-600 overflow-y-auto resize-none placeholder:text-xs text-white"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
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
                            !message ||
                            (date && new Date(date) < new Date())
                          }
                        >
                          Submit Details
                        </Button>
                      </div>
                    </form>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent border-none w-20 hover:bg-transparent">
                    <Button variant={"destructive"}>Cancel</Button>
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-xs pl-2 text-zinc-600">
              /connext/{session.user?.email}
            </p>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Nav;
