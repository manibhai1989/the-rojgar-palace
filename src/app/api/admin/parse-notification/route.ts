import { NextRequest, NextResponse } from "next/server";
import { JobExtractionPipeline } from "@/lib/services/pdf-pipeline";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Force Node.js runtime for Tesseract.js file handling (and now Buffer handling)
export const runtime = 'nodejs';
export const maxDuration = 60; // Increase timeout to 60s (Vercel Pro/Hobby limits vary)

export async function POST(req: NextRequest) {
    console.log("API: Job Extraction Pipeline Triggered");

    // SECURITY: Verify authentication before processing
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({
            error: "Unauthorized",
            message: "Authentication required to access this endpoint"
        }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Determine Provider
        const provider = (process.env.NEXT_PUBLIC_AI_PROVIDER as any) || "gemini";
        const apiKey = provider === "gemini" ? process.env.GOOGLE_API_KEY :
            provider === "groq" ? process.env.GROQ_API_KEY :
                undefined;

        // Validation for Gemini
        if (provider === "gemini" && !apiKey) {
            return NextResponse.json({
                error: "Configuration Error",
                message: "GOOGLE_API_KEY is missing in .env.local. Cannot use Gemini."
            }, { status: 500 });
        }

        // Initialize Pipeline
        const pipeline = new JobExtractionPipeline(provider, apiKey);

        console.log("Running Pipeline...");
        const result = await pipeline.process(buffer);

        if (!result.success) {
            return NextResponse.json({
                error: result.error,
                stage: result.stage
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: result.data,
            meta: {
                isScanned: result.isScanned,
                warnings: result.warnings,
                confidence: result.confidence
            }
        });

    } catch (e: any) {
        console.error("API Critical Fail:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
