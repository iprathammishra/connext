import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/connect-1r1.png" />
      </head>
      <body className=" font-['Comfortaa']">{children}</body>
    </html>
  );
}
