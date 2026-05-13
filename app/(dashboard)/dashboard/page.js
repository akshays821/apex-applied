"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import StatsBar from "@/components/dashboard/StatsBar";
import FilterBar from "@/components/dashboard/FilterBar";
import BentoGrid from "@/components/dashboard/BentoGrid";
import JobCard from "@/components/jobs/JobCard";
import { getUrgencyState } from "@/lib/utils";

function DashboardContent() {
  const { status } = useSession();
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("Active");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      const initDashboard = async () => {
        try {
          // 1. Run auto-archive logic first
          await fetch("/api/jobs/check-archive");

          // 2. Fetch all jobs
          const res = await fetch("/api/jobs");
          if (!res.ok) throw new Error("Failed to load jobs");
          const data = await res.json();
          setJobs(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      initDashboard();
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="h-10 w-48 bg-white/5 animate-pulse rounded-sm"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white/5 animate-pulse rounded-sm"></div>)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-48 bg-white/5 animate-pulse rounded-sm"></div>)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-red-500">{error}</div>;
  }

  // Filter Logic
  const filteredJobs = jobs.filter((job) => {
    if (currentFilter === "All") return true;
    if (currentFilter === "Active") return job.status === "active";
    if (currentFilter === "Responded") return job.status === "responded";
    if (currentFilter === "Archived") return job.status === "archived";
    if (currentFilter === "Following Up") {
      const urgency = getUrgencyState(job.followUpDate, job.status);
      return urgency === "OVERDUE" || urgency === "DUE_TODAY";
    }
    return true;
  });

  // Sort Logic: Overdue -> Due Today -> On Track -> by appliedDate desc
  filteredJobs.sort((a, b) => {
    const urgencyWeight = {
      OVERDUE: 3,
      DUE_TODAY: 2,
      ON_TRACK: 1,
      null: 0,
    };

    const aUrgency = getUrgencyState(a.followUpDate, a.status);
    const bUrgency = getUrgencyState(b.followUpDate, b.status);

    const aWeight = urgencyWeight[aUrgency] || 0;
    const bWeight = urgencyWeight[bUrgency] || 0;

    if (aWeight !== bWeight) {
      return bWeight - aWeight; // Higher weight first
    }

    // Fallback: appliedDate desc
    return new Date(b.appliedDate) - new Date(a.appliedDate);
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-gray-400 mt-1">Track and manage your applications</p>
          </div>
          <Link href="/jobs/new">
            <Button size="lg" className="px-6 py-3 shadow-[4px_4px_0px_#000]">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Job
            </Button>
          </Link>
        </header>

        <StatsBar jobs={jobs} />
        
        <FilterBar currentFilter={currentFilter} setFilter={setCurrentFilter} />

        {filteredJobs.length > 0 ? (
          <BentoGrid>
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </BentoGrid>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-white/10 rounded-sm">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No jobs found</h3>
            <p className="text-gray-400 max-w-sm mb-6">
              {currentFilter === "All" 
                ? "Your pipeline is empty. Time to start aggressively applying." 
                : `You don't have any jobs in the ${currentFilter} view.`}
            </p>
            {currentFilter === "All" && (
              <Link href="/jobs/new">
                <Button>Add Your First Job</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
