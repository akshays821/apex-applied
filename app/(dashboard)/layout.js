import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import BottomTabBar from "@/components/layout/BottomTabBar";
import Providers from "@/components/layout/Providers";

export const metadata = {
  title: "Apex Applied | Dashboard",
  description: "Job application tracker dashboard",
};

export default function DashboardLayout({ children }) {
  return (
    <Providers>
      <div className="min-h-screen bg-[#2B2D3B] flex flex-row">
        <Sidebar />
        <main className="flex-1 w-full ml-0 sm:ml-[240px] pb-20 sm:pb-0">
          {children}
        </main>
        <BottomTabBar />
      </div>
    </Providers>
  );
}
