import React from "react";
import Card from "../ui/Card";

export default function RecruiterContact({ recruiter }) {
  if (!recruiter || (!recruiter.name && !recruiter.phone && !recruiter.email && !recruiter.whatsapp)) {
    return (
      <Card className="p-6 h-full !cursor-default !hover:translate-x-0 !hover:translate-y-0 !hover:shadow-[4px_4px_0px_#F59E0B]">
        <h3 className="text-xl font-bold tracking-tight text-white mb-4">Recruiter</h3>
        <p className="text-gray-500 text-sm">No recruiter contact details provided.</p>
      </Card>
    );
  }

  const cleanPhoneForWa = (phone) => phone ? phone.replace(/[^0-9+]/g, '') : '';

  return (
    <Card className="p-6 h-full !cursor-default !hover:translate-x-0 !hover:translate-y-0 !hover:shadow-[4px_4px_0px_#F59E0B]">
      <h3 className="text-xl font-bold tracking-tight text-white mb-4">Recruiter</h3>
      <div className="space-y-4">
        {recruiter.name && (
          <div>
            <p className="text-sm font-semibold text-gray-500">Name</p>
            <p className="text-gray-200 font-medium">{recruiter.name}</p>
          </div>
        )}

        {recruiter.email && (
          <div>
            <p className="text-sm font-semibold text-gray-500">Email</p>
            <a 
              href={`mailto:${recruiter.email}`}
              className="text-amber-500 hover:text-amber-400 transition-colors inline-flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              {recruiter.email}
            </a>
          </div>
        )}

        <div className="flex gap-6">
          {recruiter.phone && (
            <div>
              <p className="text-sm font-semibold text-gray-500">Phone</p>
              <a 
                href={`tel:${recruiter.phone}`}
                className="text-gray-200 hover:text-white transition-colors inline-flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {recruiter.phone}
              </a>
            </div>
          )}

          {recruiter.whatsapp && (
            <div>
              <p className="text-sm font-semibold text-gray-500">WhatsApp</p>
              <a 
                href={`https://wa.me/${cleanPhoneForWa(recruiter.whatsapp)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-400 transition-colors inline-flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                Chat
              </a>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
