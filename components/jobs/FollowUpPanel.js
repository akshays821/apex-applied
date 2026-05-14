"use client";

import React, { useState } from "react";
import { getUrgencyState, getStatusColor } from "@/lib/utils";

export default function FollowUpPanel({ job, onUpdate, accentColor }) {
  const [loading, setLoading] = useState(false);
  const [checklistLoading, setChecklistLoading] = useState(false);

  const handleMarkDone = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs/${job._id}/followup`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        const updated = await res.json();
        if (onUpdate) onUpdate(updated.job || updated);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChecklistToggle = async (field) => {
    setChecklistLoading(true);
    try {
      const payload = {
        ...job.followUpChecklist,
        [field]: !job.followUpChecklist?.[field]
      };
      const res = await fetch(`/api/jobs/${job._id}/checklist`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updated = await res.json();
        if (onUpdate) onUpdate(updated.job || updated);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setChecklistLoading(false);
    }
  };

  const urgency = getUrgencyState(job.followUpDate, job.status);
  const statusColor = getStatusColor(job.status, urgency);

  return (
    <div className="bg-[#494C65] rounded-sm shadow-[3px_3px_0px_rgba(0,0,0,0.4)] p-6 border border-white/10 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-xl font-bold text-white">Follow-up Engine</h3>
          {job.status === "active" && (
            <span 
              className="px-2 py-0.5 text-xs font-bold uppercase rounded-sm"
              style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
            >
              {urgency?.replace("_", " ")}
            </span>
          )}
        </div>

        <div className="mb-8">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Target Date</p>
          <p className="text-xl text-white font-medium">
            {new Date(job.followUpDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Checklist</p>
          {['called', 'whatsappSent', 'emailSent'].map((field) => (
            <label key={field} className="flex items-center gap-3 cursor-pointer group w-fit">
              <div 
                className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-colors ${job.followUpChecklist?.[field] ? 'border-transparent' : 'border-gray-500 bg-[#2B2D3B]'}`}
                style={{ backgroundColor: job.followUpChecklist?.[field] ? accentColor : undefined }}
              >
                {job.followUpChecklist?.[field] && (
                  <svg className="w-3.5 h-3.5 text-[#1E2030]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors capitalize">
                {field.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button 
        onClick={handleMarkDone}
        disabled={loading || job.status !== "active"}
        className="w-full py-3 mt-4 bg-[#DDDE68] text-[#1E2030] font-bold rounded-sm shadow-[3px_3px_0px_rgba(0,0,0,0.4)] transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {loading ? "Updating..." : "Mark Follow-up Done"}
      </button>
    </div>
  );
}
