import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Interview Scheduler",
  description: "Manage your interview schedules efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="flex h-screen">
          {/* <Sidebar /> */}

          {/* Main content */}
          <div className="ml-64 flex-grow bg-transparent flex flex-col">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
