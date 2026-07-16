import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ filename: string }> }
) {
    const { filename } = await params;

    // Security: prevent directory traversal
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
        return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    // Supported extensions
    const ext = filename.split(".").pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
        avif: "image/avif",
        svg: "image/svg+xml",
    };

    if (!ext || !mimeTypes[ext]) {
        return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    try {
        // Try reading from the uploads directory first (new uploads)
        const uploadPath = path.join(process.cwd(), "uploads", "images", "products", filename);
        
        let fileBuffer: Buffer;
        try {
            fileBuffer = await readFile(uploadPath);
        } catch {
            // Fallback to public directory (old uploads that existed at build time)
            const publicPath = path.join(process.cwd(), "public", "images", "products", filename);
            fileBuffer = await readFile(publicPath);
        }

        return new NextResponse(new Uint8Array(fileBuffer), {
            status: 200,
            headers: {
                "Content-Type": mimeTypes[ext],
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
}
