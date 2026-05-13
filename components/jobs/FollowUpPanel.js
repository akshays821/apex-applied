"use client";

import React, { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { motion } from "framer-motion"; // explicitly mentioned Framer Motion only for specific cases, one is "success flash"

export default function FollowUpPanel({ job, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [locking, setLocking] = useState(false);
  const [checklistLoading, setChecklistLoading] = useState(false);
  const [successPulse, setSuccessPulse] = useState(false);

  const handleMarkDone = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs/${job._id}/followup`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        setSuccessPulse(true);
        setTimeout(() => setSuccessPulse(false), 300);
        const updated = await res.json();
        if (onUpdate) onUpdate(updated.job || updated);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLock = async () => {
    setLocking(true);
    try {
      const res = await fetch(`/api/jobs/${job._id}/lock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isLocked: !job.isLocked })
      });
      if (res.ok) {
        const updated = await res.json();
        if (onUpdate) onUpdate(updated.job || updated);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLocking(false);
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

  const calculateUrgency = () => {
    if (job.status !== "active") return { color: "bg-gray-500", text: "Inactive", borderColor: "border-gray-500" };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const followUp = new Date(job.followUpDate);
    followUp.setHours(0, 0, 0, 0);

    if (followUp < today) return { color: "bg-red-500", text: "Overdue", borderColor: "border-red-500" };
    if (followUp.getTime() === today.getTime()) return { color: "bg-amber-500", text: "Due Today", borderColor: "border-amber-500" };
    return { color: "bg-green-500", text: "On Track", borderColor: "border-green-500" };
  };

  const urgency = calculateUrgency();

  return (
    <Card className={`p-6 h-full flex flex-col justify-between transition-colors border-l-4 ${urgency.borderColor} !cursor-default !hover:translate-x-0 !hover:translate-y-0 !hover:shadow-[4px_4px_0px_#F59E0B]`}>
      <div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">Follow-up Engine</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className={`w-2 h-2 rounded-full ${urgency.color}`}></span>
              <span className={`text-sm font-medium ${urgency.color.replace('bg-', 'text-')}`}>
                {urgency.text}
              </span>
            </div>
          </div>
          <button
            onClick={handleToggleLock}
            disabled={locking}
            className={`p-2 rounded-sm border transition-all ${
              job.isLocked 
                ? "bg-amber-500/20 text-amber-500 border-amber-500/50" 
                : "bg-transparent text-gray-500 border-white/10 hover:text-white"
            }`}
            title={job.isLocked ? "Unlock Auto-Archive" : "Lock from Auto-Archive"}
          >
            {job.isLocked ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
              </svg>
            )}
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-500 mb-1">Target Date</p>
          <p className="text-lg text-white font-medium">
            {new Date(job.followUpDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm font-semibold text-gray-500">Checklist</p>
          {['called', 'whatsappSent', 'emailSent'].map((field) => (
            <label key={field} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={!!job.followUpChecklist?.[field]}
                onChange={() => handleChecklistToggle(field)}
                disabled={checklistLoading}
                className="w-4 h-4 rounded-sm border-white/20 bg-[#111111] text-amber-500 focus:ring-amber-500 focus:ring-1 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors capitalize">
                {field.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </label>
          ))}
        </div>
      </div>

      <motion.div animate={successPulse ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 0.3 }}>
        <Button 
          className="w-full" 
          onClick={handleMarkDone}
          disabled={loading || job.status !== "active"}
        >
          {loading ? "Updating..." : "Mark Follow-up Done"}
        </Button>
      </motion.div>
    </Card>
  );
}
