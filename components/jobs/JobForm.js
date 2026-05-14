"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";


const PLATFORMS = [
  "LinkedIn",
  "Naukri",
  "Indeed",
  "Company Website",
  "Cold Email",
  "Referral",
  "Other",
];

const AVAILABLE_TAGS = [
  "Remote",
  "Hybrid",
  "On-site",
  "Startup",
  "Product",
  "Service",
  "Night Shift",
];

export default function JobForm({ initialData = null }) {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    companyName: initialData?.companyName || "",
    roleTitle: initialData?.roleTitle || "",
    platform: initialData?.platform || "LinkedIn",
    jobUrl: initialData?.jobUrl || "",
    salaryRange: initialData?.salaryRange || "",
    appliedDate: initialData?.appliedDate
      ? new Date(initialData.appliedDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    followUpDate: initialData?.followUpDate
      ? new Date(initialData.followUpDate).toISOString().split("T")[0]
      : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    recruiter: {
      name: initialData?.recruiter?.name || "",
      phone: initialData?.recruiter?.phone || "",
      email: initialData?.recruiter?.email || "",
      whatsapp: initialData?.recruiter?.whatsapp || "",
    },
    notes: initialData?.notes || "",
    interviewExperience: initialData?.interviewExperience || "",
    tags: initialData?.tags || [],
    screenshotUrl: initialData?.screenshotUrl || "",
    screenshotPublicId: initialData?.screenshotPublicId || "",
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const hasRecruiter =
    initialData?.recruiter?.name ||
    initialData?.recruiter?.email ||
    initialData?.recruiter?.phone ||
    initialData?.recruiter?.whatsapp;
  const [recruiterExpanded, setRecruiterExpanded] = useState(!!hasRecruiter);

  useEffect(() => {
    if (!initialData && formData.appliedDate) {
      const applied = new Date(formData.appliedDate);
      if (!isNaN(applied.getTime())) {
        const followUp = new Date(applied.getTime() + 5 * 24 * 60 * 60 * 1000);
        setFormData((prev) => ({
          ...prev,
          followUpDate: followUp.toISOString().split("T")[0],
        }));
      }
    }
  }, [formData.appliedDate, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("recruiter.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        recruiter: {
          ...prev.recruiter,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleTag = (tag) => {
    setFormData((prev) => {
      const isSelected = prev.tags.includes(tag);
      if (isSelected) {
        return { ...prev, tags: prev.tags.filter((t) => t !== tag) };
      } else {
        return { ...prev, tags: [...prev.tags, tag] };
      }
    });
  };

  const setPlatform = (platform) => {
    setFormData((prev) => ({ ...prev, platform }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setError(null);

      const body = new FormData();
      body.append("file", file);
      if (formData.screenshotPublicId) {
        body.append("oldPublicId", formData.screenshotPublicId);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        screenshotUrl: data.url,
        screenshotPublicId: data.publicId,
      }));
    } catch (err) {
      setError(err.message || "Something went wrong uploading the image.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      screenshotUrl: "",
      screenshotPublicId: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const method = initialData ? "PUT" : "POST";
      const endpoint = initialData ? `/api/jobs/${initialData._id}` : "/api/jobs";

      const platformMap = {
        LinkedIn: "linkedin",
        Naukri: "naukri",
        Indeed: "indeed",
        "Company Website": "company_website",
        "Cold Email": "cold_email",
        Referral: "referral",
        Other: "other",
      };

      const tagMap = {
        Remote: "remote",
        Hybrid: "hybrid",
        "On-site": "onsite",
        Startup: "startup",
        Product: "product",
        Service: "service",
        "Night Shift": "nightshift",
      };

      // Convert format for backend map
      const platformKey = Object.keys(platformMap).find(k => k.toLowerCase() === formData.platform.toLowerCase()) || formData.platform;

      const payload = {
        ...formData,
        platform: platformMap[platformKey] || "other",
        tags: formData.tags.map((t) => tagMap[t] || t.toLowerCase()),
      };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save job");
      }

      if (initialData?._id) {
        router.push(`/jobs/${initialData._id}`);
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-transparent border-b border-white/15 focus:border-b-2 focus:border-[#A5B2EB] outline-none text-white placeholder-white/25 py-2 transition-all duration-200";

  return (
    <form onSubmit={handleSubmit} className="w-full pb-32">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-6 rounded text-sm">
          {error}
        </div>
      )}

      <div className="space-y-12">
        {/* SECTION 1 - The Job */}
        <section className="pl-6 border-l-[3px] border-[#DDDE68]">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-6 font-semibold">The Job</h2>
          <div className="space-y-6">
            <div>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="Company Name *"
                className="w-full bg-transparent border-b border-white/15 focus:border-b-2 focus:border-[#DDDE68] outline-none text-white placeholder-white/25 py-2 transition-all duration-200 text-xl focus:text-2xl font-bold"
              />
            </div>
            <div>
              <input
                type="text"
                name="roleTitle"
                value={formData.roleTitle}
                onChange={handleChange}
                required
                placeholder="Role Title *"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-3">Platform</label>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((p) => {
                  const isSelected = formData.platform.toLowerCase() === p.toLowerCase() || (formData.platform === 'company_website' && p === 'Company Website') || (formData.platform === 'cold_email' && p === 'Cold Email');
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`px-4 py-2 text-sm font-medium rounded-none transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-[#DDDE68] text-[#1E2030] shadow-[3px_3px_0px_rgba(0,0,0,0.5)] border border-[#DDDE68]"
                          : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <input
                type="url"
                name="jobUrl"
                value={formData.jobUrl}
                onChange={handleChange}
                placeholder="Job URL"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* SECTION 2 - Timeline & Media */}
        <section className="pl-6 border-l-[3px] border-[#A5B2EB]">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-6 font-semibold">Timeline & Media</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Applied Date *</label>
                <input
                  type="date"
                  name="appliedDate"
                  value={formData.appliedDate}
                  onChange={handleChange}
                  required
                  className={inputClass + " [color-scheme:dark]"}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Follow-up Date *</label>
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  required
                  className={inputClass + " [color-scheme:dark]"}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-3">Screenshot</label>
              {formData.screenshotUrl ? (
                <div className="relative border border-white/10 rounded-xl overflow-hidden group max-w-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.screenshotUrl}
                    alt="Job Screenshot"
                    className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-[#1E2030] text-white p-2 rounded-none border border-white/10 shadow-[3px_3px_0px_rgba(0,0,0,0.5)] hover:-translate-y-[1px] transition-all cursor-pointer"
                      title="Remove Image"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#A5B2EB]/50 hover:bg-white/5 transition-colors ${
                    uploadingImage ? "opacity-50 pointer-events-none" : ""
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg className="w-8 h-8 text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16l-4-4-4 4M12 12v9"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
                  <span className="text-sm text-gray-400 font-medium">
                    {uploadingImage ? "Uploading..." : "Drop screenshot here or click to upload"}
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 3 - Recruiter */}
        <section className="pl-6 border-l-[3px] border-[#DA935D]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Recruiter</h2>
            <button
              type="button"
              onClick={() => setRecruiterExpanded(!recruiterExpanded)}
              className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              {recruiterExpanded ? "Hide Details" : "Add Recruiter Details"}
              {recruiterExpanded ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>}
            </button>
          </div>
          
          {recruiterExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <input
                type="text"
                name="recruiter.name"
                value={formData.recruiter.name}
                onChange={handleChange}
                placeholder="Name"
                className={inputClass}
              />
              <input
                type="email"
                name="recruiter.email"
                value={formData.recruiter.email}
                onChange={handleChange}
                placeholder="Email"
                className={inputClass}
              />
              <input
                type="text"
                name="recruiter.phone"
                value={formData.recruiter.phone}
                onChange={handleChange}
                placeholder="Phone"
                className={inputClass}
              />
              <input
                type="text"
                name="recruiter.whatsapp"
                value={formData.recruiter.whatsapp}
                onChange={handleChange}
                placeholder="WhatsApp"
                className={inputClass}
              />
            </div>
          )}
        </section>

        {/* SECTION 4 - Extra */}
        <section className="pl-6 border-l-[3px] border-[#7CCDE5]">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-6 font-semibold">Extra</h2>
          <div className="space-y-6">
            <div>
              <input
                type="text"
                name="salaryRange"
                value={formData.salaryRange}
                onChange={handleChange}
                placeholder="Salary Range (e.g. $120k - $150k)"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-3">Tags</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => {
                  // Map to backend string format for checking
                  const tagMap = {
                    Remote: "remote",
                    Hybrid: "hybrid",
                    "On-site": "onsite",
                    Startup: "startup",
                    Product: "product",
                    Service: "service",
                    "Night Shift": "nightshift",
                  };
                  const backendTag = tagMap[tag] || tag.toLowerCase();
                  const isSelected = formData.tags.includes(tag) || formData.tags.includes(backendTag);
                  
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 text-xs font-medium rounded-none transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-[#7CCDE5] text-[#1E2030] shadow-[2px_2px_0px_rgba(0,0,0,0.5)] border border-[#7CCDE5]"
                          : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Dump everything you know here..."
                className={inputClass + " resize-y min-h-[80px]"}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Interview Experience</label>
              <textarea
                name="interviewExperience"
                value={formData.interviewExperience}
                onChange={handleChange}
                rows={3}
                placeholder="What happened in the interview..."
                className={inputClass + " resize-y min-h-[80px]"}
              />
            </div>
          </div>
        </section>
      </div>

      {/* STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-[#1E2030] border-t border-white/10 px-6 py-4 flex justify-end items-center gap-4 z-50">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="text-white hover:text-gray-300 font-medium px-4 py-2 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#DDDE68] text-[#1E2030] px-6 py-2 rounded font-bold shadow-[3px_3px_0px_rgba(0,0,0,0.5)] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_rgba(0,0,0,0.5)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : initialData ? "Save Changes" : "Submit"}
        </button>
      </div>
    </form>
  );
}
