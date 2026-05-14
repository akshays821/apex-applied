import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    await dbConnect();

    // Default sort order defined in plan: Overdue -> Due Today -> On Track -> by appliedDate desc
    // In database we just fetch them, frontend can sort, but returning them sorted is better.
    // However, the urgency states are dynamic based on 'today'. We'll just sort by appliedDate desc here.
    // The Follow-up engine frontend handles the exact group sorting.
    const jobs = await Job.find({ userId: session.user.id })
      .sort({ appliedDate: -1 })
      .lean();

    // Handle _id to id conversion
    const formattedJobs = jobs.map((job) => ({
      ...job,
      _id: job._id.toString(),
      id: job._id.toString(),
      userId: job.userId.toString(),
    }));

    return new Response(JSON.stringify(formattedJobs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    await dbConnect();

    const body = await req.json();

    const PALETTE = ['#DDDE68', '#A5B2EB', '#DA935D', '#7CCDE5', '#676386', '#9F9BDE'];
    const jobCount = await Job.countDocuments({ userId: session.user.id });
    const accentColor = PALETTE[jobCount % PALETTE.length];

    // Add initial timeline entry
    const newJobData = {
      ...body,
      userId: session.user.id,
      accentColor,
      timeline: [
        {
          event: `Applied via ${body.platform}`,
          type: "auto",
          createdAt: new Date(),
        },
      ],
    };

    const newJob = await Job.create(newJobData);

    const jobObj = newJob.toObject();
    jobObj.id = jobObj._id.toString();

    return new Response(JSON.stringify(jobObj), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST /api/jobs error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
