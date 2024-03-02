"use client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MdEmail } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
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
import React, { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

const Auth = () => {
  const { toast } = useToast();

  const router = useRouter();

  const { data: session, status: sessionStatus } = useSession();
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleRegisterSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      toast({
        className: "text-white border-zinc-700 bg-red-500",
        title: "Email is invalid",
        description: "Please enter a valid email address.",
      });
      return;
    }
    if (!password || password.length < 8) {
      toast({
        className: "text-white border-zinc-700 bg-red-500",
        title: "Password is invalid",
        description:
          "Please check your password. Password must be 8 characters long.",
      });
      return;
    }
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (res.status === 400) {
        toast({
          className: "text-white border-zinc-700 bg-red-500",
          title: "This email is already registered.",
          description: "Try registering from another email.",
        });
      }
      if (res.status === 200) {
        toast({
          className: "text-white border-zinc-700 bg-green-500",
          title: "User registration successfull.",
          description: "Try logging in now.",
        });
      }
    } catch (error) {
      toast({
        className: "text-white border-zinc-700 bg-red-500",
        title: "Error, try again.",
        description: "Please check your connection and try again.",
      });
      console.log(error);
    }
  };

  const handleSignInSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      toast({
        className: "text-white border-zinc-700 bg-red-500",
        title: "Email is invalid",
        description: "Please enter a valid email address.",
      });
      return;
    }
    if (!password || password.length < 8) {
      toast({
        className: "text-white border-zinc-700 bg-red-500",
        title: "Password is invalid",
        description:
          "Please check your password. Password must be 8 characters long.",
      });
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.error) {
      toast({
        className: "text-white border-zinc-700 bg-red-500",
        title: "Invalid email or password",
        description: "Please check your credentials and try logging again.",
      });
      if (res?.url) router.replace("/");
    } else {
      toast({
        className: "text-white border-zinc-700 bg-green-500",
        title: "User login successfull.",
        description: "Welcome again.",
      });
      router.refresh();
    }
  };

  if (sessionStatus === "loading") {
    return <h1 className=" text-red-700">Loading...</h1>;
  }

  return (
    <>
      <div className=" absolute right-0 m-5">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"secondary"}>Login</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className=" bg-zinc-950 border-zinc-600">
            <AlertDialogHeader>
              <AlertDialogTitle>Login</AlertDialogTitle>
              <AlertDialogDescription className=" text-white ">
                <p className="-mt-2 mb-2 text-zinc-600 ">
                  This is your public email address
                </p>
                <form onSubmit={handleSignInSubmit}>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    className=" placeholder:text-zinc-600 border-zinc-700"
                    required
                  />
                  <Input
                    type="password"
                    placeholder="password"
                    className=" placeholder:text-zinc-600 border-zinc-700 mt-2"
                    required
                  />
                  <Button
                    type="submit"
                    className=" w-full my-2"
                    variant={"secondary"}
                  >
                    <MdEmail className="mr-4 h-5 w-5" />
                    Login with Email
                  </Button>
                </form>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className=" bg-red-600 hover:bg-red-500 border-none hover:text-white">
                Cancel
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className=" h-screen flex justify-center items-center w-full">
        <div className="w-80">
          <p className=" text-center text-xl ">Create an account</p>
          <p className="text-sm my-1 text-center text-zinc-600">
            Enter your email below to create your account
          </p>
          <form onSubmit={handleRegisterSubmit}>
            <Input
              type="email"
              placeholder="name@example.com"
              className=" placeholder:text-zinc-600 border-zinc-700"
            />
            <Input
              type="password"
              placeholder="password"
              className=" placeholder:text-zinc-600 border-zinc-700 mt-2"
            />
            <Button
              type="submit"
              className=" w-full my-2"
              variant={"secondary"}
            >
              <MdEmail className="mr-4 h-5 w-5" />
              Register Email
            </Button>
          </form>
          <div className=" flex justify-center items-center">
            <hr className=" my-2 w-[20%]" />
            <div className="mx-2 my-2 text-[.7em] ">OR CONTINUE WITH</div>
            <hr className=" my-2 w-[20%] " />
          </div>
          <Button
            type="submit"
            className=" w-full my-2 bg-transparent"
            variant={"outline"}
            onClick={() => {
              signIn("github");
            }}
          >
            <FaGithub className="mr-3 h-5 w-5" />
            GitHub
          </Button>
          <p className="text-sm my-1 text-zinc-600 text-center ">
            By clicking continue, you agree to our{" "}
            <span className="underline">Terms of Service</span> and{" "}
            <span className="underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </>
  );
};

export default Auth;
