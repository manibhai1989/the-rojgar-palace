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
            // STEP 1: Text Extraction (Native)
            console.log("Pipeline: Starting Native Extraction...");
            const extraction = await extractTextFromPDF(fileBuffer);

            // Check if scanned (Low confidence or empty text)
            // Note: extractTextFromPDF returns confidence=1 for text, but we check 'isScanned' boolean
            // If pdf2json returns empty string or very little text, 'isScanned' is true.

            let aiResult;
            let ocrUsed = false;

            if (extraction.isScanned) {
                console.log("Pipeline: Scanned PDF detected.");

                // FALLBACK STRATEGY:
                // 1. If Gemini -> Use Multimodal (Send PDF buffer directly) - FAST & BETTER
                // 2. If Others -> Use Tesseract (Slower, but necessary for Ollama/Groq) - LEGACY

                if ((this.aiExtractor as any).config.provider === "gemini") {
                    console.log("Pipeline: Using Gemini Multimodal (No Tesseract needed).");
                    aiResult = await this.aiExtractor.extractFromBuffer(fileBuffer, "application/pdf");
                    ocrUsed = true; // Effectively "OCR'd" by Gemini
                } else {
                    // For Ollama/Groq, we MUST have text. 
                    // Since we removed Tesseract logic from here to avoid timeouts, we throw error or return what we have.
                    // IMPORTANT: To keep it light, we are SKIPPING local Tesseract for now.
                    console.warn("Pipeline: Scanned PDF + Non-Gemini Provider -> Cannot process without heavy OCR.");
                    return {
                        success: false,
                        error: "Scanned PDF detected. Please use Gemini Provider for automatic OCR, or upload a text-based PDF.",
                        stage: "ocr"
                    };
                }

            } else {
                // Standard Text Extraction
                console.log(`Pipeline: Extracted ${extraction.text.length} chars. (Native Text)`);
                aiResult = await this.aiExtractor.extract(extraction.text);
            }

            // STEP 3: Combine & Validate
            return {
                success: true,
                data: aiResult.data,
                confidence: {
                    ...aiResult.fieldConfidence,
                    ocr_confidence: ocrUsed ? 0.9 : extraction.confidence
                },
                warnings: [
                    ...aiResult.warnings,
                    ...(ocrUsed ? ["Processed as Image/Scanned Document (Multimodal)."] : [])
                ],
                isScanned: ocrUsed,
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
