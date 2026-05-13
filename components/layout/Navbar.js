"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") return <div className="h-16 bg-[#0a0a0a] border-b border-white/10" />;

  return (
    <nav className="h-16 border-b border-white/10 bg-[#111111]/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="text-xl font-bold text-white tracking-tight">
          Apex<span className="text-amber-500">Applied</span>
        </Link>
        <div className="hidden sm:flex gap-4">
          <Link 
            href="/dashboard" 
            className={`text-sm transition-colors ${pathname === '/dashboard' ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/archive" 
            className={`text-sm transition-colors ${pathname === '/archive' ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
          >
            Archive
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {session?.user && (
          <>
            {session.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt={session.user.name} className="w-8 h-8 rounded-full border border-white/10" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-sm">
                {session.user.name?.[0] || 'U'}
              </div>
            )}
            <button 
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </>
        )}
      </div>
      {/* Mobile nav links */}
      <div className="absolute bottom-0 left-0 w-full translate-y-full flex sm:hidden bg-[#111111] border-b border-white/10">
        <Link 
          href="/dashboard" 
          className={`flex-1 text-center py-2 text-sm transition-colors ${pathname === '/dashboard' ? 'text-amber-500 font-semibold border-b-2 border-amber-500' : 'text-gray-400 hover:text-white'}`}
        >
          Dashboard
        </Link>
        <Link 
          href="/archive" 
          className={`flex-1 text-center py-2 text-sm transition-colors ${pathname === '/archive' ? 'text-amber-500 font-semibold border-b-2 border-amber-500' : 'text-gray-400 hover:text-white'}`}
        >
          Archive
        </Link>
      </div>
    </nav>
  );
}
