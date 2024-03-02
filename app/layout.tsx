import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

import { getServerSession } from "next-auth";
import SessionProvider from "@/lib/SessionProvider";

export const metadata = {
  title: "Connect, book, attend, review, and enjoy. Hence, stay updated.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/connect-logo.png" />
      </head>
      <body className=" overflow-hidden font-[Ubuntu] bg-zinc-950 text-white">
        <SessionProvider session={session}>
          <main>{children}</main>
          <Toaster />
          <div className="absolute bottom-2 right-4 text-xs text-zinc-600">
            copyright 2024 @github.com/iprathammishra
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
