"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import RecruiterContact from "@/components/jobs/RecruiterContact";
import FollowUpPanel from "@/components/jobs/FollowUpPanel";
import JobTimeline from "@/components/jobs/JobTimeline";
import { getStatusColor, getUrgencyState } from "@/lib/utils";

// Collapsible Section Component
function CollapsibleSection({ title, text }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white/5 border border-white/10 rounded-sm p-5 relative">
      <div 
        className="flex justify-between items-center cursor-pointer group" 
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider group-hover:text-white transition-colors">{title}</h3>
        <svg 
          className={`w-5 h-5 text-gray-500 group-hover:text-white transition-transform ${expanded ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      <div className={`mt-3 ${expanded ? 'max-h-none' : 'max-h-12 overflow-hidden relative'}`}>
        {text ? (
          <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
        ) : (
          <p className="text-gray-500 italic text-sm">No {title.toLowerCase()} added</p>
        )}
        
        {!expanded && text && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#494C65] to-transparent" />
        )}
      </div>
    </div>
  );
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  
  // New stage state
  const [newStage, setNewStage] = useState("");
  const [submittingStage, setSubmittingStage] = useState(false);

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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/jobs/${job._id}`, { method: "DELETE" });
      if (res.ok) router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddStage = async (e) => {
    e.preventDefault();
    if (!newStage.trim()) return;
    
    setSubmittingStage(true);
    try {
      const res = await fetch(`/api/jobs/${job._id}/timeline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: newStage, type: 'stage' })
      });
      if (res.ok) {
        setNewStage("");
        const updated = await res.json();
        setJob(updated.job || updated);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmittingStage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2B2D3B] text-white pt-24 flex justify-center">
        <div className="w-10 h-10 border-4 border-white/10 border-t-[#DDDE68] rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error) return <div className="min-h-screen bg-[#2B2D3B] flex items-center justify-center text-red-500">{error}</div>;
  if (!job) return null;

  const daysSinceApplied = Math.floor((new Date() - new Date(job.appliedDate)) / (1000 * 60 * 60 * 24));
  const urgency = getUrgencyState(job.followUpDate, job.status);
  const statusColor = getStatusColor(job.status, urgency);
  const accentColor = job.accentColor || '#A5B2EB';

  const stageEvents = job.timeline?.filter(t => t.type === 'stage') || [];

  return (
    <div className="min-h-screen bg-[#2B2D3B] text-white flex flex-col font-sans">
      {/* Fullscreen Screenshot Modal */}
      {isFullscreen && job.screenshotUrl && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsFullscreen(false)}
        >
          <img 
            src={job.screenshotUrl} 
            alt="Full size screenshot" 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      {/* STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-[#494C65] border-b border-white/10" style={{ borderLeft: `6px solid ${accentColor}` }}>
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">{job.companyName}</h1>
            <p className="text-sm text-gray-300 mb-2">{job.roleTitle}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="bg-white/10 px-2 py-1 rounded-sm uppercase tracking-wide font-semibold text-gray-300">
                {job.platform.replace('_', ' ')}
              </span>
              <span className="text-gray-400">
                {daysSinceApplied === 0 ? "Applied today" : `${daysSinceApplied} days since applied`}
              </span>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-full">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }}></span>
                <span className="font-semibold text-gray-300 capitalize" style={{ color: statusColor }}>{job.status}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => router.push(`/jobs/${job._id}/edit`)}>Edit</Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </div>

      {/* STICKY TAB BAR */}
      <div className="sticky top-[108px] sm:top-[100px] z-30 bg-[#2B2D3B] border-b border-white/10 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center gap-6 overflow-x-auto no-scrollbar">
          {["Overview", "Follow-up", "Recruiter", "Timeline"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-semibold transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white border-transparent'
              }`}
              style={{ borderBottomColor: activeTab === tab ? accentColor : 'transparent' }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT AREA */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "Overview" && (
              <div className="space-y-6">
                
                {/* A. Screenshot */}
                {job.screenshotUrl ? (
                  <div 
                    className="w-full aspect-video rounded-sm border border-white/10 overflow-hidden cursor-zoom-in group relative"
                    onClick={() => setIsFullscreen(true)}
                  >
                    <img src={job.screenshotUrl} alt="Job Screenshot" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-[#1E2030] text-white px-4 py-2 rounded-sm text-sm font-bold shadow-lg">Click to expand</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-sm border-2 border-dashed border-white/20 flex flex-col items-center justify-center bg-white/5">
                    <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="text-gray-400 text-sm font-semibold">Upload job screenshot via edit page</p>
                  </div>
                )}

                {/* B. Job Info Grid */}
                <div className="grid grid-cols-2 gap-4 bg-[#494C65] p-5 rounded-sm border border-white/10 shadow-[3px_3px_0px_rgba(0,0,0,0.4)]">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Applied Date</p>
                    <p className="text-white">{new Date(job.appliedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Salary</p>
                    <p className="text-white">{job.salaryRange || "Not specified"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Job URL</p>
                    {job.jobUrl ? (
                      <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="text-[#7CCDE5] hover:underline break-all">
                        {job.jobUrl}
                      </a>
                    ) : (
                      <p className="text-gray-500">No URL provided</p>
                    )}
                  </div>
                  {job.tags?.length > 0 && (
                    <div className="col-span-2 flex flex-wrap gap-2">
                      {job.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-white/10 text-white text-xs font-semibold rounded-sm tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* C. Application Journey */}
                <div className="bg-[#494C65] p-5 rounded-sm border border-white/10 shadow-[3px_3px_0px_rgba(0,0,0,0.4)]">
                  <h3 className="text-lg font-bold text-white mb-5">Application Journey</h3>
                  <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-white/10">
                    {stageEvents.map((stage, i) => (
                      <div key={i} className="relative flex items-start gap-4">
                        <div 
                          className="w-3 h-3 rounded-full mt-1.5 relative z-10 shrink-0" 
                          style={{ backgroundColor: accentColor, boxShadow: `0 0 0 4px #494C65` }}
                        />
                        <div>
                          <p className="text-white font-bold">{stage.event}</p>
                          <p className="text-xs text-gray-400">{new Date(stage.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                    {stageEvents.length === 0 && (
                      <p className="text-gray-500 italic text-sm mb-4">No stages added yet.</p>
                    )}
                  </div>

                  <form onSubmit={handleAddStage} className="mt-6 flex gap-3">
                    <input
                      type="text"
                      placeholder="E.g. Technical interview, Offer received..."
                      value={newStage}
                      onChange={(e) => setNewStage(e.target.value)}
                      className="flex-1 bg-[#2B2D3B] text-white px-3 py-2 rounded-sm border border-white/10 focus:outline-none focus:border-white/30 text-sm"
                    />
                    <button 
                      type="submit" 
                      disabled={submittingStage || !newStage.trim()}
                      className="px-4 py-2 bg-white/10 text-white font-bold text-sm rounded-sm hover:bg-white/20 transition-colors disabled:opacity-50"
                    >
                      Add Stage
                    </button>
                  </form>
                </div>

                {/* D. Notes & E. Interview Experience */}
                <CollapsibleSection title="Notes" text={job.notes} />
                <CollapsibleSection title="Interview Experience" text={job.interviewExperience} />

              </div>
            )}

            {activeTab === "Follow-up" && (
              <FollowUpPanel job={job} onUpdate={handleUpdate} accentColor={accentColor} />
            )}

            {activeTab === "Recruiter" && (
              <RecruiterContact recruiter={job.recruiter} accentColor={accentColor} />
            )}

            {activeTab === "Timeline" && (
              <JobTimeline jobId={job._id} timeline={job.timeline} onUpdate={handleUpdate} accentColor={accentColor} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
