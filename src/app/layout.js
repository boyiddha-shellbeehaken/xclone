import { Lato } from "next/font/google";
import AuthProvider from "@/components/SessionProvider"; // Import the client wrapper
import "./globals.css";

import connectDB from "@/utils/mongodb";

import { SessionProvider } from "next-auth/react";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"], // Specify the weights you need
});

export const metadata = {
  title: "X. It’s what’s happening / X",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  const conn = connectDB(); // Universally connect DB
  return (
    <html lang="en">
      <body className={lato.variable}>
        <AuthProvider>
          {" "}
          {/* Wrap in the Client Component */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
