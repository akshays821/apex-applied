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
    const { isLocked } = await req.json();

    if (typeof isLocked !== "boolean") {
      return new Response(JSON.stringify({ error: "isLocked must be a boolean" }), {
        status: 400,
      });
    }

    const job = await Job.findOne({ _id: id, userId: session.user.id });

    if (!job) {
      return new Response(JSON.stringify({ error: "Job not found" }), {
        status: 404,
      });
    }

    job.isLocked = isLocked;
    job.timeline.push({
      event: isLocked ? "Locked" : "Unlocked",
      type: "auto",
      createdAt: new Date(),
    });

    await job.save();

    const updatedJob = job.toObject();
    updatedJob.id = updatedJob._id.toString();

    return new Response(JSON.stringify(updatedJob), { status: 200 });
  } catch (error) {
    console.error("PATCH /api/jobs/[id]/lock error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
