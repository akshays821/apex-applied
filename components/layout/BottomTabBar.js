"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BottomTabBar = () => {
  const pathname = usePathname();

  return (
    <div className="flex sm:hidden fixed bottom-0 left-0 w-full z-50 bg-[#1E2030] backdrop-blur-xl border-t border-white/10">
      <div className="flex items-center justify-between w-full px-6 py-3">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 ${
            pathname === '/dashboard' ? 'text-[#DDDE68]' : 'text-gray-500 hover:text-gray-400'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          {pathname === '/dashboard' && <span className="text-[10px] font-medium">Dashboard</span>}
        </Link>

        <Link
          href="/dashboard/add-job"
          className="flex items-center justify-center -mt-8 w-14 h-14 bg-[#DDDE68] rounded-none shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-4 border-[#1E2030] text-[#1E2030] transition-transform active:scale-95 hover:bg-[#c9ca5c]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Link>

        <Link
          href="/archive"
          className={`flex flex-col items-center gap-1 ${
            pathname === '/archive' ? 'text-[#DDDE68]' : 'text-gray-500 hover:text-gray-400'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          {pathname === '/archive' && <span className="text-[10px] font-medium">Archive</span>}
        </Link>
      </div>
    </div>
  );
};

export default BottomTabBar;
