"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-amber-500/30">
      {/* 1. Navbar */}
      <nav className="flex items-center justify-between py-6 px-6 md:px-12 max-w-7xl mx-auto w-full border-b border-white/5">
        <div className="font-bold text-2xl tracking-tighter text-white">
          Apex<span className="text-amber-500">Applied</span>
        </div>
        <Link href="/auth/signin">
          <Button variant="secondary" size="sm">
            Sign In
          </Button>
        </Link>
      </nav>

      <main>
        {/* 2. Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center text-center px-6 pt-32 pb-24 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Stop Getting <span className="text-amber-500">Ghosted.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
            The job tracker built for aggressive job seekers. Apply everywhere,
            never lose track, and follow up exactly when you need to.
          </p>
          <Link href="/auth/signin">
            <Button size="lg" className="text-lg px-8 py-4">
              Get Started with Google
            </Button>
          </Link>
        </motion.section>

        {/* 3. Problem Section */}
        <section className="px-6 py-24 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">
              You apply. You forget. You get ghosted.
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 text-left group">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  The Black Hole
                </h3>
                <p className="text-gray-400">
                  You apply to 50 jobs a week and completely lose track of who
                  you applied to, where, and when.
                </p>
              </Card>

              <Card className="p-8 text-left group">
                <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Missed Windows
                </h3>
                <p className="text-gray-400">
                  You forget to follow up with recruiters, missing the critical
                  5-day window to stay top of mind.
                </p>
              </Card>

              <Card className="p-8 text-left group">
                <div className="w-12 h-12 bg-gray-500/10 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Silent Rejections
                </h3>
                <p className="text-gray-400">
                  Jobs stay "active" in your head for months instead of being
                  auto-archived when they go cold.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* 4. Features Section (Bento Grid) */}
        <section className="px-6 py-24 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">
            Everything you need to land the offer.
          </h2>
          <div className="grid md:grid-cols-3 md:grid-rows-2 gap-6">
            <Card className="md:col-span-2 p-8 flex flex-col justify-end min-h-[320px] bg-gradient-to-br from-amber-500/5 to-transparent">
              <div className="flex-1 w-full flex items-center justify-center mb-8">
                {/* Abstract graphic */}
                <div className="w-full max-w-sm border border-white/10 rounded-md p-4 bg-[#0a0a0a] shadow-[4px_4px_0px_rgba(245,158,11,0.2)]">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <div className="h-2 w-24 bg-white/20 rounded"></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="h-2 w-32 bg-white/20 rounded"></div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Follow-up Engine
                </h3>
                <p className="text-gray-400 max-w-md">
                  Urgency states tell you exactly who to contact today. Complete
                  checklists to mark follow-ups done and auto-schedule the next
                  one.
                </p>
              </div>
            </Card>

            <Card className="p-8 flex flex-col justify-end min-h-[320px]">
              <div className="flex-1 flex items-center justify-center mb-8">
                <svg
                  className="w-16 h-16 text-white/20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Job Cards</h3>
                <p className="text-gray-400">
                  Store salary, contacts, and URLs in one neo-brutalist view.
                </p>
              </div>
            </Card>

            <Card className="p-8 flex flex-col justify-end min-h-[320px]">
              <div className="flex-1 flex items-center justify-center mb-8">
                <svg
                  className="w-16 h-16 text-white/20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Auto-Archive
                </h3>
                <p className="text-gray-400">
                  Jobs automatically move to archived after 30 days of silence.
                </p>
              </div>
            </Card>

            <Card className="md:col-span-2 p-8 flex flex-col justify-end min-h-[320px] bg-gradient-to-tr from-white/5 to-transparent">
              <div className="flex-1 flex items-center justify-center mb-8">
                <svg
                  className="w-16 h-16 text-white/20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Screenshot Upload
                </h3>
                <p className="text-gray-400 max-w-md">
                  Job descriptions get deleted. Upload a screenshot to Cloudinary
                  and never lose the original role requirements.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* 5. How it works */}
        <section className="px-6 py-24 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-20">
              How it works
            </h2>
            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-white/10 z-0"></div>

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-sm border-2 border-amber-500 bg-[#0a0a0a] text-amber-500 font-bold flex items-center justify-center mx-auto mb-6 text-xl shadow-[4px_4px_0px_rgba(245,158,11,0.5)]">
                  1
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Add Job</h3>
                <p className="text-gray-400">
                  Save the job details, recruiter info, and upload a screenshot.
                </p>
              </div>

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-sm border-2 border-amber-500 bg-[#0a0a0a] text-amber-500 font-bold flex items-center justify-center mx-auto mb-6 text-xl shadow-[4px_4px_0px_rgba(245,158,11,0.5)]">
                  2
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Track Follow-ups
                </h3>
                <p className="text-gray-400">
                  Check your dashboard daily. Overdue and due-today jobs float
                  to the top.
                </p>
              </div>

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-sm border-2 border-amber-500 bg-[#0a0a0a] text-amber-500 font-bold flex items-center justify-center mx-auto mb-6 text-xl shadow-[4px_4px_0px_rgba(245,158,11,0.5)]">
                  3
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Never Miss a Callback
                </h3>
                <p className="text-gray-400">
                  Execute your follow-ups, update the status, and get the
                  interview.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CTA Bottom */}
        <section className="px-6 py-32 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-10 tracking-tight">
            Ready to take control of your search?
          </h2>
          <Link href="/auth/signin">
            <Button size="lg" className="text-lg px-8 py-4">
              Get Started with Google
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Apex Applied. All rights reserved.</p>
      </footer>
    </div>
  );
}
