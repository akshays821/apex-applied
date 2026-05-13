"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import JobForm from "@/components/jobs/JobForm";

export default function EditJobPage() {
  const params = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${params.id}`);
        if (!res.ok) throw new Error("Job not found");
        const data = await res.json();
        setJob(data.job || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchJob();
  }, [params.id]);

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading...</div>;
  if (error) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-red-500">{error}</div>;
  if (!job) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Edit Job: {job.roleTitle}</h1>
          <p className="text-gray-400">
            Update application details for {job.companyName}.
          </p>
        </div>
        
        <JobForm initialData={job} />
      </div>
    </div>
  );
}
