"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BentoGrid from "@/components/dashboard/BentoGrid";
import JobCard from "@/components/jobs/JobCard";
import Button from "@/components/ui/Button";

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
      <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-10 w-48 bg-white/5 animate-pulse rounded-sm"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-white/5 animate-pulse rounded-sm"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-red-500">{error}</div>;
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
    // Check timeline for auto vs manual archive
    const isAutoArchived = job.timeline?.some(t => t.event.includes("Auto-archived"));
    if (currentFilter === "Auto-archived") return isAutoArchived;
    if (currentFilter === "Manually Archived") return job.status === "archived" && !isAutoArchived;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Archive</h1>
          <p className="text-gray-400 mt-1">Review past applications and dead leads</p>
        </header>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {["All Archived", "Auto-archived", "Rejected", "Manually Archived"].map((f) => (
            <button
              key={f}
              onClick={() => setCurrentFilter(f)}
              className={`px-4 py-2 rounded-sm text-sm font-semibold whitespace-nowrap transition-all ${
                currentFilter === f
                  ? "bg-white text-black shadow-[2px_2px_0px_#F59E0B]"
                  : "bg-[#111111] text-gray-400 border border-white/10 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filteredJobs.length > 0 ? (
          <BentoGrid>
            {filteredJobs.map((job) => (
              <div key={job.id || job._id} className="relative group">
                <JobCard job={job} />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Button size="sm" variant="secondary" className="bg-black/50 backdrop-blur-sm hover:bg-black/80 text-white" onClick={(e) => handleRestore(e, job.id || job._id)}>
                    Restore
                  </Button>
                </div>
              </div>
            ))}
          </BentoGrid>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-white/10 rounded-sm">
            <h3 className="text-xl font-bold text-white mb-2">Archive empty</h3>
            <p className="text-gray-400 max-w-sm mb-6">No jobs found in this view.</p>
          </div>
        )}
      </div>
    </div>
  );
}
