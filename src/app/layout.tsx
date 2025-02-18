import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Immersive Tech Lab Booking - Home",
  description: "The home page of the Immersive Tech Lab Booking system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body>
          {children}
        </body>
    </html>
  );
}
