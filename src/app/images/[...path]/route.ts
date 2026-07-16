import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path: pathSegments } = await params;
        const filePath = path.join(process.cwd(), "public", ...pathSegments);

        // Security: prevent directory traversal
        const resolved = path.resolve(filePath);
        const publicDir = path.resolve(path.join(process.cwd(), "public"));
        if (!resolved.startsWith(publicDir)) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const data = await fs.readFile(resolved);
        const ext = path.extname(resolved).toLowerCase();
        const mimeTypes: Record<string, string> = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".webp": "image/webp",
            ".svg": "image/svg+xml",
            ".ico": "image/x-icon",
        };

        const contentType = mimeTypes[ext] || "application/octet-stream";
        return new NextResponse(data, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error: any) {
        if (error.code === "ENOENT") {
            return new NextResponse("Not Found", { status: 404 });
        }
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
