import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    roleTitle: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      enum: [
        "linkedin",
        "naukri",
        "indeed",
        "company_website",
        "cold_email",
        "referral",
        "other",
      ],
      required: true,
    },
    jobUrl: {
      type: String,
    },
    salaryRange: {
      type: String,
    },
    screenshotUrl: {
      type: String,
    },
    screenshotPublicId: {
      type: String,
    },
    appliedDate: {
      type: Date,
      required: true,
    },
    followUpDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "responded", "rejected", "archived"],
      default: "active",
      required: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    recruiter: {
      name: String,
      phone: String,
      email: String,
      whatsapp: String,
    },
    followUpChecklist: {
      called: {
        type: Boolean,
        default: false,
      },
      whatsappSent: {
        type: Boolean,
        default: false,
      },
      emailSent: {
        type: Boolean,
        default: false,
      },
    },
    tags: [
      {
        type: String,
        enum: [
          "remote",
          "hybrid",
          "onsite",
          "startup",
          "product",
          "service",
          "nightshift",
        ],
      },
    ],
    notes: {
      type: String,
    },
    timeline: [
      {
        event: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["auto", "manual"],
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for performance optimization
JobSchema.index({ userId: 1 });
JobSchema.index({ status: 1 });
JobSchema.index({ followUpDate: 1 });
JobSchema.index({ appliedDate: 1 });

const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);

export default Job;
