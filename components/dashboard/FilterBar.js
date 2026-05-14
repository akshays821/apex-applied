import React from "react";

const FILTERS = ["All", "Active", "Following Up", "Responded", "Archived"];

export default function FilterBar({ currentFilter, setFilter }) {
  return (
    <div className="flex overflow-x-auto space-x-6 border-b border-white/10 mb-8 pb-px scrollbar-hide">
      {FILTERS.map((filter) => {
        const isActive = currentFilter === filter;
        return (
          <button
            key={filter}
            onClick={() => setFilter(filter)}
            className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors duration-200 relative ${
              isActive ? "text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {filter}
            {isActive && (
              <span className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-[#DDDE68]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
