import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;
    const userId = formData.get("userId") as string;
    
    if (!file || !type || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Log the request for debugging
    console.log("Server received upload request:", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      docType: type,
      userId: userId.substring(0, 5) + "..." // Log partial userId for security
    });

    // For now, we'll simulate a successful upload
    // In a real environment, you would implement actual Firebase Admin logic here
    // or use a different storage solution
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return success with fake URL
    // In production, replace this with real implementation
    return NextResponse.json({
      success: true,
      documentId: `server-doc-${Date.now()}`,
      url: `https://firebasestorage.googleapis.com/v0/b/example-bucket/o/documents%2F${userId}%2F${type}%2F${encodeURIComponent(file.name)}?alt=media`,
      message: "This is a simulated upload response. In production, implement Firebase Admin SDK integration."
    });
  } catch (error) {
    console.error("Server upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
} 