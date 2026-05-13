import React from "react";
import JobForm from "@/components/jobs/JobForm";

export const metadata = {
  title: "Add Job | Apex Applied",
  description: "Track a new job application",
};

export default function NewJobPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Add New Job</h1>
          <p className="text-gray-400">
            Log a new application to your pipeline. The follow-up engine will automatically keep it on track.
          </p>
        </div>
        
        <JobForm />
      </div>
    </div>
  );
}
