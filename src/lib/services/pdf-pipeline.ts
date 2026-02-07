import { extractTextFromPDF } from "./pdf-extractor";
import { AIExtractor, AIProvider } from "./ai-extractor";

export type PipelineResult = {
    success: boolean;
    data?: any;
    confidence?: Record<string, number>;
    warnings?: string[];
    isScanned?: boolean;
    error?: string;
    stage?: string; // "upload" | "ocr" | "ai" | "complete"
};

export class JobExtractionPipeline {
    private aiExtractor: AIExtractor;

    constructor(provider: AIProvider = "gemini", apiKey?: string) {
        this.aiExtractor = new AIExtractor({
            provider,
            apiKey,
            model: "gemini-1.5-flash"
        });
    }

    async process(fileBuffer: Buffer): Promise<PipelineResult> {
        try {
            // STEP 1: Text Extraction (Native or OCR)
            console.log("Pipeline: Starting Extraction...");
            const extraction = await extractTextFromPDF(fileBuffer);

            if (!extraction.text || extraction.text.length < 50) {
                return {
                    success: false,
                    error: "No readable text found even after OCR.",
                    stage: "ocr"
                };
            }

            console.log(`Pipeline: Extracted ${extraction.text.length} chars. (Scanned: ${extraction.isScanned})`);

            // STEP 2: AI Extraction
            console.log("Pipeline: Starting AI Analysis...");
            const aiResult = await this.aiExtractor.extract(extraction.text);

            // STEP 3: Combine & Validate
            return {
                success: true,
                data: aiResult.data,
                confidence: {
                    ...aiResult.fieldConfidence,
                    ocr_confidence: extraction.confidence
                },
                warnings: [
                    ...aiResult.warnings,
                    ...(extraction.isScanned ? ["Doc was scanned (OCR used). Accuracy might be lower."] : [])
                ],
                isScanned: extraction.isScanned,
                stage: "complete"
            };

        } catch (error: any) {
            console.error("Pipeline Error:", error);
            return {
                success: false,
                error: error.message || "Unknown Pipeline Error",
                stage: "unknown"
            };
        }
    }
}
