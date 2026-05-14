import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await dbConnect();
    const { id } = await params;
    const { event, type = "manual" } = await req.json();

    if (!event || event.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Event text is required" }),
        { status: 400 }
      );
    }

    const job = await Job.findOne({ _id: id, userId: session.user.id });

    if (!job) {
      return new Response(JSON.stringify({ error: "Job not found" }), {
        status: 404,
      });
    }

    job.timeline.push({
      event: event.trim(),
      type,
      createdAt: new Date(),
    });

    await job.save();

    const updatedJob = job.toObject();
    updatedJob.id = updatedJob._id.toString();

    return new Response(JSON.stringify(updatedJob), { status: 201 });
  } catch (error) {
    console.error("POST /api/jobs/[id]/timeline error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
