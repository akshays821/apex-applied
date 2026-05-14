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

  if (loading) return <div className="min-h-screen bg-[#2B2D3B] flex items-center justify-center text-white">Loading...</div>;
  if (error) return <div className="min-h-screen bg-[#2B2D3B] flex items-center justify-center text-red-500">{error}</div>;
  if (!job) return null;

  return (
    <div className="min-h-screen bg-[#2B2D3B] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <JobForm initialData={job} />
      </div>
    </div>
  );
}
