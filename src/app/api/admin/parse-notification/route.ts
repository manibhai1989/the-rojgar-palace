import { NextRequest, NextResponse } from "next/server";
import { JobExtractionPipeline } from "@/lib/services/pdf-pipeline";

// Force Node.js runtime for Tesseract.js file handling (and now Buffer handling)
export const runtime = 'nodejs';
export const maxDuration = 60; // Increase timeout to 60s (Vercel Pro/Hobby limits vary)

export async function POST(req: NextRequest) {
    console.log("API: Job Extraction Pipeline Triggered");

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Initialize Pipeline (Default to Gemini)
        const pipeline = new JobExtractionPipeline(
            "gemini",
            process.env.GOOGLE_API_KEY
        );

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
