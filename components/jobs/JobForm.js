"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";
// Assuming lucide-react or heroicons are available, but we can use pure SVG if we don't have them installed. Let's use pure SVG to be safe.

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
    tags: initialData?.tags || [],
    screenshotUrl: initialData?.screenshotUrl || "",
    screenshotPublicId: initialData?.screenshotPublicId || "",
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  // Update followUpDate when appliedDate changes
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

      // Transform format slightly for backend (platform to lowercase mapping usually, but we can pass as is and handle in model/api or convert here)
      // The model enum: linkedin | naukri | indeed | company_website | cold_email | referral | other
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

      const payload = {
        ...formData,
        platform: platformMap[formData.platform] || "other",
        tags: formData.tags.map((t) => tagMap[t]),
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
      router.refresh(); // Ensure the layout picks up new data
    } catch (err) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto !cursor-default !hover:translate-x-0 !hover:translate-y-0 !hover:shadow-[4px_4px_0px_#F59E0B]">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-sm text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company & Role */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold tracking-tight text-white border-b border-white/10 pb-2">
              Job Basics
            </h3>
            
            <Input
              label="Company Name *"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="e.g. Google"
            />

            <Input
              label="Role Title *"
              name="roleTitle"
              value={formData.roleTitle}
              onChange={handleChange}
              required
              placeholder="e.g. Senior Frontend Engineer"
            />

            <div className="flex flex-col w-full">
              <label className="mb-1.5 text-sm font-semibold text-gray-300">
                Platform
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="bg-[#111111] text-white border border-white/10 rounded-sm px-3 py-2.5 w-full focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors duration-200"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Job URL"
              name="jobUrl"
              type="url"
              value={formData.jobUrl}
              onChange={handleChange}
              placeholder="https://..."
            />

            <Input
              label="Salary Range"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              placeholder="e.g. $120k - $150k"
            />
          </div>

          {/* Dates & Upload */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold tracking-tight text-white border-b border-white/10 pb-2">
              Timeline & Media
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Applied Date *"
                name="appliedDate"
                type="date"
                value={formData.appliedDate}
                onChange={handleChange}
                required
              />
              <Input
                label="Follow-up Date *"
                name="followUpDate"
                type="date"
                value={formData.followUpDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-1.5 text-sm font-semibold text-gray-300">
                Screenshot (Optional)
              </label>
              
              {formData.screenshotUrl ? (
                <div className="relative border border-white/10 rounded-sm overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.screenshotUrl}
                    alt="Job Screenshot"
                    className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-red-500 text-white p-1 rounded-sm shadow-[2px_2px_0px_rgba(0,0,0,0.8)] hover:-translate-y-[1px] transition-all"
                      title="Remove Image"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed border-white/20 rounded-sm p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-500/50 hover:bg-white/5 transition-colors ${
                    uploadingImage ? "opacity-50 pointer-events-none" : ""
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="text-sm text-gray-400 font-medium">
                    {uploadingImage ? "Uploading..." : "Click to upload screenshot"}
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
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-300">Tags</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map((tag) => {
              const isSelected = formData.tags.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-sm font-medium rounded-sm border transition-all duration-200 ${
                    isSelected
                      ? "bg-amber-500 text-black border-amber-600 shadow-[2px_2px_0px_rgba(0,0,0,0.8)]"
                      : "bg-[#111111] text-gray-400 border-white/10 hover:border-white/30 hover:text-gray-200"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recruiter Details */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold tracking-tight text-white border-b border-white/10 pb-2">
            Recruiter Details <span className="text-gray-500 text-sm font-normal ml-2">(Optional)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              name="recruiter.name"
              value={formData.recruiter.name}
              onChange={handleChange}
              placeholder="e.g. Jane Doe"
            />
            <Input
              label="Email"
              name="recruiter.email"
              type="email"
              value={formData.recruiter.email}
              onChange={handleChange}
              placeholder="jane@company.com"
            />
            <Input
              label="Phone"
              name="recruiter.phone"
              value={formData.recruiter.phone}
              onChange={handleChange}
              placeholder="+1 234 567 890"
            />
            <Input
              label="WhatsApp"
              name="recruiter.whatsapp"
              value={formData.recruiter.whatsapp}
              onChange={handleChange}
              placeholder="Same as phone or different"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col w-full space-y-1.5">
          <label className="text-sm font-semibold text-gray-300">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Interviewer seemed nice. Focused on React performance..."
            className="bg-[#111111] text-white placeholder-gray-500 border border-white/10 rounded-sm px-3 py-2.5 w-full focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors duration-200 resize-y"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : initialData ? "Save Changes" : "Add Job"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
