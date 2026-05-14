"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BentoGrid from "@/components/dashboard/BentoGrid";
import JobCard from "@/components/jobs/JobCard";

export default function ArchivePage() {
  const { status } = useSession();
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFilter, setCurrentFilter] = useState("All Archived");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchArchive = async () => {
        try {
          const res = await fetch("/api/jobs");
          if (!res.ok) throw new Error("Failed to load archive");
          const data = await res.json();
          setJobs(data.filter((j) => j.status === 'archived' || j.status === 'rejected'));
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchArchive();
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#2B2D3B] text-white p-6 font-sans">
        <div className="max-w-7xl mx-auto space-y-6 pt-24">
          <div className="h-10 w-48 bg-white/5 animate-pulse rounded-sm"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-[#494C65] animate-pulse border border-white/10"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen bg-[#2B2D3B] flex items-center justify-center text-red-500 font-sans">{error}</div>;
  }

  const handleRestore = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/jobs/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" })
      });
      if (res.ok) {
        setJobs(jobs.filter((j) => (j._id || j.id) !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (currentFilter === "All Archived") return true;
    if (currentFilter === "Rejected") return job.status === "rejected";
    const isAutoArchived = job.timeline?.some(t => t.event.includes("Auto-archived"));
    if (currentFilter === "Auto-archived") return isAutoArchived;
    if (currentFilter === "Manually Archived") return job.status === "archived" && !isAutoArchived;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#2B2D3B] text-white p-6 font-sans selection:bg-[#DDDE68]/30">
      <div className="max-w-7xl mx-auto pt-24">
        <header className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-white">Archive</h1>
          <p className="text-gray-400 mt-1 text-sm">Past applications and dead leads</p>
        </header>

        <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {["All Archived", "Auto-archived", "Rejected", "Manually Archived"].map((f) => (
            <button
              key={f}
              onClick={() => setCurrentFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-none transition-all duration-200 cursor-pointer whitespace-nowrap ${
                currentFilter === f
                  ? "bg-[#DDDE68] text-[#1E2030] shadow-[3px_3px_0px_rgba(0,0,0,0.5)] border border-[#DDDE68]"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filteredJobs.length > 0 ? (
          <BentoGrid>
            {filteredJobs.map((job) => (
              <div key={job.id || job._id} className="relative group grayscale-[20%] opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                <JobCard job={job} />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={(e) => handleRestore(e, job.id || job._id)}
                    className="bg-[#DDDE68] text-[#1E2030] px-3 py-1.5 text-xs font-bold shadow-[2px_2px_0px_rgba(0,0,0,0.5)] hover:-translate-y-[1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,0.5)] transition-all"
                  >
                    Restore
                  </button>
                </div>
              </div>
            ))}
          </BentoGrid>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-white/10">
            <svg className="w-12 h-12 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <h3 className="text-lg font-bold text-white mb-1">Archive is empty</h3>
            <p className="text-gray-400 text-sm max-w-sm">No jobs found in this view.</p>
          </div>
        )}
      </div>
    </div>
  );
}
