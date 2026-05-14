"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#2B2D3B] text-gray-300 font-sans selection:bg-[#DDDE68]/30 overflow-x-hidden">
      {/* 1. Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-[#2B2D3B]/90 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-12 max-w-7xl mx-auto w-full">
          <div className="font-bold text-xl tracking-tighter text-white">
            Apex<span className="text-[#A5B2EB]">Applied</span>
          </div>
          <Link href="/auth/signin">
            <button className="bg-[#DDDE68] text-[#1E2030] px-6 py-2.5 font-bold text-sm shadow-[3px_3px_0px_rgba(0,0,0,0.5)] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_rgba(0,0,0,0.5)] transition-all">
              Sign In
            </button>
          </Link>
        </div>
      </nav>

      <main>
        {/* 2. Hero Section */}
        <section className="relative flex flex-col items-center text-center px-6 pt-40 pb-24 max-w-4xl mx-auto">
          {/* Radial gradient background */}
          <div className="absolute inset-0 top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(165,178,235,0.04)_0%,transparent_70%)] pointer-events-none" />

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white mb-2 z-10 flex flex-wrap justify-center gap-x-4">
            {["Stop", "getting", "ghosted."].map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="z-10 w-full"
          >
            <h2
              className="text-6xl md:text-7xl font-bold tracking-tight mb-8"
              style={{
                background: "linear-gradient(90deg, #DDDE68, #A5B2EB, #DA935D)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Land the offer.
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed">
              The job tracker built for aggressive job seekers. Apply everywhere,
              never lose track, and follow up exactly when you need to.
            </p>

            <Link href="/auth/signin">
              <button className="bg-[#DDDE68] text-[#1E2030] text-lg px-8 py-4 font-bold shadow-[4px_4px_0px_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,0.5)] transition-all">
                Get Started with Google
              </button>
            </Link>
            <p className="mt-6 text-sm text-gray-500 font-medium">
              Built by a job seeker, for job seekers
            </p>
          </motion.div>
        </section>

        {/* 3. Problem Section */}
        <section className="px-6 py-24 bg-[#1E2030]/30 border-y border-white/5">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 tracking-tight">
              You apply. You forget. You get ghosted.
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-[#DDDE68] p-8 text-[#1E2030] text-left shadow-[6px_6px_0px_rgba(0,0,0,0.3)] transition-transform hover:-translate-y-1">
                <svg className="w-10 h-10 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-2xl font-bold mb-3">The Black Hole</h3>
                <p className="font-medium text-[#1E2030]/80 leading-relaxed">
                  You apply to 50 jobs a week and completely lose track of who
                  you applied to, where, and when.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-[#DA935D] p-8 text-[#1E2030] text-left shadow-[6px_6px_0px_rgba(0,0,0,0.3)] transition-transform hover:-translate-y-1">
                <svg className="w-10 h-10 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-2xl font-bold mb-3">Missed Windows</h3>
                <p className="font-medium text-[#1E2030]/80 leading-relaxed">
                  You forget to follow up with recruiters, missing the critical
                  5-day window to stay top of mind.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-[#676386] p-8 text-white text-left shadow-[6px_6px_0px_rgba(0,0,0,0.3)] transition-transform hover:-translate-y-1">
                <svg className="w-10 h-10 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <h3 className="text-2xl font-bold mb-3">Silent Rejections</h3>
                <p className="font-medium text-white/80 leading-relaxed">
                  Jobs stay "active" in your head for months instead of being
                  auto-archived when they go cold.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Features Section (Bento Grid) */}
        <section className="px-6 py-24 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center tracking-tight">
            Everything you need to land the offer.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Large card (col-span-2) */}
            <div className="md:col-span-2 bg-[#494C65] border-l-[4px] border-[#DDDE68] p-8 flex flex-col justify-between shadow-[6px_6px_0px_rgba(0,0,0,0.3)] transition-transform hover:-translate-y-1 min-h-[360px]">
              <div className="mb-8 p-6 bg-[#2B2D3B] border border-white/10 rounded-sm flex flex-col gap-3 shadow-inner">
                {/* Mock UI of urgency states */}
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-sm text-sm font-semibold flex items-center justify-between">
                  <span>Overdue Follow-up</span>
                  <span className="text-xs opacity-80">2 days ago</span>
                </div>
                <div className="bg-[#DA935D]/10 border border-[#DA935D]/20 text-[#DA935D] px-4 py-3 rounded-sm text-sm font-semibold flex items-center justify-between">
                  <span>Due Today</span>
                  <span className="text-xs opacity-80">Today</span>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-sm text-sm font-semibold flex items-center justify-between">
                  <span>On Track</span>
                  <span className="text-xs opacity-80">In 3 days</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Follow-up Engine</h3>
                <p className="text-gray-400 max-w-lg leading-relaxed">
                  Urgency states tell you exactly who to contact today. Complete
                  checklists to mark follow-ups done and auto-schedule the next
                  one.
                </p>
              </div>
            </div>

            {/* Job Cards */}
            <div className="bg-[#494C65] border-l-[4px] border-[#A5B2EB] p-8 flex flex-col justify-between shadow-[6px_6px_0px_rgba(0,0,0,0.3)] transition-transform hover:-translate-y-1 min-h-[360px]">
              <div className="flex-1 flex items-center justify-center mb-8">
                <svg className="w-16 h-16 text-[#A5B2EB]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Job Cards</h3>
                <p className="text-gray-400 leading-relaxed">
                  Store salary, contacts, and URLs in one neo-brutalist view.
                </p>
              </div>
            </div>

            {/* Auto-Archive */}
            <div className="bg-[#494C65] border-l-[4px] border-[#DA935D] p-8 flex flex-col justify-between shadow-[6px_6px_0px_rgba(0,0,0,0.3)] transition-transform hover:-translate-y-1 min-h-[360px]">
              <div className="flex-1 flex items-center justify-center mb-8">
                <svg className="w-16 h-16 text-[#DA935D]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Auto-Archive</h3>
                <p className="text-gray-400 leading-relaxed">
                  Jobs automatically move to archived after 30 days of silence.
                </p>
              </div>
            </div>

            {/* Screenshot Upload (col-span-2) */}
            <div className="md:col-span-2 bg-[#494C65] border-l-[4px] border-[#7CCDE5] p-8 flex flex-col justify-between shadow-[6px_6px_0px_rgba(0,0,0,0.3)] transition-transform hover:-translate-y-1 min-h-[360px]">
              <div className="flex-1 flex items-center justify-center mb-8">
                <svg className="w-16 h-16 text-[#7CCDE5]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Screenshot Upload</h3>
                <p className="text-gray-400 max-w-lg leading-relaxed">
                  Job descriptions get deleted. Upload a screenshot to Cloudinary
                  and never lose the original role requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. How it works */}
        <section className="px-6 py-32 bg-[#1E2030] relative overflow-hidden">
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-20 tracking-tight">
              How it works
            </h2>
            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-8 left-[16%] right-[16%] border-t-2 border-dashed border-white/10 z-0"></div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="text-6xl font-bold text-[#DDDE68] mb-6 drop-shadow-[0_0_20px_rgba(221,222,104,0.15)] bg-[#1E2030] px-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Add Job</h3>
                <p className="text-gray-400 max-w-xs leading-relaxed">
                  Save the job details, recruiter info, and upload a screenshot.
                </p>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="text-6xl font-bold text-[#A5B2EB] mb-6 drop-shadow-[0_0_20px_rgba(165,178,235,0.15)] bg-[#1E2030] px-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Track Follow-ups</h3>
                <p className="text-gray-400 max-w-xs leading-relaxed">
                  Check your dashboard daily. Overdue and due-today jobs float to the top.
                </p>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="text-6xl font-bold text-[#DA935D] mb-6 drop-shadow-[0_0_20px_rgba(218,147,93,0.15)] bg-[#1E2030] px-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Land the Interview</h3>
                <p className="text-gray-400 max-w-xs leading-relaxed">
                  Execute your follow-ups, update the status, and get the interview.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CTA Bottom */}
        <section className="px-6 py-24 w-full">
          <div className="max-w-5xl mx-auto bg-[#494C65] p-16 text-center shadow-[8px_8px_0px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-10 tracking-tight relative z-10">
              Ready to take control of your search?
            </h2>
            <Link href="/auth/signin" className="relative z-10 inline-block">
              <button className="bg-[#DDDE68] text-[#1E2030] text-lg px-8 py-4 font-bold shadow-[4px_4px_0px_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,0.5)] transition-all">
                Start tracking for free
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* 7. Footer */}
      <footer className="border-t border-white/10 py-10 text-center text-gray-500 text-sm bg-[#1E2030]/50">
        <p>&copy; {new Date().getFullYear()} Apex Applied. All rights reserved.</p>
      </footer>
    </div>
  );
}
