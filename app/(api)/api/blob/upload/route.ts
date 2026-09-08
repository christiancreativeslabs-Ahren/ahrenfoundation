import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Optional: add auth check here (session / admin role)
        // Only allow uploads under the resources/ prefix
        if (!pathname.startsWith("resources/")) {
          throw new Error("Invalid upload path");
        }

        return {
          allowedContentTypes: [
            "application/pdf",
            "image/png",
            "image/jpeg",
            "image/webp",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/plain",
            "application/zip",
          ],
          maximumSizeInBytes: 25 * 1024 * 1024, // 25 MB
          tokenPayload: JSON.stringify({}), // optional metadata
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Optional: you can do post-processing here
        console.log("Blob upload completed", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
