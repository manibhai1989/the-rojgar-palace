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
        // Select appropriate default model based on provider
        let defaultModel;
        if (provider === "gemini") defaultModel = "gemini-1.5-flash-001";
        else if (provider === "groq") defaultModel = "llama-3.3-70b-versatile";
        else if (provider === "ollama") defaultModel = "llama3";

        this.aiExtractor = new AIExtractor({
            provider,
            apiKey,
            model: defaultModel
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
            let ocrUsed = extraction.isScanned; // If scanned, we either used Tesseract (in step 1) or will use Gemini

            if (extraction.isScanned) {
                console.log("Pipeline: Scanned PDF detected.");

                // OPTIMIZATION:
                // If Gemini is the provider, Ignore the Tesseract result (which might be empty or slow)
                // and use Multimodal for better quality.

                if ((this.aiExtractor as any).config.provider === "gemini") {
                    console.log("Pipeline: Using Gemini Multimodal (Better than Tesseract).");
                    aiResult = await this.aiExtractor.extractFromBuffer(fileBuffer, "application/pdf");
                    ocrUsed = true;
                } else {
                    // For Ollama/Groq, we rely on the Tesseract result we just got in Step 1 (or failed to get)
                    if (!extraction.text || extraction.text.length < 50) {
                        return {
                            success: false,
                            error: "Scanned PDF detected but OCR failed to interpret text. Try a clearer PDF.",
                            stage: "ocr"
                        };
                    }
                    console.log("Pipeline: Using Tesseract OCR Text for AI.");
                    aiResult = await this.aiExtractor.extract(extraction.text);
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
