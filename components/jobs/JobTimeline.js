"use client";

import React, { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function JobTimeline({ jobId, timeline = [], onUpdate }) {
  const [event, setEvent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!event.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/timeline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event })
      });
      if (res.ok) {
        setEvent("");
        const updated = await res.json();
        if (onUpdate) onUpdate(updated.job || updated);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 !cursor-default !hover:translate-x-0 !hover:translate-y-0 !hover:shadow-[4px_4px_0px_#F59E0B]">
      <h3 className="text-xl font-bold tracking-tight text-white mb-6">Activity Timeline</h3>
      
      <div className="space-y-6 mb-8 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-white/10">
        {timeline.map((entry, index) => (
          <div key={entry._id || index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-[#111111] bg-amber-500 text-black shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {entry.type === 'manual' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                )}
              </svg>
            </div>
            <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-sm border border-white/5 bg-white/5 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${entry.type === 'manual' ? 'bg-amber-500/10 text-amber-500' : 'bg-gray-500/10 text-gray-400'}`}>
                  {entry.type === 'manual' ? 'Note' : 'System'}
                </span>
                <time className="text-xs text-gray-500 font-mono">
                  {new Date(entry.createdAt).toLocaleDateString()} {new Date(entry.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </time>
              </div>
              <p className="text-gray-300 text-sm mt-2">{entry.event}</p>
            </div>
          </div>
        ))}
        {timeline.length === 0 && (
          <p className="text-gray-500 text-center italic text-sm">No timeline events yet.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          placeholder="Add manual note (e.g. Called recruiter, left voicemail)..."
          className="flex-1 bg-[#0a0a0a] text-white border border-white/10 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
        />
        <Button type="submit" disabled={loading || !event.trim()} size="sm">
          Add Note
        </Button>
      </form>
    </Card>
  );
}
