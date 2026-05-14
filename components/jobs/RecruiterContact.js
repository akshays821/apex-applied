import React from "react";

export default function RecruiterContact({ recruiter, accentColor }) {
  if (!recruiter || (!recruiter.name && !recruiter.phone && !recruiter.email && !recruiter.whatsapp)) {
    return (
      <div className="bg-[#494C65] rounded-sm shadow-[3px_3px_0px_rgba(0,0,0,0.4)] p-8 border border-white/10 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">No Recruiter Info</h3>
        <p className="text-gray-400 text-sm">Add contact details by editing the job.</p>
      </div>
    );
  }

  const cleanPhoneForWa = (phone) => phone ? phone.replace(/[^0-9+]/g, '') : '';

  return (
    <div className="bg-[#494C65] rounded-sm shadow-[3px_3px_0px_rgba(0,0,0,0.4)] p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-6">Recruiter Contact</h3>
      <div className="space-y-6">
        {recruiter.name && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Name</p>
            <p className="text-lg text-white font-medium">{recruiter.name}</p>
          </div>
        )}

        {recruiter.email && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</p>
            <a 
              href={`mailto:${recruiter.email}`}
              className="inline-flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-sm border border-white/10 transition-colors w-full sm:w-auto"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {recruiter.email}
            </a>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          {recruiter.phone && (
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone</p>
              <a 
                href={`tel:${recruiter.phone}`}
                className="inline-flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-sm border border-white/10 transition-colors w-full"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {recruiter.phone}
              </a>
            </div>
          )}

          {recruiter.whatsapp && (
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">WhatsApp</p>
              <a 
                href={`https://wa.me/${cleanPhoneForWa(recruiter.whatsapp)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-4 py-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-medium rounded-sm border border-[#25D366]/20 transition-colors w-full"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Message
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
