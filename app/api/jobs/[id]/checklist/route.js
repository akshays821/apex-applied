import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await dbConnect();
    const { id } = await params;
    const updates = await req.json(); // e.g. { called: true }

    const job = await Job.findOne({ _id: id, userId: session.user.id });

    if (!job) {
      return new Response(JSON.stringify({ error: "Job not found" }), {
        status: 404,
      });
    }

    // Merge updates into followUpChecklist
    job.followUpChecklist = {
      ...job.followUpChecklist.toObject(),
      ...updates,
    };

    await job.save();

    const updatedJob = job.toObject();
    updatedJob.id = updatedJob._id.toString();

    return new Response(JSON.stringify(updatedJob), { status: 200 });
  } catch (error) {
    console.error("PATCH /api/jobs/[id]/checklist error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
