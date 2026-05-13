import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await dbConnect();
    const { id } = await params; // Destructure awaited params

    const job = await Job.findOne({ _id: id, userId: session.user.id }).lean();

    if (!job) {
      return new Response(JSON.stringify({ error: "Job not found" }), {
        status: 404,
      });
    }

    job.id = job._id.toString();
    job._id = job._id.toString();
    job.userId = job.userId.toString();

    return new Response(JSON.stringify(job), { status: 200 });
  } catch (error) {
    console.error("GET /api/jobs/[id] error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const updatedJob = await Job.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: body },
      { new: true }
    ).lean();

    if (!updatedJob) {
      return new Response(JSON.stringify({ error: "Job not found" }), {
        status: 404,
      });
    }

    updatedJob.id = updatedJob._id.toString();
    updatedJob._id = updatedJob._id.toString();

    return new Response(JSON.stringify(updatedJob), { status: 200 });
  } catch (error) {
    console.error("PUT /api/jobs/[id] error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await dbConnect();
    const { id } = await params;

    const deletedJob = await Job.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!deletedJob) {
      return new Response(JSON.stringify({ error: "Job not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("DELETE /api/jobs/[id] error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
