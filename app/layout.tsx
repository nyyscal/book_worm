import type { Metadata } from "next";
import "./globals.css";
import localFont  from "next/font/local"
import { ReactNode } from "react";
import { Toast } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

const imbPlexSans = localFont({
 src:[
  {path:"/fonts/IBMPlexSans-Regular.ttf",weight:"400",style:"normal"},
  {path:"/fonts/IBMPlexSans-Medium.ttf",weight:"500",style:"normal"},
  {path:"/fonts/IBMPlexSans-SemiBold.ttf",weight:"600",style:"normal"},
  {path:"/fonts/IBMPlexSans-Bold.ttf",weight:"700",style:"normal"},
 ]
});

const bebasNeue = localFont( {
    src:[
      {path: "/fonts/BebasNeue-Regular.ttf",weight:"400",style:"normal"},
    ],
    variable:"--bebas-neue"
});

export const metadata: Metadata = {
  title: "BookWise",
  description: "Book Store!",
};

const RootLayout=(
{children}: {children: ReactNode}) => {
  return (
    <html lang="en">
      <body
        className={`${imbPlexSans.className} ${bebasNeue.variable} antialiased`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
  );
}
export default RootLayout