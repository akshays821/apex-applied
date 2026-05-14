"use client";

import React from "react";
import { motion } from "framer-motion";
import { getUrgencyState } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export default function StatsBar({ jobs = [] }) {
  const totalApplied = jobs.length;
  const active = jobs.filter((j) => j.status === "active").length;
  const followUpToday = jobs.filter((j) => {
    const urgency = getUrgencyState(j.followUpDate, j.status);
    return urgency === "DUE_TODAY" || urgency === "OVERDUE";
  }).length;
  const responses = jobs.filter((j) => j.status === "responded").length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
    >
      <motion.div variants={itemVariants} className="p-5 flex flex-col items-center justify-center bg-[#DDDE68] text-[#1E2030] shadow-[3px_3px_0px_rgba(0,0,0,0.4)] rounded-sm">
        <div className="text-4xl font-bold mb-1">{totalApplied}</div>
        <h4 className="text-xs font-bold uppercase tracking-wider">Total Applied</h4>
      </motion.div>
      <motion.div variants={itemVariants} className="p-5 flex flex-col items-center justify-center bg-[#A5B2EB] text-[#1E2030] shadow-[3px_3px_0px_rgba(0,0,0,0.4)] rounded-sm">
        <div className="text-4xl font-bold mb-1">{active}</div>
        <h4 className="text-xs font-bold uppercase tracking-wider">Active</h4>
      </motion.div>
      <motion.div variants={itemVariants} className="p-5 flex flex-col items-center justify-center bg-[#DA935D] text-[#1E2030] shadow-[3px_3px_0px_rgba(0,0,0,0.4)] rounded-sm">
        <div className="text-4xl font-bold mb-1">{followUpToday}</div>
        <h4 className="text-xs font-bold uppercase tracking-wider">Follow Up Today</h4>
      </motion.div>
      <motion.div variants={itemVariants} className="p-5 flex flex-col items-center justify-center bg-[#7CCDE5] text-[#1E2030] shadow-[3px_3px_0px_rgba(0,0,0,0.4)] rounded-sm">
        <div className="text-4xl font-bold mb-1">{responses}</div>
        <h4 className="text-xs font-bold uppercase tracking-wider">Responses</h4>
      </motion.div>
    </motion.div>
  );
}
