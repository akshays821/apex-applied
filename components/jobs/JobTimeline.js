"use client";

import React, { useState } from "react";

export default function JobTimeline({ jobId, timeline = [], onUpdate, accentColor = "#DDDE68" }) {
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
        body: JSON.stringify({ event, type: 'manual' })
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

  const filteredTimeline = timeline.filter(t => t.type === 'auto' || t.type === 'manual');

  return (
    <div className="bg-[#494C65] rounded-sm shadow-[3px_3px_0px_rgba(0,0,0,0.4)] p-6 border border-white/10 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-white mb-6">Activity Log</h3>
        
        <div className="space-y-6 mb-8 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-white/10">
          {filteredTimeline.map((entry, index) => (
            <div key={entry._id || index} className="relative flex items-start gap-4">
              <div 
                className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-[#494C65] shadow shrink-0 relative z-10"
                style={{ backgroundColor: entry.type === 'manual' ? accentColor : '#676386' }}
              >
                <svg className="w-3 h-3 text-[#1E2030]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {entry.type === 'manual' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  )}
                </svg>
              </div>
              <div className="flex-1 bg-white/5 p-4 rounded-sm border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold uppercase tracking-wide ${entry.type === 'manual' ? 'text-white' : 'text-gray-400'}`}>
                    {entry.type === 'manual' ? 'Note' : 'System'}
                  </span>
                  <time className="text-xs text-gray-500 font-medium">
                    {new Date(entry.createdAt).toLocaleDateString()} {new Date(entry.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </time>
                </div>
                <p className="text-gray-200 text-sm mt-2">{entry.event}</p>
              </div>
            </div>
          ))}
          {filteredTimeline.length === 0 && (
            <p className="text-gray-500 text-center italic text-sm pl-8">No timeline events yet.</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 mt-auto">
        <input
          type="text"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          placeholder="Add manual note..."
          className="flex-1 bg-[#2B2D3B] text-white border border-white/10 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-white/30"
        />
        <button 
          type="submit" 
          disabled={loading || !event.trim()} 
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-sm transition-colors disabled:opacity-50"
        >
          Add Note
        </button>
      </form>
    </div>
  );
}
