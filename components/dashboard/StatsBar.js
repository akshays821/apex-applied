import React from "react";
import Card from "@/components/ui/Card";
import { getUrgencyState } from "@/lib/utils";

export default function StatsBar({ jobs = [] }) {
  const totalApplied = jobs.length;
  const active = jobs.filter((j) => j.status === "active").length;
  const followUpToday = jobs.filter((j) => {
    const urgency = getUrgencyState(j.followUpDate, j.status);
    return urgency === "DUE_TODAY" || urgency === "OVERDUE";
  }).length;
  const responses = jobs.filter((j) => j.status === "responded").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card className="p-4 text-center">
        <h4 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">
          Total Applied
        </h4>
        <div className="text-3xl font-bold text-white">{totalApplied}</div>
      </Card>
      <Card className="p-4 text-center">
        <h4 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">
          Active
        </h4>
        <div className="text-3xl font-bold text-white">{active}</div>
      </Card>
      <Card className="p-4 text-center">
        <h4 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">
          Follow Up Today
        </h4>
        <div className="text-3xl font-bold text-amber-500">{followUpToday}</div>
      </Card>
      <Card className="p-4 text-center">
        <h4 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">
          Responses
        </h4>
        <div className="text-3xl font-bold text-white">{responses}</div>
      </Card>
    </div>
  );
}
