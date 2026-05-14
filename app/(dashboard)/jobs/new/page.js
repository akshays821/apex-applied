import React from "react";
import JobForm from "@/components/jobs/JobForm";

export const metadata = {
  title: "Add Job | Apex Applied",
  description: "Track a new job application",
};

export default function NewJobPage() {
  return (
    <div className="min-h-screen bg-[#2B2D3B] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <JobForm />
      </div>
    </div>
  );
}
