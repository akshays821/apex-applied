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
      });
    }

    await dbConnect();

    const now = new Date();
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Find all potential jobs to archive
    // 1. Active jobs applied >= 30 days ago
    // 2. Rejected jobs updated >= 7 days ago
    const jobsToCheck = await Job.find({
      userId: session.user.id,
      isLocked: false,
      $or: [
        { status: "active", appliedDate: { $lte: thirtyDaysAgo } },
        { status: "rejected", updatedAt: { $lte: sevenDaysAgo } }
      ]
    });

    let archivedCount = 0;

    for (const job of jobsToCheck) {
      if (job.status === "active") {
        job.status = "archived";
        job.timeline.push({
          event: "Auto-archived — no response in 30 days",
          type: "auto",
          createdAt: new Date()
        });
        await job.save();
        archivedCount++;
      } else if (job.status === "rejected") {
        job.status = "archived";
        job.timeline.push({
          event: "Auto-archived — rejected",
          type: "auto",
          createdAt: new Date()
        });
        await job.save();
        archivedCount++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, archivedCount }),
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/jobs/check-archive error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
