import React from "react";
import Navbar from "@/components/layout/Navbar";
import Providers from "@/components/layout/Providers";

export const metadata = {
  title: "Apex Applied | Dashboard",
  description: "Job application tracker dashboard",
};

export default function DashboardLayout({ children }) {
  return (
    <Providers>
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <Navbar />
        <main className="flex-1 w-full pt-10 sm:pt-0 pb-12 sm:pb-0">
          {children}
        </main>
      </div>
    </Providers>
  );
}
