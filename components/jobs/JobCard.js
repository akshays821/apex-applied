"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { getDaysSince, getUrgencyState, getStatusColor } from "@/lib/utils";

export default function JobCard({ job }) {
  const router = useRouter();
  const daysSince = getDaysSince(job.appliedDate);
  const urgency = getUrgencyState(job.followUpDate, job.status);

  let displayBadge = null;

  if (job.status === "active") {
    if (urgency === "OVERDUE") displayBadge = "Overdue";
    else if (urgency === "DUE_TODAY") displayBadge = "Due Today";
    else if (urgency === "ON_TRACK") displayBadge = "On Track";
  } else if (job.status === "responded") {
    displayBadge = "Responded";
  } else if (job.status === "rejected") {
    displayBadge = "Rejected";
  } else if (job.status === "archived") {
    displayBadge = "Archived";
  }

  let isGoingCold = false;
  if (job.status === "active" && daysSince >= 20 && !job.isLocked) {
    displayBadge = "Going Cold";
    isGoingCold = true;
  }

  const bottomColor = getStatusColor(job.status, urgency);
  const isDimmed = job.status === "archived" || isGoingCold;

  return (
    <div
      onClick={() => router.push(`/jobs/${job.id || job._id}`)}
      className={`relative bg-[#494C65] rounded-sm cursor-pointer flex flex-col h-full transition-all duration-200 hover:-translate-y-[2px] shadow-sm hover:shadow-lg ${
        isDimmed ? "opacity-50 grayscale-[20%] hover:opacity-100 hover:grayscale-0" : ""
      }`}
      style={{ borderLeft: `4px solid ${job.accentColor || '#A5B2EB'}` }}
    >
      <div className="p-4 flex-1 flex flex-col">
        {/* Row 1 */}
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-white font-bold truncate pr-2">{job.companyName}</h3>
          {displayBadge && (
            <span 
              className="text-[10px] font-bold uppercase px-2 py-1 rounded-full whitespace-nowrap"
              style={{ backgroundColor: `${job.accentColor}20`, color: job.accentColor }}
            >
              {displayBadge}
            </span>
          )}
        </div>

        {/* Row 2 */}
        <p className="text-sm text-gray-300 mb-3 truncate">{job.roleTitle}</p>

        {/* Row 3 */}
        <div className="flex items-center justify-between mb-4 mt-auto">
          <span className="px-2 py-1 bg-white/10 text-xs rounded-sm font-medium tracking-wide">
            {job.platform?.replace("_", " ")}
          </span>
          <span className="text-xs text-gray-400 font-medium">
            {daysSince === 0 ? "Applied Today" : `${daysSince}d ago`}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-3 flex items-center">
          {/* Row 4 */}
          {job.recruiter?.name ? (
            <span className="flex items-center gap-1.5 text-xs text-gray-300 truncate">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {job.recruiter.name}
            </span>
          ) : (
            <span className="text-xs text-gray-500 italic">No recruiter info</span>
          )}
        </div>
      </div>

      {/* Bottom strip */}
      <div className="h-[2px] w-full" style={{ backgroundColor: bottomColor }} />
    </div>
  );
}
