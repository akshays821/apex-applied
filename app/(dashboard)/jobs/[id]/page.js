"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import RecruiterContact from "@/components/jobs/RecruiterContact";
import FollowUpPanel from "@/components/jobs/FollowUpPanel";
import JobTimeline from "@/components/jobs/JobTimeline";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  useEffect(() => {
    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  const handleUpdate = (updatedJob) => {
    setJob(updatedJob);
  };

  const handleStatusChange = async (status) => {
    try {
      const res = await fetch(`/api/jobs/${job._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setJob(updated.job || updated);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/jobs/${job._id}`, { method: "DELETE" });
      if (res.ok) router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center pb-6 border-b border-white/10">
            <div className="space-y-4">
              <div className="h-8 w-64 bg-white/5 animate-pulse rounded-sm"></div>
              <div className="h-4 w-48 bg-white/5 animate-pulse rounded-sm"></div>
            </div>
            <div className="h-10 w-32 bg-white/5 animate-pulse rounded-sm"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 w-full bg-white/5 animate-pulse rounded-sm"></div>
              <div className="h-32 w-full bg-white/5 animate-pulse rounded-sm"></div>
            </div>
            <div className="space-y-6">
              <div className="h-64 w-full bg-white/5 animate-pulse rounded-sm"></div>
              <div className="h-48 w-full bg-white/5 animate-pulse rounded-sm"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-red-500">{error}</div>;
  if (!job) return null;

  const daysSinceApplied = Math.floor((new Date() - new Date(job.appliedDate)) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Fullscreen Screenshot Modal */}
      {isFullscreen && job.screenshotUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out backdrop-blur-sm"
          onClick={() => setIsFullscreen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={job.screenshotUrl} 
            alt="Full size screenshot" 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header & Status Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">{job.roleTitle}</h1>
              <Badge variant={job.status}>{job.status}</Badge>
            </div>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span className="font-semibold text-gray-200">{job.companyName}</span>
              <span>•</span>
              <span className="bg-white/5 px-2 py-0.5 rounded-sm border border-white/10">{job.platform}</span>
              <span>•</span>
              <span>Applied {daysSinceApplied === 0 ? "today" : `${daysSinceApplied} days ago`}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="secondary" onClick={() => router.push(`/jobs/${job._id}/edit`)}>Edit</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Details & Screenshot */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Screenshot */}
            {job.screenshotUrl && (
              <div 
                className="relative aspect-video w-full rounded-sm overflow-hidden border border-white/10 shadow-[4px_4px_0px_#111111] group cursor-zoom-in"
                onClick={() => setIsFullscreen(true)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={job.screenshotUrl} 
                  alt="Job description screenshot" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                  <span className="bg-[#111111] text-white px-4 py-2 rounded-sm font-semibold border border-white/20 shadow-[2px_2px_0px_#F59E0B]">
                    View Fullscreen
                  </span>
                </div>
              </div>
            )}

            {/* Job Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white/5 rounded-sm border border-white/10 backdrop-blur-md">
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Date Applied</p>
                <p className="text-gray-200">{new Date(job.appliedDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Salary</p>
                <p className="text-gray-200">{job.salaryRange || "Not specified"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Job URL</p>
                {job.jobUrl ? (
                  <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline break-all line-clamp-1">
                    {job.jobUrl}
                  </a>
                ) : (
                  <p className="text-gray-500">No URL provided</p>
                )}
              </div>
              {job.tags?.length > 0 && (
                <div className="col-span-full pt-4 mt-2 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 text-xs font-medium rounded-sm border border-white/10 bg-[#111111] text-gray-300">
                        {tag.replace('nightshift', 'Night Shift')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status Controls */}
            <div className="p-6 bg-[#111111] rounded-sm border border-white/10 shadow-[4px_4px_0px_#000000]">
              <h3 className="text-lg font-bold text-white mb-4">Move Pipeline Stage</h3>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant={job.status === "responded" ? "primary" : "secondary"} 
                  onClick={() => handleStatusChange("responded")}
                >
                  Responded
                </Button>
                <Button 
                  variant={job.status === "rejected" ? "primary" : "secondary"} 
                  className={job.status === "rejected" ? "bg-gray-500 border-gray-600 shadow-[3px_3px_0px_rgba(0,0,0,0.8)] text-white" : "border-gray-500 text-gray-400 hover:shadow-[4px_4px_0px_rgba(107,114,128,0.5)] active:shadow-[1px_1px_0px_rgba(107,114,128,0.5)]"}
                  onClick={() => handleStatusChange("rejected")}
                >
                  Rejected
                </Button>
                <Button 
                  variant={job.status === "archived" ? "primary" : "secondary"} 
                  className={job.status === "archived" ? "bg-zinc-800 border-zinc-700 shadow-[3px_3px_0px_rgba(0,0,0,0.8)] text-white" : "border-zinc-700 text-zinc-500 hover:shadow-[4px_4px_0px_rgba(63,63,70,0.5)] active:shadow-[1px_1px_0px_rgba(63,63,70,0.5)]"}
                  onClick={() => handleStatusChange("archived")}
                >
                  Archive
                </Button>
                {job.status !== "active" && (
                  <Button 
                    variant="secondary"
                    className="border-green-500 text-green-500 hover:shadow-[4px_4px_0px_rgba(34,197,94,0.5)] active:shadow-[1px_1px_0px_rgba(34,197,94,0.5)]"
                    onClick={() => handleStatusChange("active")}
                  >
                    Move to Active
                  </Button>
                )}
              </div>
            </div>

            {/* Notes */}
            {job.notes && (
              <div className="p-6 bg-white/5 rounded-sm border border-white/10 backdrop-blur-md">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Notes</h3>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{job.notes}</p>
              </div>
            )}

            {/* Timeline */}
            <JobTimeline jobId={job._id} timeline={job.timeline} onUpdate={handleUpdate} />

          </div>

          {/* Right Column - Side Panels */}
          <div className="space-y-6">
            <FollowUpPanel job={job} onUpdate={handleUpdate} />
            <RecruiterContact recruiter={job.recruiter} />
          </div>

        </div>
      </div>
    </div>
  );
}
