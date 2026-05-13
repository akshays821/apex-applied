import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "apex_applied" }, (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            resolve(
              new Response(JSON.stringify({ error: "Upload failed" }), {
                status: 500,
              })
            );
          } else {
            resolve(
              new Response(
                JSON.stringify({
                  url: result.secure_url,
                  publicId: result.public_id,
                }),
                { status: 200 }
              )
            );
          }
        })
        .end(buffer);
    });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
