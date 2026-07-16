import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const formData = await request.formData();
        const files = formData.getAll("images") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "Nenhuma imagem enviada" }, { status: 400 });
        }

        if (files.length > 8) {
            return NextResponse.json({ error: "Máximo de 8 imagens" }, { status: 400 });
        }

        const uploadDir = path.join(process.cwd(), "uploads", "images", "products");
        await mkdir(uploadDir, { recursive: true });

        const urls: string[] = [];

        for (const file of files) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                continue;
            }

            // Generate unique filename
            const ext = file.name.split(".").pop() || "jpg";
            const filename = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
            const filePath = path.join(uploadDir, filename);

            // Save file
            const bytes = await file.arrayBuffer();
            await writeFile(filePath, Buffer.from(bytes));

            // Store URL pointing to our API route (bypasses Next.js static manifest limitation)
            urls.push(`/api/images/${filename}`);
        }

        return NextResponse.json({ success: true, urls }, { status: 200 });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Erro ao fazer upload" }, { status: 500 });
    }
}
