import React from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getDaysSince, getUrgencyState } from "@/lib/utils";

export default function JobCard({ job }) {
  const router = useRouter();
  const daysSince = getDaysSince(job.appliedDate);
  const urgency = getUrgencyState(job.followUpDate, job.status);

  // Fallback badge text logic based on job status
  let displayBadge = null;
  let badgeVariant = "active";

  if (job.status === "active") {
    if (urgency === "OVERDUE") {
      displayBadge = "Overdue";
      badgeVariant = "overdue";
    } else if (urgency === "DUE_TODAY") {
      displayBadge = "Due Today";
      badgeVariant = "due_today";
    } else if (urgency === "ON_TRACK") {
      displayBadge = "On Track";
      badgeVariant = "active";
    }
  } else if (job.status === "responded") {
    displayBadge = "Responded";
    badgeVariant = "responded";
  } else if (job.status === "rejected") {
    displayBadge = "Rejected";
    badgeVariant = "rejected";
  } else if (job.status === "archived") {
    displayBadge = "Archived";
    badgeVariant = "archived";
  }

  // Handle "going cold" visual state roughly (days >= 20 and still active/no response)
  if (job.status === "active" && daysSince >= 20 && !job.isLocked) {
    displayBadge = "Going Cold";
    badgeVariant = "going_cold";
  }

  const isDimmed = job.status === "archived" || badgeVariant === "going_cold";

  return (
    <Card
      onClick={() => router.push(`/jobs/${job.id || job._id}`)}
      className={`p-5 flex flex-col h-full ${isDimmed ? "opacity-60 hover:opacity-100 transition-opacity" : ""}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-lg font-bold text-white truncate">
            {job.roleTitle}
          </h3>
          <p className="text-amber-500 font-semibold text-sm truncate">
            {job.companyName}
          </p>
        </div>
        {displayBadge && (
          <Badge variant={badgeVariant} className="flex-shrink-0">
            {displayBadge}
          </Badge>
        )}
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <span className="px-2 py-0.5 bg-white/10 text-gray-300 text-xs rounded uppercase font-semibold tracking-wide">
          {job.platform.replace("_", " ")}
        </span>
        <span className="text-gray-500 text-xs font-semibold">
          {daysSince === 0 ? "Applied Today" : `${daysSince}d ago`}
        </span>
      </div>

      <div className="mt-auto pt-4 border-t border-white/10">
        <p className="text-sm text-gray-400 truncate">
          {job.recruiter?.name ? (
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {job.recruiter.name}
            </span>
          ) : (
            <span className="italic text-gray-500">No recruiter info</span>
          )}
        </p>
      </div>
    </Card>
  );
}
